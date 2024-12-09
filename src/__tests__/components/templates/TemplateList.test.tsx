import { render, screen, fireEvent, waitFor } from '../../../setup/test-utils';
import { TemplateList } from '../../../components/templates/TemplateList';
import { vi } from 'vitest';
import { templateService } from '../../../services/supabase';

// Mock the template service
vi.mock('../../../services/supabase', () => ({
  templateService: {
    getList: vi.fn(),
    delete: vi.fn(),
    getTemplateDetails: vi.fn(),
  },
}));

describe('TemplateList Component', () => {
  const mockTemplates = [
    {
      id: '1',
      title: 'Template 1',
      description: 'Description 1',
      category: 'academic',
      status: 'active',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      title: 'Template 2',
      description: 'Description 2',
      category: 'programming',
      status: 'active',
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ];

  beforeEach(() => {
    (templateService.getList as jest.Mock).mockResolvedValue(mockTemplates);
    (templateService.getTemplateDetails as jest.Mock).mockResolvedValue({
      steps: [],
      guidelines: [],
      frameworks: [],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading indicator while fetching templates', () => {
      render(<TemplateList />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should hide loading indicator after templates are loaded', async () => {
      render(<TemplateList />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });
  });

  describe('Template Display', () => {
    it('should render template list after loading', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        mockTemplates.forEach(template => {
          expect(screen.getByText(template.title)).toBeInTheDocument();
          expect(screen.getByText(template.description)).toBeInTheDocument();
        });
      });
    });

    it('should display template categories as chips', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        mockTemplates.forEach(template => {
          expect(screen.getByText(template.category)).toBeInTheDocument();
        });
      });
    });

    it('should show error message when loading fails', async () => {
      const errorMessage = 'Failed to load templates';
      (templateService.getList as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      render(<TemplateList />);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Template Actions', () => {
    it('should expand template details when clicking expand button', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        const expandButton = screen.getAllByLabelText(/expand/i)[0];
        fireEvent.click(expandButton);
        expect(templateService.getTemplateDetails).toHaveBeenCalledWith(mockTemplates[0].id);
      });
    });

    it('should navigate to edit page when clicking edit button', async () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', () => ({
        ...vi.importActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      render(<TemplateList />);
      
      await waitFor(() => {
        const editButton = screen.getAllByLabelText(/edit/i)[0];
        fireEvent.click(editButton);
        expect(mockNavigate).toHaveBeenCalledWith(`/template/edit/${mockTemplates[0].id}`);
      });
    });

    it('should show delete confirmation dialog when clicking delete button', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        const deleteButton = screen.getAllByLabelText(/delete/i)[0];
        fireEvent.click(deleteButton);
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      });
    });

    it('should delete template when confirming deletion', async () => {
      (templateService.delete as jest.Mock).mockResolvedValue(undefined);
      
      render(<TemplateList />);
      
      await waitFor(async () => {
        const deleteButton = screen.getAllByLabelText(/delete/i)[0];
        fireEvent.click(deleteButton);
        
        const confirmButton = screen.getByText(/confirm/i);
        fireEvent.click(confirmButton);
        
        expect(templateService.delete).toHaveBeenCalledWith(mockTemplates[0].id);
        expect(templateService.getList).toHaveBeenCalledTimes(2); // Initial load + after delete
      });
    });
  });

  describe('Template Preview', () => {
    it('should open preview dialog when clicking preview button', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        const previewButton = screen.getAllByLabelText(/preview/i)[0];
        fireEvent.click(previewButton);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should close preview dialog when clicking close button', async () => {
      render(<TemplateList />);
      
      await waitFor(async () => {
        const previewButton = screen.getAllByLabelText(/preview/i)[0];
        fireEvent.click(previewButton);
        
        const closeButton = screen.getByLabelText(/close/i);
        fireEvent.click(closeButton);
        
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Filtering and Sorting', () => {
    it('should filter templates by category', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        const categoryFilter = screen.getByLabelText(/filter by category/i);
        fireEvent.change(categoryFilter, { target: { value: 'academic' } });
        
        expect(screen.getByText('Template 1')).toBeInTheDocument();
        expect(screen.queryByText('Template 2')).not.toBeInTheDocument();
      });
    });

    it('should sort templates by date', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        const sortButton = screen.getByLabelText(/sort by date/i);
        fireEvent.click(sortButton);
        
        const templateTitles = screen.getAllByRole('heading').map(h => h.textContent);
        expect(templateTitles).toEqual(['Template 2', 'Template 1']);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on interactive elements', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'templates');
        expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-labelledby', expect.any(String));
      });
    });

    it('should be keyboard navigable', async () => {
      render(<TemplateList />);
      
      await waitFor(() => {
        const firstTemplate = screen.getAllByRole('listitem')[0];
        firstTemplate.focus();
        expect(document.activeElement).toBe(firstTemplate);
        
        fireEvent.keyDown(firstTemplate, { key: 'Enter' });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });
});
