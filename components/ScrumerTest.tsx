
import React, { useState } from 'react';
import { TestCase, TestCategory, TestTool, TestStatus } from '../types';

interface ScrumerTestProps {
  testCases: TestCase[];
  onCreateTest: (title: string, issueKey: string) => void;
  onUpdateStatus: (id: string, status: any) => void;
}

const CATEGORY_COLORS: Record<TestCategory, string> = {
  UI: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  API: 'bg-purple-50 text-purple-700 border-purple-100',
  Performance: 'bg-amber-50 text-amber-700 border-amber-100',
  Security: 'bg-rose-50 text-rose-700 border-rose-100',
  Accessibility: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const TOOL_ICONS: Record<TestTool, string> = {
  Playwright: 'fa-masks-theater',
  Cypress: 'fa-tree',
  Selenium: 'fa-flask',
  SuperTest: 'fa-paper-plane',
  K6: 'fa-bolt-lightning',
  JMeter: 'fa-gauge-high',
};

const ScrumerTest: React.FC<ScrumerTestProps> = ({ testCases, onCreateTest, onUpdateStatus }) => {
  const [newTestTitle, setNewTestTitle] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<TestCategory | 'All'>('All');

  const handleAdd = () => {
    if (newTestTitle) {
      onCreateTest(newTestTitle, "SCRUM-1"); 
      setNewTestTitle('');
      setShowAdd(false);
    }
  };

  const filteredTests = activeCategoryFilter === 'All' 
    ? testCases 
    : testCases.filter(t => t.category === activeCategoryFilter);

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12 overflow-y-auto custom-scrollbar h-full bg-slate-50/20">
       <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Scrumer Test</h1>
          <p className="text-slate-400 text-base mt-2 font-medium italic uppercase tracking-widest text-[10px]">Unified QE Orchestration & Test Traceability</p>
        </div>
        <div className="flex space-x-4">
           <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {['All', 'UI', 'API', 'Performance', 'Security', 'Accessibility'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategoryFilter === cat ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-2xl active:scale-95"
          >
            {showAdd ? 'Close Suite' : 'Draft New Scenario'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-slate-950 p-10 rounded-[40px] text-white space-y-8 animate-in slide-in-from-top-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">Define Regression Suite</h3>
            <p className="text-slate-400 text-xs font-medium">Map automated triggers to Jira-linked stories.</p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <input 
              className="col-span-2 bg-slate-900 border-none rounded-2xl p-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              placeholder="Test Scenario Objective..."
              value={newTestTitle}
              onChange={(e) => setNewTestTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <select className="bg-slate-900 border-none rounded-2xl p-6 text-sm font-bold text-slate-300 outline-none">
              <option>Category: UI</option>
              <option>Category: API</option>
              <option>Category: Performance</option>
              <option>Category: Security</option>
              <option>Category: Accessibility</option>
            </select>
             <select className="bg-slate-900 border-none rounded-2xl p-6 text-sm font-bold text-slate-300 outline-none">
              <option>Tool: Playwright</option>
              <option>Tool: SuperTest</option>
              <option>Tool: K6</option>
              <option>Tool: JMeter</option>
            </select>
          </div>
          <button 
            onClick={handleAdd}
            className="w-full bg-emerald-500 text-white px-8 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
          >
            Append to Regression Matrix
          </button>
        </div>
      )}

      {/* Categories Banner */}
      <div className="grid grid-cols-5 gap-6">
        {[
          { label: 'UI Scripts', count: testCases.filter(t => t.category === 'UI').length, icon: 'fa-desktop', color: 'text-indigo-600' },
          { label: 'API Endpoints', count: testCases.filter(t => t.category === 'API').length, icon: 'fa-link', color: 'text-purple-600' },
          { label: 'Performance', count: testCases.filter(t => t.category === 'Performance').length, icon: 'fa-gauge-high', color: 'text-amber-600' },
          { label: 'Sec Audit', count: testCases.filter(t => t.category === 'Security').length, icon: 'fa-shield-halved', color: 'text-rose-600' },
          { label: 'A11y Scans', count: testCases.filter(t => t.category === 'Accessibility').length, icon: 'fa-universal-access', color: 'text-emerald-600' },
        ].map(cat => (
          <div key={cat.label} className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all cursor-pointer group">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${cat.icon} text-xl`}></i>
            </div>
            <p className="text-3xl font-black text-slate-900 leading-none">{cat.count}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Integration Logos Bar */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-10">Integrated Connectors:</span>
        <div className="flex-1 flex justify-around items-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
          <div className="flex items-center space-x-3 text-sm font-black text-slate-900"><i className="fa-solid fa-masks-theater text-indigo-600"></i><span>PLAYWRIGHT</span></div>
          <div className="flex items-center space-x-3 text-sm font-black text-slate-900"><i className="fa-solid fa-tree text-emerald-600"></i><span>CYPRESS</span></div>
          <div className="flex items-center space-x-3 text-sm font-black text-slate-900"><i className="fa-solid fa-flask text-indigo-400"></i><span>SELENIUM</span></div>
          <div className="flex items-center space-x-3 text-sm font-black text-slate-900"><i className="fa-solid fa-bolt-lightning text-amber-500"></i><span>K6</span></div>
          <div className="flex items-center space-x-3 text-sm font-black text-slate-900"><i className="fa-solid fa-gauge-high text-indigo-900"></i><span>JMETER</span></div>
          <div className="flex items-center space-x-3 text-sm font-black text-slate-900"><i className="fa-solid fa-paper-plane text-purple-600"></i><span>SUPERTEST</span></div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trace ID</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scenario Objective</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Tool</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Outcome</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTests.map(test => (
              <tr key={test.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-10 py-8">
                   <span className="text-xs font-black text-slate-950 block">{test.key}</span>
                   <span className="text-[10px] font-bold text-indigo-600 mt-1 block">@{test.linkedIssueKey}</span>
                </td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[test.category]}`}>
                    {test.category}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <p className="text-sm font-bold text-slate-800 tracking-tight leading-snug">{test.title}</p>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-col items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <i className={`fa-solid ${TOOL_ICONS[test.tool]} text-lg text-slate-600 mb-2`}></i>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">{test.tool}</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => {
                        const states: TestStatus[] = ['Pass', 'Fail', 'Blocked', 'Draft'];
                        const next = states[(states.indexOf(test.status) + 1) % states.length];
                        onUpdateStatus(test.id, next);
                      }}
                      className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-sm ${
                        test.status === 'Pass' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                        test.status === 'Fail' ? 'bg-rose-500 text-white shadow-rose-500/20' : 
                        test.status === 'Blocked' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                        'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {test.status}
                    </button>
                  </div>
                </td>
                <td className="px-10 py-8 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => onUpdateStatus(test.id, 'Pass')} className="w-10 h-10 rounded-xl bg-slate-950 text-white hover:bg-indigo-600 transition-all shadow-xl">
                    <i className="fa-solid fa-play text-xs"></i>
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                    <i className="fa-solid fa-chart-line text-xs"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScrumerTest;
