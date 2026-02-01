
export type Priority = 'Low' | 'Medium' | 'High' | 'Highest';
export type Status = 'To Do' | 'In Progress' | 'Review' | 'QA' | 'Done';
export type TestStatus = 'Draft' | 'Pass' | 'Fail' | 'Blocked';
export type PRStatus = 'Open' | 'Merged' | 'Draft' | 'Closed';
export type TestCategory = 'UI' | 'API' | 'Performance' | 'Security' | 'Accessibility';
export type TestTool = 'Playwright' | 'Cypress' | 'Selenium' | 'SuperTest' | 'K6' | 'JMeter';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface GitHubPR {
  id: string;
  number: number;
  title: string;
  status: PRStatus;
  repo: string;
  author: User;
  updatedAt: string;
}

export interface TestCase {
  id: string;
  key: string;
  title: string;
  status: TestStatus;
  category: TestCategory;
  tool: TestTool;
  linkedIssueKey: string;
  steps: { step: string; expected: string }[];
}

export interface Sprint {
  id: string;
  name: string;
  status: 'Active' | 'Planned' | 'Closed';
  startDate: string;
  endDate: string;
  goal: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: User | null;
  reporter: User;
  storyPoints: number;
  createdAt: string;
  sprintId: string | null;
  githubPrs?: GitHubPR[];
}

export interface Column {
  id: Status;
  title: string;
}
