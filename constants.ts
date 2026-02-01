
import { Status, User, Issue, Column, Sprint, GitHubPR, TestCase } from './types';

export const COLUMNS: Column[] = [
  { id: 'To Do', title: 'TO DO' },
  { id: 'In Progress', title: 'IN PROGRESS' },
  { id: 'Review', title: 'IN REVIEW' },
  { id: 'QA', title: 'QA' },
  { id: 'Done', title: 'DONE' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Rivers', avatar: 'https://picsum.photos/seed/alex/100' },
  { id: 'u2', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/100' },
  { id: 'u3', name: 'James Miller', avatar: 'https://picsum.photos/seed/james/100' },
  { id: 'u4', name: 'Emma Wilson', avatar: 'https://picsum.photos/seed/emma/100' },
];

export const SPRINTS: Sprint[] = [
  { id: 's1', name: 'Genesis Cycle v1.0', status: 'Active', startDate: '2025-02-15', endDate: '2025-03-01', goal: 'Launch MVP architecture' },
  { id: 's2', name: 'Optimization Wave', status: 'Planned', startDate: '2025-03-02', endDate: '2025-03-16', goal: 'Performance & Scale' },
];

export const MOCK_PRS: GitHubPR[] = [
  { id: 'pr1', number: 124, title: 'feat: add gemini streaming', status: 'Open', repo: 'scrumer-core', author: USERS[1], updatedAt: '2h ago' },
  { id: 'pr2', number: 121, title: 'fix: sidebar layout issues', status: 'Merged', repo: 'scrumer-ui', author: USERS[0], updatedAt: '1d ago' },
];

export const MOCK_TESTS: TestCase[] = [
  { 
    id: 'tc1', key: 'TEST-1', title: 'Verify AI summary accuracy', status: 'Pass', category: 'UI', tool: 'Playwright', linkedIssueKey: 'SCRUM-3',
    steps: [{ step: 'Input 5 tasks', expected: 'Summary covers all 5' }] 
  },
  { 
    id: 'tc2', key: 'TEST-2', title: 'API Response Payload Validation', status: 'Pass', category: 'API', tool: 'SuperTest', linkedIssueKey: 'SCRUM-1',
    steps: [{ step: 'GET /issues', expected: 'Returns 200 OK' }] 
  },
  { 
    id: 'tc3', key: 'TEST-3', title: 'Load test board concurrency', status: 'Blocked', category: 'Performance', tool: 'K6', linkedIssueKey: 'SCRUM-2',
    steps: [{ step: '100 VUs', expected: 'Latency < 200ms' }] 
  },
  { 
    id: 'tc4', key: 'TEST-4', title: 'SQL Injection on Search', status: 'Fail', category: 'Security', tool: 'JMeter', linkedIssueKey: 'SCRUM-4',
    steps: [{ step: 'Submit payload', expected: 'WAF blocks request' }] 
  },
  { 
    id: 'tc5', key: 'TEST-5', title: 'Screen reader accessibility', status: 'Draft', category: 'Accessibility', tool: 'Cypress', linkedIssueKey: 'SCRUM-2',
    steps: [{ step: 'Scan page', expected: 'No critical violations' }] 
  },
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: '1', key: 'SCRUM-1', title: 'Initialize project structure', description: 'Core React setup.',
    status: 'Done', priority: 'Highest', assignee: USERS[0], reporter: USERS[1], storyPoints: 3, createdAt: new Date().toISOString(), sprintId: 's1',
    githubPrs: [MOCK_PRS[1]]
  },
  {
    id: '2', key: 'SCRUM-2', title: 'Implement Kanban Board', description: 'Drag and drop UI.',
    status: 'In Progress', priority: 'High', assignee: USERS[1], reporter: USERS[0], storyPoints: 5, createdAt: new Date().toISOString(), sprintId: 's1'
  },
  {
    id: '3', key: 'SCRUM-3', title: 'Integrate Gemini AI', description: 'AI capabilities.',
    status: 'To Do', priority: 'Medium', assignee: null, reporter: USERS[2], storyPoints: 8, createdAt: new Date().toISOString(), sprintId: 's1'
  },
  {
    id: '4', key: 'SCRUM-4', title: 'Refactor Auth middleware', description: 'Clean up logic.',
    status: 'To Do', priority: 'Low', assignee: null, reporter: USERS[0], storyPoints: 2, createdAt: new Date().toISOString(), sprintId: null
  },
];
