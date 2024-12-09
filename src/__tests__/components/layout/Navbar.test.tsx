import { render, screen, fireEvent } from '../../../setup/test-utils';
import { Navbar } from '../../../components/layout/Navbar';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

// Mock router hooks
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(),
}));

describe('Navbar Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the navbar with logo', () => {
      render(<Navbar />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      render(<Navbar />);
      expect(screen.getByText(/templates/i)).toBeInTheDocument();
      expect(screen.getByText(/protocols/i)).toBeInTheDocument();
    });

    it('should render user menu when logged in', () => {
      const mockUser = { name: 'Test User', email: 'test@example.com' };
      vi.spyOn(React, 'useState').mockImplementationOnce(() => [mockUser, vi.fn()]);

      render(<Navbar />);
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to templates page when clicking Templates link', () => {
      render(<Navbar />);
      fireEvent.click(screen.getByText(/templates/i));
      expect(mockNavigate).toHaveBeenCalledWith('/templates');
    });

    it('should navigate to protocols page when clicking Protocols link', () => {
      render(<Navbar />);
      fireEvent.click(screen.getByText(/protocols/i));
      expect(mockNavigate).toHaveBeenCalledWith('/protocols');
    });
  });

  describe('User Menu', () => {
    it('should open user menu on avatar click', () => {
      const mockUser = { name: 'Test User', email: 'test@example.com' };
      vi.spyOn(React, 'useState').mockImplementationOnce(() => [mockUser, vi.fn()]);

      render(<Navbar />);
      fireEvent.click(screen.getByTestId('user-menu-button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should close user menu when clicking outside', () => {
      const mockUser = { name: 'Test User', email: 'test@example.com' };
      vi.spyOn(React, 'useState').mockImplementationOnce(() => [mockUser, vi.fn()]);

      render(<Navbar />);
      
      // Open menu
      fireEvent.click(screen.getByTestId('user-menu-button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      
      // Click outside
      fireEvent.click(document.body);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should handle logout', () => {
      const mockUser = { name: 'Test User', email: 'test@example.com' };
      const mockSetUser = vi.fn();
      vi.spyOn(React, 'useState').mockImplementationOnce(() => [mockUser, mockSetUser]);

      render(<Navbar />);
      
      // Open menu and click logout
      fireEvent.click(screen.getByTestId('user-menu-button'));
      fireEvent.click(screen.getByText(/logout/i));
      
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile menu button on small screens', () => {
      // Mock window.matchMedia for small screen
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(max-width: 600px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      render(<Navbar />);
      expect(screen.getByLabelText(/menu/i)).toBeInTheDocument();
    });

    it('should open mobile menu when clicking menu button', () => {
      // Mock window.matchMedia for small screen
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(max-width: 600px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      render(<Navbar />);
      fireEvent.click(screen.getByLabelText(/menu/i));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle theme when clicking theme button', () => {
      const mockToggleTheme = vi.fn();
      vi.spyOn(React, 'useContext').mockImplementation(() => ({
        toggleTheme: mockToggleTheme,
        theme: 'light',
      }));

      render(<Navbar />);
      fireEvent.click(screen.getByLabelText(/toggle theme/i));
      expect(mockToggleTheme).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Navbar />);
      expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'main navigation');
      expect(screen.getByTestId('user-menu-button')).toHaveAttribute('aria-haspopup', 'true');
    });

    it('should be keyboard navigable', () => {
      render(<Navbar />);
      
      // Focus first link
      const firstLink = screen.getByText(/templates/i);
      firstLink.focus();
      expect(document.activeElement).toBe(firstLink);
      
      // Tab to next link
      fireEvent.keyDown(firstLink, { key: 'Tab' });
      const secondLink = screen.getByText(/protocols/i);
      expect(document.activeElement).toBe(secondLink);
    });
  });
});
