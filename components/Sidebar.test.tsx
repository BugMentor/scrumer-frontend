import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('renders correctly with default activeTab', () => {
    const setActiveTab = vi.fn();
    render(<Sidebar activeTab="board" setActiveTab={setActiveTab} />);

    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('Apollo Test')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    const setActiveTab = vi.fn();
    render(<Sidebar activeTab="backlog" setActiveTab={setActiveTab} />);

    const backlogButton = screen.getByRole('button', { name: /Backlog/i });
    expect(backlogButton).toHaveClass('bg-indigo-600');
  });

  it('calls setActiveTab when a tab is clicked', () => {
    const setActiveTab = vi.fn();
    render(<Sidebar activeTab="board" setActiveTab={setActiveTab} />);

    const githubButton = screen.getByRole('button', { name: /GitHub Hub/i });
    fireEvent.click(githubButton);

    expect(setActiveTab).toHaveBeenCalledTimes(1);
    expect(setActiveTab).toHaveBeenCalledWith('github');
  });

  it('calls setActiveTab when logo is clicked', () => {
    const setActiveTab = vi.fn();
    render(<Sidebar activeTab="board" setActiveTab={setActiveTab} />);

    const logoArea = screen.getByAltText('Scrumer Logo').closest('div');
    if (logoArea) {
      fireEvent.click(logoArea);
    }
    
    expect(setActiveTab).toHaveBeenCalledTimes(1);
    expect(setActiveTab).toHaveBeenCalledWith('board');
  });
});
