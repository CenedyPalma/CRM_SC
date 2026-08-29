'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, MailIcon, PhoneIcon, StickyNoteIcon } from "lucide-react";

type Activity = {
  id: string;
  type: 'NOTE' | 'EMAIL' | 'CALL' | 'MEETING' | 'SYSTEM';
  title?: string;
  content: string;
  createdAt: string;
};

export function ActivityTimeline({ entityType, entityId }: { entityType: 'contact' | 'deal' | 'company', entityId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchActivities();
  }, [entityId]);

  const fetchActivities = async () => {
    try {
      const res = await fetch(`/api/crm/activities?${entityType}Id=${entityId}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (e) {
      console.error('Failed to fetch activities', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const res = await fetch(`/api/crm/activities`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'NOTE',
          content: newNote,
          [`${entityType}Id`]: entityId
        })
      });
      
      if (res.ok) {
        setNewNote('');
        fetchActivities();
      }
    } catch (e) {
      console.error('Failed to add note', e);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'EMAIL': return <MailIcon className="w-4 h-4 text-blue-500" />;
      case 'CALL': return <PhoneIcon className="w-4 h-4 text-green-500" />;
      case 'MEETING': return <CalendarIcon className="w-4 h-4 text-purple-500" />;
      default: return <StickyNoteIcon className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
        <div className="space-y-4">
          <textarea 
            placeholder="Leave a note..." 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <button className="px-3 py-1.5 border border-zinc-700 hover:bg-zinc-800 text-xs font-medium text-zinc-300 rounded-md transition-colors">Log Call</button>
            <button className="px-3 py-1.5 border border-zinc-700 hover:bg-zinc-800 text-xs font-medium text-zinc-300 rounded-md transition-colors">Log Email</button>
            <button onClick={handleAddNote} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white rounded-md transition-colors">Save Note</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-zinc-500 text-center">Loading timeline...</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">No activity yet. Add a note to get started!</p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800/50 flex flex-row items-center space-x-3 bg-zinc-900/50">
                <div className="p-1.5 bg-zinc-800 rounded-full">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-zinc-200">{activity.type}</h3>
                  <p className="text-xs text-zinc-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{activity.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
