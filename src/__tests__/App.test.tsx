import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

// Mock the components used in routes
vi.mock('../components/layout/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>,
}));

vi.mock('../components/templates/TemplateList', () => ({
  TemplateList: () => <div data-testid="mock-template-list">Template List</div>,
}));

vi.mock('../components/templates/TemplateForm', () => ({
  TemplateForm: () => <div data-testid="mock-template-form">Template Form</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner initially', () => {
      render(<App />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should hide loading spinner after initialization', async () => {
      render(<App />);
      
      // Fast-forward timer
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error state is set', () => {
      // Mock useState to return error
      const errorMessage = 'Test error message';
      vi.spyOn(React, 'useState').mockImplementationOnce(() => [errorMessage, vi.fn()]);
      
      render(<App />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardError');
    });
  });

  describe('Routing', () => {
    it('should render home route by default', async () => {
      render(<App />);
      
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
      });
    });

    it('should render template list on /templates route', async () => {
      render(
        <MemoryRouter initialEntries={['/templates']}>
          <App />
        </MemoryRouter>
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-template-list')).toBeInTheDocument();
      });
    });

    it('should render template form on /template/create route', async () => {
      render(
        <MemoryRouter initialEntries={['/template/create']}>
          <App />
        </MemoryRouter>
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-template-form')).toBeInTheDocument();
      });
    });

    it('should render template edit form with id parameter', async () => {
      const testId = '123';
      render(
        <MemoryRouter initialEntries={[`/template/edit/${testId}`]}>
          <App />
        </MemoryRouter>
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-template-form')).toBeInTheDocument();
      });
    });
  });

  describe('Layout', () => {
    it('should render with correct layout structure', async () => {
      render(<App />);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        // Check main layout elements
        expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
        const mainContent = screen.getByRole('main');
        expect(mainContent).toBeInTheDocument();
        expect(mainContent).toHaveStyle({ flexGrow: 1, padding: '24px' });
      });
    });

    it('should apply correct styles to root container', async () => {
      render(<App />);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        const rootContainer = screen.getByTestId('mock-navbar').parentElement;
        expect(rootContainer).toHaveStyle({
          display: 'flex',
          minHeight: '100vh',
        });
      });
    });
  });

  describe('Cleanup', () => {
    it('should clear timeout on unmount', () => {
      const { unmount } = render(<App />);
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
      
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
