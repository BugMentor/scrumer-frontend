
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const groups = [
    {
      title: 'CORE',
      items: [
        { id: 'board', label: 'Kanban Board', icon: 'fa-rocket' },
        { id: 'backlog', label: 'Backlog', icon: 'fa-list-check' },
        { id: 'reports', label: 'Analytics', icon: 'fa-chart-pie' },
      ]
    },
    {
      title: 'DEVELOPMENT',
      items: [
        { id: 'github', label: 'GitHub Hub', icon: 'fa-brands fa-github' },
      ]
    },
    {
      title: 'QUALITY ASSURANCE',
      items: [
        { id: 'scrumer-test', label: 'Scrumer Test', icon: 'fa-vial-circle-check' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Workspace', icon: 'fa-sliders' },
      ]
    }
  ];

  return (
    <div className="w-64 bg-slate-950 text-white flex flex-col h-full overflow-hidden border-r border-slate-800 shrink-0">
      <div className="p-8 flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('board')}>
                  <img src="/assets/img/scrumer-full-logo.png" alt="Scrumer Logo" className="h-10" />      </div>

      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar pb-8">
        {groups.map((group) => (
          <div key={group.title} className="mb-8">
            <h4 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{group.title}</h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-bold' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-5 mr-3 text-base ${activeTab === item.id ? 'text-white' : 'text-indigo-400/70'}`}></i>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 m-4 rounded-2xl bg-slate-900/50 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => setActiveTab('backlog')}>
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Active Sprint</p>
        <p className="text-xs font-semibold text-white truncate">Genesis Cycle v1.0</p>
        <div className="mt-3 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-2/3 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
