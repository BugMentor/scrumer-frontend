
import React, { useState } from 'react';
import { Issue, Status, Priority } from '../types';
import { COLUMNS } from '../constants';

interface BoardProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
  onUpdateStatus: (id: string, newStatus: Status) => void;
}

const PriorityIcon: React.FC<{ priority: Priority }> = ({ priority }) => {
  switch (priority) {
    case 'Highest': return <i className="fa-solid fa-circle-exclamation text-rose-500"></i>;
    case 'High': return <i className="fa-solid fa-chevron-up text-orange-500"></i>;
    case 'Medium': return <i className="fa-solid fa-minus text-amber-400"></i>;
    case 'Low': return <i className="fa-solid fa-chevron-down text-emerald-500"></i>;
    default: return <i className="fa-solid fa-angles-down text-slate-300"></i>;
  }
};

const Board: React.FC<BoardProps> = ({ issues, onIssueClick, onUpdateStatus }) => {
  const [draggedOverColumn, setDraggedOverColumn] = useState<Status | null>(null);

  const getNextStatus = (current: Status): Status | null => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    return idx < COLUMNS.length - 1 ? COLUMNS[idx + 1].id : null;
  };

  const getPrevStatus = (current: Status): Status | null => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    return idx > 0 ? COLUMNS[idx - 1].id : null;
  };

  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    e.dataTransfer.setData('issueId', issueId);
    e.dataTransfer.effectAllowed = 'move';
    // Add a slight delay to the styling change so the drag image looks like the card
    setTimeout(() => {
        (e.target as HTMLElement).classList.add('opacity-40');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-40');
  };

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setDraggedOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('issueId');
    if (issueId) {
      onUpdateStatus(issueId, status);
    }
    setDraggedOverColumn(null);
  };

  return (
    <div className="flex-1 overflow-auto flex p-6 space-x-6 custom-scrollbar bg-slate-50/50 items-start">
      {COLUMNS.map((column) => (
        <div 
          key={column.id} 
          className={`min-w-[320px] w-[320px] flex flex-col shrink-0 rounded-3xl transition-all duration-200 ${
            draggedOverColumn === column.id ? 'bg-indigo-50/80 scale-[1.01] ring-2 ring-indigo-200 shadow-inner' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="mb-4 px-2 flex justify-between items-center sticky top-0 bg-transparent backdrop-blur-sm z-10 py-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              {column.title}
              <span className="ml-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                {issues.filter(i => i.status === column.id).length}
              </span>
            </h3>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fa-solid fa-ellipsis text-sm"></i>
            </button>
          </div>
          
          <div className="space-y-4 pb-10 px-0.5 min-h-[200px]">
            {issues
              .filter(i => i.status === column.id)
              .map(issue => {
                const nextStatus = getNextStatus(issue.status);
                const prevStatus = getPrevStatus(issue.status);
                return (
                  <div
                    key={issue.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, issue.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 cursor-grab active:cursor-grabbing group transition-all duration-200 active:scale-[0.98] relative overflow-hidden"
                  >
                    <div onClick={() => onIssueClick(issue)}>
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                          {issue.title}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                        <div className="flex items-center space-x-2">
                          <PriorityIcon priority={issue.priority} />
                          <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">{issue.key}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {issue.storyPoints > 0 && (
                            <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-lg font-black">
                              {issue.storyPoints}
                            </span>
                          )}
                          {issue.assignee ? (
                            <img 
                              src={issue.assignee.avatar} 
                              className="w-7 h-7 rounded-xl ring-2 ring-white shadow-md" 
                              alt={issue.assignee.name}
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center ring-2 ring-white border border-slate-200 shadow-sm">
                              <i className="fa-solid fa-user text-slate-300 text-[10px]"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Move Utility (Still present for accessibility/fast clicks) */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                      {prevStatus && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onUpdateStatus(issue.id, prevStatus); }}
                          className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-200"
                        >
                          <i className="fa-solid fa-arrow-left text-[10px]"></i>
                        </button>
                      )}
                      {nextStatus && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onUpdateStatus(issue.id, nextStatus); }}
                          className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-indigo-700 shadow-lg"
                        >
                          <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            
            <button 
               onClick={() => onIssueClick({ title: '', status: column.id, priority: 'Medium', storyPoints: 1 } as any)}
               className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Create Task</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Board;
