
import React, { useState } from 'react';
import { Issue, Status, Priority, User, TestCase } from '../types';
import { USERS, MOCK_PRS } from '../constants';
import { generateIssueDescription } from '../services/geminiService';

interface IssueModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (issue: Issue) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
  testCases: TestCase[];
}

const IssueModal: React.FC<IssueModalProps> = ({ issue, isOpen, onClose, onSave, onDelete, isNew, testCases }) => {
  const [activeSubTab, setActiveSubTab] = useState<'desc' | 'dev' | 'qa'>('desc');
  const [editedIssue, setEditedIssue] = useState<Partial<Issue>>(
    issue || {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      assignee: null,
      storyPoints: 1,
    }
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleAiGenerate = async () => {
    if (!editedIssue.title) {
      alert("A title is required for AI contextualization.");
      return;
    }
    setIsGenerating(true);
    try {
      const data = await generateIssueDescription(editedIssue.title);
      setEditedIssue(prev => ({ 
        ...prev, 
        description: data.description, 
        storyPoints: data.points 
      }));
    } catch (e) {
      alert("AI Service currently unavailable.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!editedIssue.title) return;
    onSave(editedIssue as Issue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-6">
      <div className="bg-white rounded-[56px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] w-full max-w-6xl max-h-[94vh] overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-16 py-10 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-8">
            <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] text-white">
              <i className="fa-solid fa-bolt-lightning text-2xl"></i>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] block leading-none mb-3">
                {isNew ? 'New Engineering Ticket' : `Created ${new Date(issue?.createdAt || '').toLocaleDateString()}`}
              </span>
              <span className="text-3xl font-black text-slate-950 leading-none tracking-tighter">
                {isNew ? 'DRAFTING' : issue?.key}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!isNew && (
              <button 
                onClick={() => onDelete(issue?.id || '')}
                className="w-12 h-12 rounded-full hover:bg-rose-50 flex items-center justify-center transition-all group text-slate-300 hover:text-rose-600 border border-transparent hover:border-rose-100"
                title="Delete Permanent"
              >
                <i className="fa-solid fa-trash-can text-lg"></i>
              </button>
            )}
            <button onClick={onClose} className="w-14 h-14 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all group border border-slate-100 shadow-sm bg-white">
              <i className="fa-solid fa-xmark text-slate-400 group-hover:text-slate-950 group-hover:rotate-90 transition-all text-xl"></i>
            </button>
          </div>
        </div>

        {/* Modal Navigation */}
        <div className="px-16 flex space-x-14 border-b border-slate-100 bg-white">
          {[
            { id: 'desc', label: 'Detailed Specs', icon: 'fa-align-left' },
            { id: 'dev', label: 'Version Control', icon: 'fa-code-branch' },
            { id: 'qa', label: 'Test Traceability', icon: 'fa-shield-check' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-8 text-[11px] font-black uppercase tracking-[0.25em] flex items-center space-x-4 border-b-4 transition-all ${
                activeSubTab === tab.id ? 'border-indigo-600 text-indigo-600 translate-y-[2px]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-lg`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-20 flex space-x-24 custom-scrollbar bg-slate-50/20">
          <div className="flex-[3]">
            {activeSubTab === 'desc' && (
              <div className="space-y-16 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Contextual Summary</label>
                  <input
                    className="w-full text-5xl font-black border-none focus:ring-0 px-0 placeholder-slate-200 tracking-tighter text-slate-950 bg-transparent"
                    placeholder="Enter objective..."
                    value={editedIssue.title}
                    onChange={e => setEditedIssue({...editedIssue, title: e.target.value})}
                  />
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Acceptance Criteria & Notes</h3>
                    <button
                      onClick={handleAiGenerate}
                      disabled={isGenerating}
                      className="group flex items-center space-x-4 px-8 py-4 bg-slate-950 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-slate-950/20"
                    >
                      <i className={`fa-solid fa-sparkles text-indigo-400 group-hover:text-white ${isGenerating ? 'animate-spin' : 'animate-pulse'}`}></i>
                      <span>{isGenerating ? 'Gemini is thinking...' : 'AI Spec Generator'}</span>
                    </button>
                  </div>
                  <textarea
                    className="w-full h-[500px] p-12 bg-white border border-slate-100 rounded-[48px] text-lg font-medium focus:ring-8 focus:ring-indigo-50/50 transition-all resize-none text-slate-800 leading-relaxed shadow-xl shadow-slate-200/20 placeholder:italic"
                    placeholder="Describe technical implementation details..."
                    value={editedIssue.description}
                    onChange={e => setEditedIssue({...editedIssue, description: e.target.value})}
                  />
                </div>
              </div>
            )}

            {activeSubTab === 'dev' && (
              <div className="space-y-12 animate-in slide-in-from-left-4 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 uppercase tracking-[0.2em] flex items-center">
                    <i className="fa-brands fa-github text-2xl mr-4 text-slate-950"></i>
                    Linked Pull Requests
                  </h3>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest">LIVE SYNC</span>
                </div>
                <div className="space-y-6">
                  {MOCK_PRS.map(pr => (
                    <div key={pr.id} className="p-10 bg-white rounded-[40px] border border-slate-100 flex items-center justify-between group hover:shadow-2xl hover:shadow-slate-200/50 transition-all border-l-8 border-l-indigo-500">
                      <div className="flex items-center space-x-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-indigo-50 transition-colors">
                           <i className="fa-solid fa-code-pull-request text-indigo-600 text-2xl"></i>
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-950 group-hover:text-indigo-600 transition-colors cursor-pointer leading-tight">#{pr.number} {pr.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{pr.repo} — {pr.status}</p>
                        </div>
                      </div>
                      <button className="px-8 py-3 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">Review Diff</button>
                    </div>
                  ))}
                  <button className="w-full p-16 border-4 border-dashed border-slate-100 rounded-[48px] text-xs font-black text-slate-300 uppercase tracking-[0.5em] hover:border-indigo-300 hover:text-indigo-600 transition-all flex flex-col items-center space-y-6 group">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <i className="fa-solid fa-plus text-2xl"></i>
                    </div>
                    <span>Link Development Branch</span>
                  </button>
                </div>
              </div>
            )}

            {activeSubTab === 'qa' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-950 uppercase tracking-[0.2em] flex items-center">
                    <i className="fa-solid fa-vial-circle-check text-2xl mr-4 text-emerald-600"></i>
                    Quality Coverage
                  </h3>
                  <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Manage Suite</button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {testCases.map(test => (
                    <div key={test.id} className="p-10 bg-white rounded-[40px] border border-slate-100 flex justify-between items-center group hover:shadow-2xl transition-all">
                      <div className="flex items-center space-x-8">
                        <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center shadow-inner text-emerald-600">
                           <i className="fa-solid fa-vial text-2xl"></i>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{test.key}</span>
                          <p className="text-xl font-black text-slate-950 tracking-tight">{test.title}</p>
                        </div>
                      </div>
                      <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                        test.status === 'Pass' ? 'bg-emerald-100 text-emerald-700 shadow-emerald-500/20' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {test.status}
                      </div>
                    </div>
                  ))}
                  {testCases.length === 0 && (
                    <div className="p-24 text-center flex flex-col items-center space-y-8 bg-white rounded-[48px] border-4 border-dashed border-slate-100">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-microscope text-5xl text-slate-200"></i>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-950 font-black text-xl tracking-tight uppercase">Untested Record</p>
                        <p className="text-slate-400 font-bold text-sm">No test scenarios are currently mapped to this issue.</p>
                      </div>
                      <button className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Launch Quality Audit</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Config */}
          <div className="flex-1 space-y-16 min-w-[340px]">
            <div className="space-y-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1 block">Work Status</label>
                <div className="relative">
                  <select
                    className="w-full p-6 bg-slate-950 border-none rounded-[32px] text-xs font-black text-indigo-400 focus:ring-[12px] focus:ring-indigo-950/20 cursor-pointer shadow-2xl shadow-indigo-500/30 appearance-none"
                    value={editedIssue.status}
                    onChange={e => setEditedIssue({...editedIssue, status: e.target.value as Status})}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>QA</option>
                    <option>Done</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-8 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none text-[10px]"></i>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1 block">Engineer Assigned</label>
                <div className="relative group">
                  <select
                    className="w-full p-6 bg-white border border-slate-100 rounded-[32px] text-sm font-bold text-slate-900 focus:ring-8 focus:ring-indigo-50 cursor-pointer appearance-none transition-all shadow-xl shadow-slate-200/20"
                    value={editedIssue.assignee?.id || ''}
                    onChange={e => {
                      const user = USERS.find(u => u.id === e.target.value);
                      setEditedIssue({...editedIssue, assignee: user || null});
                    }}
                  >
                    <option value="">Unallocated</option>
                    {USERS.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-user-tag absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors"></i>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1 block">Priority</label>
                  <select
                    className="w-full p-6 bg-white border border-slate-100 rounded-[32px] text-[11px] font-black uppercase text-slate-700 focus:ring-8 focus:ring-indigo-50 cursor-pointer shadow-xl shadow-slate-200/20 appearance-none"
                    value={editedIssue.priority}
                    onChange={e => setEditedIssue({...editedIssue, priority: e.target.value as Priority})}
                  >
                    <option>Lowest</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Highest</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1 block">Weight</label>
                  <input
                    type="number"
                    className="w-full p-6 bg-white border border-slate-100 rounded-[32px] text-base font-black text-slate-900 focus:ring-8 focus:ring-indigo-50 shadow-xl shadow-slate-200/20 text-center"
                    value={editedIssue.storyPoints}
                    onChange={e => setEditedIssue({...editedIssue, storyPoints: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-16 border-t border-slate-100 flex flex-col space-y-6">
               <div className="flex items-center space-x-6 text-slate-400 bg-white p-6 rounded-[32px] shadow-sm border border-slate-50">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                   <i className="fa-solid fa-calendar-check text-xl"></i>
                 </div>
                 <div>
                   <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400 mb-1">Creation Cycle</span>
                   <span className="text-xs font-bold text-slate-950 uppercase">{editedIssue.createdAt ? new Date(editedIssue.createdAt).toDateString() : 'GENESIS'}</span>
                 </div>
               </div>
               <div className="flex items-center space-x-6 text-slate-400 bg-white p-6 rounded-[32px] shadow-sm border border-slate-50">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                   <i className="fa-solid fa-user-shield text-xl"></i>
                 </div>
                 <div>
                   <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400 mb-1">Audit Owner</span>
                   <span className="text-xs font-bold text-slate-950 uppercase">{editedIssue.reporter?.name || 'SYSTEM ADMIN'}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Action Tray */}
        <div className="px-20 py-12 bg-white border-t border-slate-100 flex justify-end items-center space-x-10">
          <button
            onClick={onClose}
            className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-950 transition-colors"
          >
            Cancel Draft
          </button>
          <button
            onClick={handleSave}
            className="px-16 py-6 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-[32px] hover:bg-indigo-700 shadow-[0_24px_48px_-12px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center space-x-4"
          >
            <span>{isNew ? 'Release Ticket' : 'Synchronize Record'}</span>
            <i className="fa-solid fa-arrow-right-long text-base"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
