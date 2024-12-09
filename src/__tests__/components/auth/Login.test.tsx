import { render, screen, fireEvent, waitFor } from '../../../setup/test-utils';
import { Login } from '../../../components/auth/Login';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

// Mock router hooks
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(),
}));

// Mock Supabase client
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  },
}));

describe('Login Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form', () => {
      render(<Login />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render social login buttons', () => {
      render(<Login />);
      
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      render(<Login />);
      
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty fields', async () => {
      render(<Login />);
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      render(<Login />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should validate password length', async () => {
      render(<Login />);
      
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Flow', () => {
    it('should handle successful login', async () => {
      render(<Login />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: errorMessage },
      });
      
      render(<Login />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should handle social login', async () => {
      (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        data: { provider: 'google' },
        error: null,
      });
      
      render(<Login />);
      
      fireEvent.click(screen.getByRole('button', { name: /google/i }));
      
      await waitFor(() => {
        expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
        });
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during authentication', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      
      render(<Login />);
      
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to forgot password page', () => {
      render(<Login />);
      
      fireEvent.click(screen.getByText(/forgot password/i));
      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });

    it('should navigate to signup page', () => {
      render(<Login />);
      
      fireEvent.click(screen.getByText(/create an account/i));
      expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labeling', () => {
      render(<Login />);
      
      expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'Login form');
    });

    it('should maintain focus management', () => {
      render(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      emailInput.focus();
      fireEvent.keyDown(emailInput, { key: 'Tab' });
      expect(document.activeElement).toBe(passwordInput);
      
      fireEvent.keyDown(passwordInput, { key: 'Tab' });
      expect(document.activeElement).toBe(submitButton);
    });

    it('should announce form errors to screen readers', async () => {
      render(<Login />);
      
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });
  });
});
