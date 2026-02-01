
import React from 'react';
import { Issue } from '../types';

interface AnalyticsProps {
  issues: Issue[];
}

const Analytics: React.FC<AnalyticsProps> = ({ issues }) => {
  const total = issues.length;
  const getCount = (status: string) => issues.filter(i => i.status === status).length;
  const getPercent = (status: string) => total ? Math.round((getCount(status) / total) * 100) : 0;

  // Mock data for Burn-down (14 days)
  const burndownData = [
    { day: 1, ideal: 40, actual: 40 },
    { day: 2, ideal: 37, actual: 39 },
    { day: 3, ideal: 34, actual: 38 },
    { day: 4, ideal: 31, actual: 35 },
    { day: 5, ideal: 28, actual: 28 },
    { day: 6, ideal: 25, actual: 27 },
    { day: 7, ideal: 22, actual: 26 },
    { day: 8, ideal: 19, actual: 20 },
    { day: 9, ideal: 16, actual: 15 },
    { day: 10, ideal: 13, actual: 12 },
    { day: 11, ideal: 10, actual: 10 },
    { day: 12, ideal: 7, actual: 5 },
    { day: 13, ideal: 4, actual: 3 },
    { day: 14, ideal: 0, actual: 0 },
  ];

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12 overflow-y-auto custom-scrollbar h-full bg-slate-50/30">
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Velocity Insights</h1>
          <p className="text-slate-400 text-base mt-2 font-medium italic">High-fidelity Scrum metrics & Burn-down forecasting.</p>
        </div>
        <div className="flex space-x-4">
           <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold text-xs uppercase hover:bg-slate-50 transition-all shadow-sm">
            Export JSON
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-slate-950 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Avg Velocity', val: '42.5 pts', trend: '+12%', icon: 'fa-gauge-high', color: 'text-indigo-600' },
          { label: 'Cycle Time', val: '3.2 days', trend: '-0.4d', icon: 'fa-clock-rotate-left', color: 'text-emerald-600' },
          { label: 'Deployment', val: '14 / week', trend: 'Stable', icon: 'fa-cloud-arrow-up', color: 'text-purple-600' },
          { label: 'Bug Density', val: '0.8%', trend: '-2%', icon: 'fa-bug-slash', color: 'text-rose-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 ${stat.color}`}>
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline space-x-3 mt-1">
              <span className="text-2xl font-black text-slate-950">{stat.val}</span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* Burn-down Chart */}
        <div className="col-span-2 bg-white border border-slate-100 p-10 rounded-[40px] shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Sprint Burn-down</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Genesis Cycle v1.0 • Remaining Points vs Time</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-0.5 bg-slate-200 border-t-2 border-dashed border-slate-400"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ideal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-indigo-600 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Actual</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 relative flex items-end justify-between px-4">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 pr-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full border-t-2 border-slate-900"></div>)}
            </div>

            {burndownData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative h-full">
                {/* Ideal Line Simulation */}
                <div 
                  className="absolute w-[2px] bg-slate-200 border-l border-dashed border-slate-300 z-0 h-full" 
                  style={{ bottom: 0, height: `${d.ideal * 2}%` }}
                ></div>
                {/* Actual Bar */}
                <div 
                  className="w-4 bg-indigo-600 rounded-t-lg mt-auto z-10 hover:bg-indigo-500 transition-colors cursor-help relative group" 
                  style={{ height: `${d.actual * 2}%` }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[8px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.actual}pts
                  </div>
                </div>
                <span className="text-[8px] font-black text-slate-400 mt-4">D{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Distribution */}
        <div className="bg-white border border-slate-100 p-10 rounded-[40px] shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-10">Resource Flow</h3>
          <div className="space-y-6">
            {[
              { label: 'Done', val: getPercent('Done'), color: 'bg-emerald-500', count: getCount('Done') },
              { label: 'QA', val: getPercent('QA'), color: 'bg-teal-500', count: getCount('QA') },
              { label: 'Review', val: getPercent('Review'), color: 'bg-purple-500', count: getCount('Review') },
              { label: 'Progress', val: getPercent('In Progress'), color: 'bg-indigo-500', count: getCount('In Progress') },
              { label: 'Backlog', val: getPercent('To Do'), color: 'bg-slate-300', count: getCount('To Do') },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                    <span>{s.label}</span>
                  </span>
                  <span>{s.count} ITEMS ({s.val}%)</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden shadow-inner border border-slate-100">
                  <div className={`${s.color} h-full transition-all duration-1000 ease-out shadow-lg`} style={{ width: `${s.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cumulative Flow Diagram (CFD) */}
      <div className="bg-slate-950 rounded-[40px] p-12 text-white shadow-2xl shadow-slate-900/40">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Cumulative Flow</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Cross-Functional Pipeline Throughput</p>
          </div>
          <div className="flex space-x-6">
            {['To Do', 'Doing', 'Done'].map(l => (
              <div key={l} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${l === 'Done' ? 'bg-emerald-500' : l === 'Doing' ? 'bg-indigo-500' : 'bg-slate-600'}`}></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{l}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-end space-x-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const h1 = 20 + Math.sin(i * 0.2) * 10;
            const h2 = 40 + Math.sin(i * 0.1) * 20;
            const h3 = 10 + Math.cos(i * 0.3) * 5;
            return (
              <div key={i} className="flex-1 flex flex-col group cursor-help h-full justify-end">
                <div className="bg-emerald-500/80 w-full rounded-t-sm" style={{ height: `${h1}%` }}></div>
                <div className="bg-indigo-500/80 w-full" style={{ height: `${h2}%` }}></div>
                <div className="bg-slate-700/80 w-full rounded-b-sm" style={{ height: `${h3}%` }}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
