import { getTenantHeaders } from "../../lib/auth";
import { Download, CheckCircle, Search, Star, Package, Loader2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function getPlugins() {
  try {
    const res = await fetch("http://localhost:3012/plugins", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch plugins");
    return res.json();
  } catch (error) {
    console.error("Error fetching plugins:", error);
    return [];
  }
}

export default async function MarketplacePage() {
  const plugins = await getPlugins();

  async function installPlugin(formData: FormData) {
    "use server";
    const pluginId = formData.get("pluginId") as string;
    
    await fetch(`http://localhost:3012/plugins/${pluginId}/install`, {
      method: 'POST',
      headers: await getTenantHeaders(),
    });
    
    revalidatePath("/marketplace");
  }

  async function uninstallPlugin(formData: FormData) {
    "use server";
    const pluginId = formData.get("pluginId") as string;
    
    await fetch(`http://localhost:3012/plugins/${pluginId}/uninstall`, {
      method: 'DELETE',
      headers: await getTenantHeaders(),
    });
    
    revalidatePath("/marketplace");
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">App Marketplace</h1>
          <p className="text-sm text-zinc-400 mt-1">Discover, install, and extend your Business OS with modules.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search plugins..." 
            className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 border-b border-zinc-800 pb-2">
        <button className="px-3 py-1.5 bg-zinc-800 text-white rounded-md text-sm font-medium">All Apps</button>
        <button className="px-3 py-1.5 text-zinc-400 hover:text-white rounded-md text-sm font-medium transition-colors">Core Modules</button>
        <button className="px-3 py-1.5 text-zinc-400 hover:text-white rounded-md text-sm font-medium transition-colors">Integrations</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {plugins.map((plugin: any) => (
          <div key={plugin.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col hover:border-zinc-700 hover:bg-zinc-900 transition-colors group shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-md`}>
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">{plugin.name}</h3>
                  <p className="text-xs text-zinc-500">v{plugin.version} • {plugin.price > 0 ? `$${plugin.price}/mo` : 'Free'}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-3">
              {plugin.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
              <div className="flex items-center space-x-3 text-xs text-zinc-500">
                <span className="flex items-center"><Star size={12} className="text-amber-400 mr-1" /> 4.9</span>
              </div>
              
              {plugin.isInstalled ? (
                <form action={uninstallPlugin}>
                  <input type="hidden" name="pluginId" value={plugin.id} />
                  <button type="submit" className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-red-500/10 text-emerald-400 hover:text-red-400 border border-emerald-500/20 hover:border-red-500/20 rounded-md text-xs font-medium transition-colors group/btn">
                    <CheckCircle size={14} className="group-hover/btn:hidden" />
                    <span className="group-hover/btn:hidden">Installed</span>
                    <span className="hidden group-hover/btn:inline">Uninstall</span>
                  </button>
                </form>
              ) : (
                <form action={installPlugin}>
                  <input type="hidden" name="pluginId" value={plugin.id} />
                  <button type="submit" className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium transition-colors">
                    <Download size={14} />
                    <span>Install</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {plugins.length === 0 && (
           <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-500">
             <Package size={48} className="mb-4 opacity-50" />
             <p>No apps available in the marketplace.</p>
           </div>
        )}
      </div>
    </div>
  );
}
