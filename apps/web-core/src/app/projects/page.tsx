import { getTenantHeaders } from "../../lib/auth";
import { Layout, Plus, MoreHorizontal, MessageSquare, Clock, AlignLeft } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

async function getProjects() {
  try {
    const res = await fetch("http://localhost:3017/projects", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const currentProject = projects[0];

  async function createTask(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const projectId = formData.get("projectId") as string;
    if (!title || !projectId) return;

    await fetch(`http://localhost:3017/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-tenant-id": "default-tenant" 
      },
      body: JSON.stringify({ title, status: "TODO" })
    });
    
    revalidatePath("/projects");
  }

  async function updateTaskStatus(id: string, status: string) {
    "use server";
    await fetch(`http://localhost:3017/projects/tasks/${id}/status`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "x-tenant-id": "default-tenant" 
      },
      body: JSON.stringify({ status })
    });
    revalidatePath("/projects");
  }

  const columns = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "REVIEW", title: "Review" },
    { id: "DONE", title: "Done" }
  ];

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        No projects found.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Layout size={24} className="text-indigo-500" />
            <h1 className="text-2xl font-semibold text-white tracking-tight">{currentProject.name}</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">Manage project tasks and kanban board.</p>
        </div>
        <div className="flex items-center space-x-3">
          <form action={createTask} className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-md p-1 pl-2">
            <input type="hidden" name="projectId" value={currentProject.id} />
            <input 
              type="text" 
              name="title" 
              placeholder="New task..." 
              required
              className="w-48 bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500"
            />
            <button type="submit" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded transition-colors flex items-center">
              <Plus size={16} className="mr-1" /> Add Task
            </button>
          </form>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex space-x-6 overflow-x-auto pb-4">
        {columns.map(column => {
          const tasks = currentProject.tasks.filter((t: any) => t.status === column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-zinc-100 flex items-center space-x-2">
                  <span>{column.title}</span>
                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
                </h3>
                <button className="text-zinc-500 hover:text-zinc-300">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col space-y-3 overflow-y-auto">
                {tasks.map((task: any) => (
                  <div key={task.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 group hover:border-indigo-500/50 transition-colors cursor-grab active:cursor-grabbing">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-rose-500/10 text-rose-400' :
                        task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {task.priority}
                      </span>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        {columns.map(c => c.id !== column.id && (
                          <form key={c.id} action={async () => {
                            "use server";
                            await updateTaskStatus(task.id, c.id);
                          }}>
                            <button type="submit" title={`Move to ${c.title}`} className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded">
                              <MoreHorizontal size={12} />
                            </button>
                          </form>
                        ))}
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium text-zinc-200 mb-3">{task.title}</h4>
                    
                    <div className="flex items-center justify-between text-zinc-500">
                      <div className="flex items-center space-x-3">
                        {task.description && <AlignLeft size={14} />}
                        <div className="flex items-center space-x-1">
                          <MessageSquare size={14} />
                          <span className="text-xs">0</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Clock size={12} />
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {tasks.length === 0 && (
                  <div className="border-2 border-dashed border-zinc-800 rounded-lg p-4 text-center text-sm text-zinc-600 flex items-center justify-center min-h-[100px]">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
