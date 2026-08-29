import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(
    @MessageBody() data: { channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.channelId);
    console.log(`Client ${client.id} joined channel ${data.channelId}`);
    return { event: 'joined', data: data.channelId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { channelId: string; userId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Save to database
      const message = await this.prisma.message.create({
        data: {
          channelId: data.channelId,
          userId: data.userId,
          content: data.content,
        },
        include: {
          user: true, // Need user details for the UI
        }
      });

      // Broadcast to everyone in the channel (including sender so we know it saved)
      this.server.to(data.channelId).emit('newMessage', message);
      
      return { status: 'success' };
    } catch (error) {
      console.error('Error saving message:', error);
      return { status: 'error', message: 'Failed to send message' };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { channelId: string; userId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast typing indicator to others in the channel
    client.to(data.channelId).emit('userTyping', data);
  }

  // --- WebRTC Signaling for Video Calls & File Sharing ---
  
  @SubscribeMessage('webrtc-offer')
  handleOffer(
    @MessageBody() data: { targetUserId: string; callerUserId: string; sdp: any; type: 'video' | 'file' },
    @ConnectedSocket() client: Socket,
  ) {
    // In a real app we'd map targetUserId to their Socket ID. 
    // For this prototype, we'll broadcast to the room if they share one, or rely on client filtering.
    // Assuming they are in the same channel, we can broadcast the offer.
    client.broadcast.emit('webrtc-offer-received', data);
  }

  @SubscribeMessage('webrtc-answer')
  handleAnswer(
    @MessageBody() data: { targetUserId: string; responderUserId: string; sdp: any; type: 'video' | 'file' },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('webrtc-answer-received', data);
  }

  @SubscribeMessage('webrtc-ice-candidate')
  handleIceCandidate(
    @MessageBody() data: { targetUserId: string; senderUserId: string; candidate: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('webrtc-ice-candidate-received', data);
  }
}
