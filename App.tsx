
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Board from './components/Board';
import Backlog from './components/Backlog';
import GithubHub from './components/GithubHub';
import ScrumerTest from './components/ScrumerTest';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import IssueModal from './components/IssueModal';
import { Issue, Status, Sprint, TestCase, GitHubPR } from './types';
import { INITIAL_ISSUES, USERS, SPRINTS, MOCK_TESTS, MOCK_PRS } from './constants';
import { summarizeProject } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('board');
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [sprints, setSprints] = useState<Sprint[]>(SPRINTS);
  const [testCases, setTestCases] = useState<TestCase[]>(MOCK_TESTS);
  const [prs, setPrs] = useState<GitHubPR[]>(MOCK_PRS);
  
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewIssue, setIsNewIssue] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'priority'>('all');
  
  const [projectSummary, setProjectSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Persistence Logic for Issues
  const handleUpdateIssue = (updatedIssue: Issue) => {
    if (isNewIssue) {
      const newKey = `SCRUM-${issues.length + 1}`;
      const newIssue: Issue = {
        ...updatedIssue,
        id: Math.random().toString(36).substr(2, 9),
        key: newKey,
        createdAt: new Date().toISOString(),
        reporter: USERS[0],
        sprintId: activeTab === 'board' ? (sprints.find(s => s.status === 'Active')?.id || null) : null,
      };
      setIssues([...issues, newIssue]);
    } else {
      setIssues(issues.map(i => i.id === updatedIssue.id ? updatedIssue : i));
    }
    setIsModalOpen(false);
  };

  const handleDeleteIssue = (id: string) => {
    if (window.confirm("Permanently delete this issue?")) {
      setIssues(issues.filter(i => i.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const handleMoveToSprint = (issueId: string, sprintId: string | null) => {
    setIssues(issues.map(i => i.id === issueId ? { ...i, sprintId } : i));
  };

  // UI Navigation Handlers
  const handleOpenNewIssue = () => {
    setIsNewIssue(true);
    setSelectedIssue(null);
    setIsModalOpen(true);
  };

  const handleOpenExistingIssue = (issue: Issue) => {
    setIsNewIssue(false);
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  // Sprint Management
  const handleCreateSprint = () => {
    const name = window.prompt("Enter Sprint Name:");
    if (!name) return;
    const newSprint: Sprint = {
      id: `s-${Date.now()}`,
      name,
      status: 'Planned',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
      goal: "New sprint objectives"
    };
    setSprints([...sprints, newSprint]);
  };

  const handleCompleteSprint = (sprintId: string) => {
    if (!window.confirm("Complete this sprint and move incomplete items to backlog?")) return;
    setSprints(sprints.map(s => s.id === sprintId ? { ...s, status: 'Closed' } : s));
    setIssues(issues.map(i => i.sprintId === sprintId && i.status !== 'Done' ? { ...i, sprintId: null } : i));
  };

  // Test Case Management
  const handleCreateTestCase = (title: string, issueKey: string) => {
    const newTest: TestCase = {
      id: Math.random().toString(36).substr(2, 9),
      key: `TEST-${testCases.length + 1}`,
      title,
      status: 'Draft',
      category: 'UI',
      tool: 'Playwright',
      linkedIssueKey: issueKey,
      steps: [{ step: "Initialization", expected: "System ready" }]
    };
    setTestCases([newTest, ...testCases]);
  };

  const handleUpdateTestStatus = (id: string, status: any) => {
    setTestCases(testCases.map(t => t.id === id ? { ...t, status } : t));
  };

  // AI Insights
  const handleSummarizeProject = async () => {
    setIsLoadingSummary(true);
    try {
      const summary = await summarizeProject(issues);
      setProjectSummary(summary);
    } catch (e) {
      setProjectSummary("AI engine temporarily offline. Try again shortly.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Filtering Logic
  const processedIssues = useMemo(() => {
    let result = issues.filter(issue => 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filterMode === 'mine') result = result.filter(i => i.assignee?.id === 'u1');
    if (filterMode === 'priority') result = result.filter(i => i.priority === 'Highest' || i.priority === 'High');
    return result;
  }, [issues, searchQuery, filterMode]);

  const activeSprint = sprints.find(s => s.status === 'Active');

  const renderContent = () => {
    switch (activeTab) {
      case 'board':
        return (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-8 pt-8 pb-2">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Sprint</h1>
                  <p className="text-slate-400 text-sm mt-1 font-medium italic">
                    {activeSprint ? `${activeSprint.name} • ${activeSprint.startDate} - ${activeSprint.endDate}` : "Planning Phase"}
                  </p>
                </div>
                <button onClick={handleOpenNewIssue} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                  New Issue
                </button>
              </div>
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-80">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="text"
                    placeholder="Search issues..."
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                <button 
                   onClick={() => setFilterMode(filterMode === 'mine' ? 'all' : 'mine')}
                   className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${filterMode === 'mine' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >My Tasks</button>
                <button 
                  onClick={() => setFilterMode(filterMode === 'priority' ? 'all' : 'priority')}
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${filterMode === 'priority' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >High Priority</button>
              </div>

              {projectSummary && (
                <div className="mb-6 bg-slate-950 p-6 rounded-[28px] flex items-start space-x-6 shadow-2xl border border-slate-800 animate-in fade-in">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-sparkles text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">AI Executive Summary</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{projectSummary}</p>
                  </div>
                  <button onClick={() => setProjectSummary(null)} className="text-slate-600 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                </div>
              )}
            </div>
            <Board 
              issues={processedIssues.filter(i => i.sprintId === (activeSprint?.id || 's1'))} 
              onIssueClick={handleOpenExistingIssue}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        );
      case 'backlog':
        return <Backlog issues={issues} sprints={sprints} onIssueClick={handleOpenExistingIssue} onMoveToSprint={handleMoveToSprint} onCompleteSprint={handleCompleteSprint} onCreateSprint={handleCreateSprint} />;
      case 'github':
        return <GithubHub prs={prs} onSync={() => setPrs([...prs])} />;
      case 'scrumer-test':
        return <ScrumerTest testCases={testCases} onCreateTest={handleCreateTestCase} onUpdateStatus={handleUpdateTestStatus} />;
      case 'reports':
        return <Analytics issues={issues} />;
      case 'settings':
        return <Settings />;
      default:
        return <div className="p-20 text-center font-black text-slate-200 text-6xl italic uppercase">Under Construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/90 backdrop-blur-xl shrink-0 z-20 sticky top-0">
          <div className="flex items-center text-xs font-black text-slate-400 space-x-3 uppercase tracking-widest">
            <span className="hover:text-indigo-600 cursor-pointer">Workspace</span>
            <i className="fa-solid fa-chevron-right text-[8px] opacity-40"></i>
            <span className="text-slate-950">Scrumer Cloud</span>
            <i className="fa-solid fa-chevron-right text-[8px] opacity-40"></i>
            <span className="text-indigo-600 font-black">{activeTab.toUpperCase()}</span>
          </div>
          <div className="flex items-center space-x-8">
            <button onClick={handleSummarizeProject} disabled={isLoadingSummary} className={`text-slate-600 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-widest flex items-center space-x-3 py-2 px-4 hover:bg-indigo-50 rounded-xl ${isLoadingSummary ? 'animate-pulse' : ''}`}>
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
              <span>{isLoadingSummary ? 'Consulting...' : 'AI Insights'}</span>
            </button>
            <div className="flex -space-x-3">
              {USERS.map(user => (
                <img key={user.id} src={user.avatar} className="w-10 h-10 rounded-2xl border-2 border-white shadow-md hover:z-10 transition-transform hover:scale-110 cursor-help" title={user.name} />
              ))}
              <button onClick={handleOpenNewIssue} className="w-10 h-10 rounded-2xl border-2 border-white bg-slate-950 text-white flex items-center justify-center text-xs hover:bg-indigo-600 transition-all shadow-xl">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
      <IssueModal
        isOpen={isModalOpen}
        isNew={isNewIssue}
        issue={selectedIssue}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateIssue}
        onDelete={handleDeleteIssue}
        testCases={testCases.filter(tc => tc.linkedIssueKey === selectedIssue?.key)}
      />
    </div>
  );
};

export default App;
