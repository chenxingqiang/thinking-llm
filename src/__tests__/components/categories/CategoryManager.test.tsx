import { render, screen, fireEvent, waitFor } from '../../../setup/test-utils';
import { CategoryManager } from '../../../components/categories/CategoryManager';
import { vi } from 'vitest';

// Mock the category service
vi.mock('../../../services/supabase', () => ({
  categoryService: {
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

describe('CategoryManager Component', () => {
  const mockCategories = [
    { 
      id: '1', 
      name: 'Academic Writing', 
      description: 'Categories related to academic research and writing',
      color: '#3f51b5',
      icon: 'school',
      user_id: '1',
      created_at: '2024-01-01',
    },
    { 
      id: '2', 
      name: 'Software Development', 
      description: 'Categories for programming and software engineering',
      color: '#4caf50',
      icon: 'code',
      user_id: '1',
      created_at: '2024-01-02',
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(categoryService.getCategories).mockResolvedValue(mockCategories);
  });

  describe('Loading and Rendering', () => {
    it('should render categories list', async () => {
      render(<CategoryManager />);
      
      await waitFor(() => {
        mockCategories.forEach(category => {
          expect(screen.getByText(category.name)).toBeInTheDocument();
          expect(screen.getByText(category.description)).toBeInTheDocument();
        });
      });
    });

    it('should show loading skeleton while fetching categories', () => {
      vi.mocked(categoryService.getCategories).mockImplementation(() => new Promise(() => {}));
      
      render(<CategoryManager />);
      
      expect(screen.getByTestId('categories-skeleton')).toBeInTheDocument();
    });

    it('should handle categories loading error', async () => {
      vi.mocked(categoryService.getCategories).mockRejectedValue(new Error('Failed to load categories'));
      
      render(<CategoryManager />);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load categories/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('Category Creation', () => {
    it('should open create category dialog', async () => {
      render(<CategoryManager />);
      
      const createButton = screen.getByRole('button', { name: /create category/i });
      fireEvent.click(createButton);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/category name/i)).toBeInTheDocument();
    });

    it('should create a new category', async () => {
      const newCategory = {
        name: 'Data Science',
        description: 'Categories for data analysis and machine learning',
        color: '#ff9800',
        icon: 'analytics',
      };

      vi.mocked(categoryService.createCategory).mockResolvedValue({
        ...newCategory,
        id: '3',
        user_id: '1',
        created_at: '2024-01-03',
      });

      render(<CategoryManager />);
      
      const createButton = screen.getByRole('button', { name: /create category/i });
      fireEvent.click(createButton);
      
      const nameInput = screen.getByLabelText(/category name/i);
      const descInput = screen.getByLabelText(/description/i);
      const colorPicker = screen.getByLabelText(/color/i);
      const iconSelect = screen.getByLabelText(/icon/i);
      
      fireEvent.change(nameInput, { target: { value: newCategory.name } });
      fireEvent.change(descInput, { target: { value: newCategory.description } });
      fireEvent.change(colorPicker, { target: { value: newCategory.color } });
      fireEvent.change(iconSelect, { target: { value: newCategory.icon } });
      
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(categoryService.createCategory).toHaveBeenCalledWith(expect.objectContaining(newCategory));
        expect(screen.getByText(newCategory.name)).toBeInTheDocument();
      });
    });
  });

  describe('Category Editing', () => {
    it('should open edit category dialog', async () => {
      render(<CategoryManager />);
      
      await waitFor(() => {
        const editButtons = screen.getAllByLabelText(/edit category/i);
        fireEvent.click(editButtons[0]);
      });
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/category name/i)).toHaveValue(mockCategories[0].name);
    });

    it('should update an existing category', async () => {
      const updatedCategory = {
        ...mockCategories[0],
        name: 'Updated Academic Writing',
        description: 'Revised description for academic writing',
      };

      vi.mocked(categoryService.updateCategory).mockResolvedValue(updatedCategory);

      render(<CategoryManager />);
      
      await waitFor(() => {
        const editButtons = screen.getAllByLabelText(/edit category/i);
        fireEvent.click(editButtons[0]);
      });
      
      const nameInput = screen.getByLabelText(/category name/i);
      const descInput = screen.getByLabelText(/description/i);
      
      fireEvent.change(nameInput, { target: { value: updatedCategory.name } });
      fireEvent.change(descInput, { target: { value: updatedCategory.description } });
      
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(categoryService.updateCategory).toHaveBeenCalledWith(expect.objectContaining(updatedCategory));
        expect(screen.getByText(updatedCategory.name)).toBeInTheDocument();
      });
    });
  });

  describe('Category Deletion', () => {
    it('should open delete confirmation dialog', async () => {
      render(<CategoryManager />);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/delete category/i);
        fireEvent.click(deleteButtons[0]);
      });
      
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });

    it('should delete a category', async () => {
      vi.mocked(categoryService.deleteCategory).mockResolvedValue(undefined);

      render(<CategoryManager />);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/delete category/i);
        fireEvent.click(deleteButtons[0]);
      });
      
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(categoryService.deleteCategory).toHaveBeenCalledWith(mockCategories[0].id);
        expect(screen.queryByText(mockCategories[0].name)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validation and Error Handling', () => {
    it('should prevent creating category with empty name', async () => {
      render(<CategoryManager />);
      
      const createButton = screen.getByRole('button', { name: /create category/i });
      fireEvent.click(createButton);
      
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(categoryService.createCategory).not.toHaveBeenCalled();
    });

    it('should handle category creation error', async () => {
      vi.mocked(categoryService.createCategory).mockRejectedValue(new Error('Failed to create category'));

      render(<CategoryManager />);
      
      const createButton = screen.getByRole('button', { name: /create category/i });
      fireEvent.click(createButton);
      
      const nameInput = screen.getByLabelText(/category name/i);
      fireEvent.change(nameInput, { target: { value: 'New Category' } });
      
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to create category/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(<CategoryManager />);
      
      await waitFor(() => {
        const categoryList = screen.getByRole('list');
        expect(categoryList).toHaveAttribute('aria-label', 'categories');
        
        const categoryItems = screen.getAllByRole('listitem');
        categoryItems.forEach(item => {
          expect(item).toHaveAttribute('aria-labelledby', expect.any(String));
        });
      });
    });

    it('should be keyboard navigable', async () => {
      render(<CategoryManager />);
      
      await waitFor(() => {
        const firstCategory = screen.getAllByRole('listitem')[0];
        firstCategory.focus();
        expect(document.activeElement).toBe(firstCategory);
        
        fireEvent.keyDown(firstCategory, { key: 'Enter' });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });
});
