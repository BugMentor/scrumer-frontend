
import React from 'react';
import { Issue, Sprint, Priority } from '../types';

interface BacklogProps {
  issues: Issue[];
  sprints: Sprint[];
  onIssueClick: (issue: Issue) => void;
  onMoveToSprint: (issueId: string, sprintId: string | null) => void;
  onCompleteSprint: (sprintId: string) => void;
  onCreateSprint: () => void;
}

const PriorityTag: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    Highest: 'bg-rose-50 text-rose-600 border-rose-100',
    High: 'bg-orange-50 text-orange-600 border-orange-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    Low: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-lg border ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const Backlog: React.FC<BacklogProps> = ({ issues, sprints, onIssueClick, onMoveToSprint, onCompleteSprint, onCreateSprint }) => {
  const activeSprint = sprints.find(s => s.status === 'Active');
  const backlogIssues = issues.filter(i => !i.sprintId);

  const IssueItem: React.FC<{ issue: Issue; targetSprintId: string | null }> = ({ issue, targetSprintId }) => (
    <div 
      className="bg-white border-b border-slate-50 p-4 hover:bg-indigo-50/40 cursor-pointer flex items-center group transition-all"
    >
      <div 
        onClick={() => onMoveToSprint(issue.id, targetSprintId)}
        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"
        title={issue.sprintId ? "Move to Backlog" : "Add to Active Sprint"}
      >
        <i className={`fa-solid ${issue.sprintId ? 'fa-arrow-down' : 'fa-arrow-up'} text-[10px]`}></i>
      </div>
      <div className="flex-1 flex items-center space-x-6 min-w-0" onClick={() => onIssueClick(issue)}>
        <span className="text-[10px] font-black text-slate-400 w-24 tracking-widest uppercase shrink-0">{issue.key}</span>
        <span className="text-sm font-bold text-slate-800 flex-1 truncate">{issue.title}</span>
      </div>
      <div className="flex items-center space-x-8 shrink-0">
        <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
          issue.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {issue.status}
        </div>
        <PriorityTag priority={issue.priority} />
        {issue.storyPoints > 0 && (
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-[10px] font-black text-white flex items-center justify-center shadow-lg">
            {issue.storyPoints}
          </span>
        )}
        <div className="w-8 flex justify-center">
          {issue.assignee ? (
            <img src={issue.assignee.avatar} className="w-7 h-7 rounded-xl ring-2 ring-white shadow-md" alt="" />
          ) : (
            <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
              <i className="fa-solid fa-user text-[10px] text-slate-300"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-12 max-w-7xl mx-auto w-full custom-scrollbar">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Strategic Backlog</h1>
          <p className="text-slate-400 text-base mt-3 font-medium italic max-w-lg leading-relaxed">Prioritize tasks, estimate efforts, and organize work into rapid execution cycles.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={onCreateSprint}
            className="bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
          >
            Draft Cycle
          </button>
          <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30">
            Create Issue
          </button>
        </div>
      </div>

      {/* Sprints Section */}
      {sprints.filter(s => s.status !== 'Closed').map(sprint => {
        const sprintIssues = issues.filter(i => i.sprintId === sprint.id);
        const isActive = sprint.status === 'Active';

        return (
          <div key={sprint.id} className="mb-16 border border-slate-100 rounded-[40px] overflow-hidden bg-white shadow-2xl shadow-slate-200/40 group">
            <div className={`${isActive ? 'bg-slate-950' : 'bg-slate-50'} p-8 flex justify-between items-center transition-colors`}>
              <div className="flex items-center space-x-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isActive ? 'bg-indigo-600 shadow-indigo-600/30 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                  <i className={`fa-solid ${isActive ? 'fa-bolt-lightning' : 'fa-calendar-days'} text-xl`}></i>
                </div>
                <div>
                  <h3 className={`text-xl font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-950'}`}>{sprint.name}</h3>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {sprint.startDate} — {sprint.endDate} • {sprintIssues.length} Items
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                 {isActive ? (
                   <button 
                      onClick={() => onCompleteSprint(sprint.id)}
                      className="px-8 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
                   >
                     Complete Cycle
                   </button>
                 ) : (
                   <button className="px-8 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                     Start Sprint
                   </button>
                 )}
                 <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors group-hover:bg-slate-900 group-hover:border-slate-800">
                   <i className="fa-solid fa-ellipsis"></i>
                 </button>
              </div>
            </div>
            <div className="p-1 min-h-[100px] bg-white divide-y divide-slate-50">
              {sprintIssues.length > 0 ? (
                sprintIssues.map(issue => (
                  <IssueItem 
                    key={issue.id} 
                    issue={issue} 
                    targetSprintId={null} 
                  />
                ))
              ) : (
                <div className="p-16 text-center text-slate-400 font-medium text-sm italic flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                    <i className="fa-solid fa-layer-group text-slate-200"></i>
                  </div>
                  Empty Sprint. Add items from backlog below.
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Backlog Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Master Product Backlog ({backlogIssues.length})</h4>
          <div className="flex items-center space-x-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <span className="cursor-pointer hover:text-indigo-600">Priority Desc</span>
             <i className="fa-solid fa-arrow-down-wide-short"></i>
          </div>
        </div>
        <div className="border border-slate-100 rounded-[40px] overflow-hidden bg-white shadow-sm divide-y divide-slate-50">
          {backlogIssues.length > 0 ? (
            backlogIssues.map(issue => (
              <IssueItem 
                key={issue.id} 
                issue={issue} 
                targetSprintId={activeSprint?.id || 's1'} 
              />
            ))
          ) : (
            <div className="p-24 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
                <i className="fa-solid fa-check-double text-3xl"></i>
              </div>
              <p className="text-slate-950 font-black text-lg tracking-tight">Zero Backlog Achieved</p>
              <p className="text-slate-400 text-sm mt-1">Every single item is scheduled for production.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Backlog;
