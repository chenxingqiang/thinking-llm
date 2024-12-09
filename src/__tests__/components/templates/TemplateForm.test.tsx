import { render, screen, fireEvent, waitFor } from '../../../setup/test-utils';
import { TemplateForm } from '../../../components/templates/TemplateForm';
import { vi } from 'vitest';
import { useParams, useNavigate } from 'react-router-dom';
import { templateService } from '../../../services/supabase';

// Mock router hooks
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

// Mock template service
vi.mock('../../../services/supabase', () => ({
  templateService: {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

describe('TemplateForm Component', () => {
  const mockTemplate = {
    id: '1',
    title: 'Test Template',
    description: 'Test Description',
    content: '# Test Content',
    category: 'academic',
    status: 'active' as const,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (templateService.getById as jest.Mock).mockResolvedValue(mockTemplate);
    (templateService.create as jest.Mock).mockResolvedValue({ id: '2' });
    (templateService.update as jest.Mock).mockResolvedValue(mockTemplate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      (useParams as jest.Mock).mockReturnValue({});
    });

    it('should render empty form in create mode', () => {
      render(<TemplateForm />);
      
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByLabelText(/content/i)).toHaveValue('');
    });

    it('should handle form submission in create mode', async () => {
      render(<TemplateForm />);
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Template' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Description' } });
      fireEvent.change(screen.getByLabelText(/content/i), { target: { value: '# New Content' } });
      
      // Submit form
      fireEvent.click(screen.getByText(/save/i));
      
      await waitFor(() => {
        expect(templateService.create).toHaveBeenCalledWith({
          title: 'New Template',
          description: 'New Description',
          content: '# New Content',
          category: expect.any(String),
          status: 'active',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/templates');
      });
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      (useParams as jest.Mock).mockReturnValue({ id: '1' });
    });

    it('should load and display template data in edit mode', async () => {
      render(<TemplateForm />);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue(mockTemplate.title);
        expect(screen.getByLabelText(/description/i)).toHaveValue(mockTemplate.description);
        expect(screen.getByLabelText(/content/i)).toHaveValue(mockTemplate.content);
      });
    });

    it('should handle form submission in edit mode', async () => {
      render(<TemplateForm />);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveValue(mockTemplate.title);
      });

      // Modify form
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Title' } });
      
      // Submit form
      fireEvent.click(screen.getByText(/save/i));
      
      await waitFor(() => {
        expect(templateService.update).toHaveBeenCalledWith('1', expect.objectContaining({
          title: 'Updated Title',
        }));
        expect(mockNavigate).toHaveBeenCalledWith('/templates');
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      render(<TemplateForm />);
      
      // Submit empty form
      fireEvent.click(screen.getByText(/save/i));
      
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
        expect(screen.getByText(/content is required/i)).toBeInTheDocument();
      });
    });

    it('should validate title length', async () => {
      render(<TemplateForm />);
      
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'a'.repeat(101) } });
      fireEvent.click(screen.getByText(/save/i));
      
      await waitFor(() => {
        expect(screen.getByText(/title must be less than 100 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Preview Mode', () => {
    it('should toggle between edit and preview modes', () => {
      render(<TemplateForm />);
      
      // Enter preview mode
      fireEvent.click(screen.getByText(/preview/i));
      expect(screen.getByTestId('preview-mode')).toBeInTheDocument();
      
      // Return to edit mode
      fireEvent.click(screen.getByText(/edit/i));
      expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
    });

    it('should render markdown preview correctly', async () => {
      render(<TemplateForm />);
      
      // Enter content and switch to preview
      fireEvent.change(screen.getByLabelText(/content/i), { target: { value: '# Heading\n\nParagraph' } });
      fireEvent.click(screen.getByText(/preview/i));
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading');
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state while fetching template', () => {
      (templateService.getById as jest.Mock).mockImplementation(() => new Promise(() => {}));
      (useParams as jest.Mock).mockReturnValue({ id: '1' });
      
      render(<TemplateForm />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show error message when template fetch fails', async () => {
      const error = new Error('Failed to load template');
      (templateService.getById as jest.Mock).mockRejectedValue(error);
      (useParams as jest.Mock).mockReturnValue({ id: '1' });
      
      render(<TemplateForm />);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load template/i)).toBeInTheDocument();
      });
    });
  });

  describe('Unsaved Changes', () => {
    it('should prompt before navigating away with unsaved changes', async () => {
      render(<TemplateForm />);
      
      // Make changes
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
      
      // Try to navigate away
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      
      expect(event.defaultPrevented).toBe(true);
    });

    it('should not prompt if no changes were made', () => {
      render(<TemplateForm />);
      
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should maintain focus management when switching modes', () => {
      render(<TemplateForm />);
      
      const previewButton = screen.getByText(/preview/i);
      previewButton.focus();
      fireEvent.click(previewButton);
      
      const editButton = screen.getByText(/edit/i);
      expect(document.activeElement).toBe(editButton);
    });

    it('should have proper ARIA labels', () => {
      render(<TemplateForm />);
      
      expect(screen.getByRole('form')).toHaveAttribute('aria-label', expect.any(String));
      expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-required', 'true');
    });
  });
});
