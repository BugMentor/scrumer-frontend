
import React, { useState } from 'react';
import { GitHubPR } from '../types';

interface GithubHubProps {
  prs: GitHubPR[];
  onSync: () => void;
}

const GithubHub: React.FC<GithubHubProps> = ({ prs, onSync }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onSync();
    }, 1500);
  };

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12 overflow-y-auto custom-scrollbar h-full">
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">GitHub Integration</h1>
          <p className="text-slate-400 text-base mt-2 font-medium italic">Synchronized Code & Issue Traceability</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className={`bg-slate-950 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isScanning ? <i className="fa-solid fa-rotate animate-spin mr-2"></i> : null}
            {isScanning ? 'Scanning...' : 'Scan Repository'}
          </button>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30">
            Create Branch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 transition-transform hover:-translate-y-1">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">Total Commits</p>
          <p className="text-4xl font-black text-slate-950">1,402</p>
          <div className="flex items-center space-x-2 mt-4 text-emerald-600 font-bold text-xs">
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span>+12 this week</span>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 transition-transform hover:-translate-y-1">
          <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-2">Active Pull Requests</p>
          <p className="text-4xl font-black text-slate-950">{prs.length}</p>
          <div className="flex items-center space-x-2 mt-4 text-amber-500 font-bold text-xs">
            <i className="fa-solid fa-clock"></i>
            <span>3 pending review</span>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 transition-transform hover:-translate-y-1 shadow-2xl shadow-slate-900/40">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Build Environment</p>
          <p className="text-4xl font-black text-white tracking-tight">PRODUCTION</p>
          <div className="flex items-center space-x-2 mt-4 text-emerald-400 font-black uppercase text-[10px] tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-4">Live Pull Request Stream</h3>
        <div className="space-y-4">
          {prs.map(pr => (
            <div key={pr.id} className="bg-white border border-slate-100 p-8 rounded-[32px] flex items-center hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-8 shadow-sm ${pr.status === 'Open' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                <i className={`fa-solid ${pr.status === 'Open' ? 'fa-code-pull-request' : 'fa-code-merge'} text-2xl`}></i>
              </div>
              <div className="flex-1">
                <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-tight">#{pr.number} {pr.title}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pr.repo}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synced {pr.updatedAt}</span>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex -space-x-3">
                  <img src={pr.author.avatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-md hover:scale-110 transition-transform cursor-help" title={pr.author.name} alt="" />
                </div>
                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${pr.status === 'Open' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                  {pr.status}
                </div>
                <button className="text-slate-300 hover:text-slate-900 transition-colors">
                  <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GithubHub;
