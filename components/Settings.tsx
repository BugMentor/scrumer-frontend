
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "Scrumer Cloud",
    key: "SCRUM"
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings successfully updated in workspace.");
    }, 800);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12 overflow-y-auto custom-scrollbar">
      <div className="border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workspace Settings</h1>
        <p className="text-slate-400 text-sm mt-2 font-medium italic text-purple-600">Scrumer Cloud Instance Management</p>
      </div>

      <div className="space-y-10">
        <section className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Project Details</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Name</label>
              <input 
                type="text" 
                value={projectData.name} 
                onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Key Prefix</label>
              <input 
                type="text" 
                value={projectData.key} 
                onChange={(e) => setProjectData({...projectData, key: e.target.value})}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all uppercase outline-none"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Integration Hub</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900">
                  <i className="fa-brands fa-github text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">GitHub Connector</h4>
                  <p className="text-xs text-slate-500 font-medium">Synced with scrumer-org/scrumer-core</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">Connected</span>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 grayscale opacity-60">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900">
                  <i className="fa-brands fa-slack text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Slack Notifications</h4>
                  <p className="text-xs text-slate-500 font-medium">Marketplace integration pending</p>
                </div>
              </div>
              <button className="text-xs font-black text-indigo-600 hover:underline">Enable</button>
            </div>
          </div>
        </section>

        <section className="pt-8 border-t border-slate-100">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 ${isSaving ? 'animate-pulse' : ''}`}
          >
            {isSaving ? 'Saving Changes...' : 'Save Workspace Changes'}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
