import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as geminiService from './services/geminiService';
import { INITIAL_ISSUES, USERS, SPRINTS } from '../constants';

// Mock the entire geminiService module
vi.mock('../services/geminiService', () => ({
  summarizeProject: vi.fn(() => Promise.resolve('Mocked project summary from AI.')),
  generateIssueDescription: vi.fn(() => Promise.resolve({ description: 'Mocked description', points: 5 })),
}));

// Mock the ApolloProvider and its client so it doesn't try to make real GraphQL calls
vi.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ApolloClient: vi.fn(() => ({})),
  InMemoryCache: vi.fn(),
  HttpLink: vi.fn(),
  gql: vi.fn(),
  useQuery: vi.fn(() => ({ loading: false, error: undefined, data: { hello: 'mocked hello' } })), // Mock useQuery for TestApollo
}));

// Mock any external dependencies that are not relevant to this integration test
vi.mock('../components/Board', () => ({
  default: ({ issues, onIssueClick, onUpdateStatus }: any) => (
    <div data-testid="mock-board">
      Mock Board
      {issues.map((issue: any) => (
        <div key={issue.id} onClick={() => onIssueClick(issue)}>
          {issue.title} - {issue.status}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../components/Backlog', () => ({ default: () => <div data-testid="mock-backlog">Mock Backlog</div> }));
vi.mock('../components/GithubHub', () => ({ default: () => <div data-testid="mock-github-hub">Mock Github Hub</div> }));
vi.mock('../components/ScrumerTest', () => ({ default: () => <div data-testid="mock-scrumer-test">Mock Scrumer Test</div> }));
vi.mock('../components/Analytics', () => ({ default: () => <div data-testid="mock-analytics">Mock Analytics</div> }));
vi.mock('../components/Settings', () => ({ default: () => <div data-testid="mock-settings">Mock Settings</div> }));
vi.mock('../components/IssueModal', () => ({ default: () => <div data-testid="mock-issue-modal">Mock Issue Modal</div> }));
vi.mock('../components/TestApollo', () => ({ default: () => <div data-testid="mock-test-apollo">Mock Apollo Test</div> }));


describe('App Integration - AI Insights', () => {
  it('calls summarizeProject and displays summary when AI Insights button is clicked', async () => {
    // Render the App component
    render(<App />);

    // Mock summarizeProject to return a resolved promise
    const mockSummary = 'This is a test summary from the AI.';
    vi.spyOn(geminiService, 'summarizeProject').mockResolvedValue(mockSummary);

    // Click the "AI Insights" button
    const aiInsightsButton = screen.getByRole('button', { name: /AI Insights/i });
    fireEvent.click(aiInsightsButton);

    // Expect the loading text to appear
    expect(screen.getByText('Consulting...')).toBeInTheDocument();

    // Wait for the summary to be displayed
    await waitFor(() => {
      expect(screen.getByText(mockSummary)).toBeInTheDocument();
    });

    // Expect the loading text to disappear and original button text to return
    expect(screen.queryByText('Consulting...')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AI Insights/i })).toBeInTheDocument();
  });
});
