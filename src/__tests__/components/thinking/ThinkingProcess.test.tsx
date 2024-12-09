import { render, screen, fireEvent, waitFor } from '../../../setup/test-utils';
import { ThinkingProcess } from '../../../components/thinking/ThinkingProcess';
import { vi } from 'vitest';
import { ThinkingStep } from '../../../types/thinking';

// Mock the thinking service
vi.mock('../../../services/supabase', () => ({
  thinkingService: {
    startProcess: vi.fn(),
    completeStep: vi.fn(),
    saveProgress: vi.fn(),
    getProcessDetails: vi.fn(),
  },
}));

describe('ThinkingProcess Component', () => {
  const mockProcess = {
    id: '1',
    title: 'Critical Analysis Process',
    description: 'A structured approach to critical analysis',
    current_step: 0,
    steps: [
      {
        id: '1',
        title: 'Problem Definition',
        description: 'Define the problem or topic to analyze',
        type: 'input',
        required: true,
        completed: false,
      },
      {
        id: '2',
        title: 'Information Gathering',
        description: 'Collect relevant information and data',
        type: 'checklist',
        required: true,
        completed: false,
        items: [
          'Research background',
          'Identify key sources',
          'Document findings',
        ],
      },
      {
        id: '3',
        title: 'Analysis',
        description: 'Analyze the gathered information',
        type: 'textarea',
        required: true,
        completed: false,
      },
    ] as ThinkingStep[],
    status: 'in_progress',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    user_id: '1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Process Initialization', () => {
    it('should load process details on mount', async () => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(mockProcess);
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        expect(screen.getByText('Critical Analysis Process')).toBeInTheDocument();
        expect(screen.getByText('Problem Definition')).toBeInTheDocument();
      });
    });

    it('should show loading state while fetching process', () => {
      vi.mocked(thinkingService.getProcessDetails).mockImplementation(() => new Promise(() => {}));
      
      render(<ThinkingProcess processId="1" />);
      
      expect(screen.getByTestId('thinking-process-skeleton')).toBeInTheDocument();
    });

    it('should handle process loading error', async () => {
      vi.mocked(thinkingService.getProcessDetails).mockRejectedValue(new Error('Failed to load process'));
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load process/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('Step Navigation', () => {
    beforeEach(() => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(mockProcess);
    });

    it('should display current step', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        expect(screen.getByText('Problem Definition')).toBeInTheDocument();
        expect(screen.getByText('Define the problem or topic to analyze')).toBeInTheDocument();
      });
    });

    it('should navigate to next step when current step is completed', async () => {
      vi.mocked(thinkingService.completeStep).mockResolvedValue({ ...mockProcess, current_step: 1 });
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test problem definition' } });
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });

      expect(screen.getByText('Information Gathering')).toBeInTheDocument();
    });

    it('should allow navigation to previous step', async () => {
      const processWithStep2 = { ...mockProcess, current_step: 1 };
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(processWithStep2);
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /back/i });
        fireEvent.click(backButton);
      });

      expect(screen.getByText('Problem Definition')).toBeInTheDocument();
    });

    it('should disable next button when step is not completed', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe('Step Completion', () => {
    beforeEach(() => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(mockProcess);
    });

    it('should mark text input step as completed when filled', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test problem definition' } });
      });

      expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    });

    it('should mark checklist step as completed when all items are checked', async () => {
      const processWithStep2 = { ...mockProcess, current_step: 1 };
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(processWithStep2);
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
          fireEvent.click(checkbox);
        });
      });

      expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    });

    it('should save progress when step is completed', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test problem definition' } });
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });

      expect(thinkingService.saveProgress).toHaveBeenCalledWith('1', {
        step_id: '1',
        content: 'Test problem definition',
      });
    });
  });

  describe('Process Completion', () => {
    beforeEach(() => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue({
        ...mockProcess,
        current_step: 2,
        steps: mockProcess.steps.map(step => ({ ...step, completed: true })),
      });
    });

    it('should show completion screen when all steps are done', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const finishButton = screen.getByRole('button', { name: /finish/i });
        fireEvent.click(finishButton);
      });

      expect(screen.getByText(/process completed/i)).toBeInTheDocument();
      expect(screen.getByText(/view summary/i)).toBeInTheDocument();
    });

    it('should allow reviewing completed steps', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const reviewButton = screen.getByRole('button', { name: /review/i });
        fireEvent.click(reviewButton);
      });

      expect(screen.getByText('Problem Definition')).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });

  describe('Progress Tracking', () => {
    beforeEach(() => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(mockProcess);
    });

    it('should display progress indicator', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
      });
    });

    it('should update progress when step is completed', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test problem definition' } });
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });

      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });
  });

  describe('Auto-save Functionality', () => {
    beforeEach(() => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(mockProcess);
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto-save progress after user input', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test' } });
      });

      vi.advanceTimersByTime(2000);

      expect(thinkingService.saveProgress).toHaveBeenCalledWith('1', {
        step_id: '1',
        content: 'Test',
      });
    });

    it('should show saving indicator during auto-save', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test' } });
      });

      expect(screen.getByText(/saving/i)).toBeInTheDocument();

      vi.advanceTimersByTime(2000);

      expect(screen.getByText(/saved/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(mockProcess);
    });

    it('should have proper heading hierarchy', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const headings = screen.getAllByRole('heading');
        expect(headings[0]).toHaveTextContent('Critical Analysis Process');
        expect(headings[1]).toHaveTextContent('Problem Definition');
      });
    });

    it('should have ARIA labels for navigation controls', async () => {
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toHaveAttribute('aria-label');
        expect(screen.getByRole('button', { name: /back/i })).toHaveAttribute('aria-label');
      });
    });

    it('should announce step transitions', async () => {
      vi.mocked(thinkingService.completeStep).mockResolvedValue({ ...mockProcess, current_step: 1 });
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test problem definition' } });
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });

      expect(screen.getByRole('alert')).toHaveTextContent(/moving to step 2/i);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      vi.mocked(thinkingService.getProcessDetails).mockResolvedValue(mockProcess);
    });

    it('should handle step completion error', async () => {
      vi.mocked(thinkingService.completeStep).mockRejectedValue(new Error('Failed to complete step'));
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test problem definition' } });
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });

      expect(screen.getByText(/failed to complete step/i)).toBeInTheDocument();
    });

    it('should handle auto-save error', async () => {
      vi.mocked(thinkingService.saveProgress).mockRejectedValue(new Error('Failed to save progress'));
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test' } });
      });

      vi.advanceTimersByTime(2000);

      expect(screen.getByText(/failed to save progress/i)).toBeInTheDocument();
    });

    it('should allow retry after save failure', async () => {
      vi.mocked(thinkingService.saveProgress).mockRejectedValue(new Error('Failed to save progress'));
      
      render(<ThinkingProcess processId="1" />);
      
      await waitFor(() => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Test' } });
      });

      vi.advanceTimersByTime(2000);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      expect(thinkingService.saveProgress).toHaveBeenCalledTimes(2);
    });
  });
});
