import { render, screen, fireEvent, waitFor } from '../../../setup/test-utils';
import { ProtocolList } from '../../../components/protocols/ProtocolList';
import { vi } from 'vitest';
import { Protocol } from '../../../types/protocol';

// Mock the protocol service
vi.mock('../../../services/supabase', () => ({
  protocolService: {
    getList: vi.fn(),
    delete: vi.fn(),
    getProtocolDetails: vi.fn(),
  },
}));

describe('ProtocolList Component', () => {
  const mockProtocols: Protocol[] = [
    {
      id: '1',
      title: 'Academic Writing Protocol',
      description: 'A structured approach to academic writing',
      content: '# Academic Writing\n\n## Introduction',
      status: 'published',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      user_id: '1',
      author: { id: '1', name: 'John Doe' },
      category: { id: '1', name: 'Academic' },
      tags: [{ id: '1', name: 'writing' }],
      collaborators: [],
    },
    {
      id: '2',
      title: 'Programming Design Protocol',
      description: 'Best practices for software design',
      content: '# Programming Design\n\n## Principles',
      status: 'draft',
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
      user_id: '1',
      author: { id: '1', name: 'John Doe' },
      category: { id: '2', name: 'Programming' },
      tags: [{ id: '2', name: 'design' }],
      collaborators: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading skeleton initially', () => {
      render(<ProtocolList />);
      expect(screen.getByTestId('protocol-list-skeleton')).toBeInTheDocument();
    });

    it('should hide loading skeleton after protocols are loaded', async () => {
      vi.mocked(protocolService.getList).mockResolvedValue(mockProtocols);
      
      render(<ProtocolList />);
      
      await waitFor(() => {
        expect(screen.queryByTestId('protocol-list-skeleton')).not.toBeInTheDocument();
      });
    });
  });

  describe('Protocol Display', () => {
    beforeEach(() => {
      vi.mocked(protocolService.getList).mockResolvedValue(mockProtocols);
    });

    it('should render protocol cards with correct information', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        mockProtocols.forEach(protocol => {
          expect(screen.getByText(protocol.title)).toBeInTheDocument();
          expect(screen.getByText(protocol.description)).toBeInTheDocument();
          expect(screen.getByText(protocol.author.name)).toBeInTheDocument();
        });
      });
    });

    it('should display protocol status badges', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        expect(screen.getByText('published')).toHaveClass('MuiChip-colorSuccess');
        expect(screen.getByText('draft')).toHaveClass('MuiChip-colorWarning');
      });
    });

    it('should display protocol tags', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        expect(screen.getByText('writing')).toBeInTheDocument();
        expect(screen.getByText('design')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering and Sorting', () => {
    beforeEach(() => {
      vi.mocked(protocolService.getList).mockResolvedValue(mockProtocols);
    });

    it('should filter protocols by category', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const categoryFilter = screen.getByLabelText(/filter by category/i);
        fireEvent.mouseDown(categoryFilter);
      });

      const academicOption = screen.getByText('Academic');
      fireEvent.click(academicOption);

      expect(screen.getByText('Academic Writing Protocol')).toBeInTheDocument();
      expect(screen.queryByText('Programming Design Protocol')).not.toBeInTheDocument();
    });

    it('should filter protocols by status', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const statusFilter = screen.getByLabelText(/filter by status/i);
        fireEvent.mouseDown(statusFilter);
      });

      const publishedOption = screen.getByText('Published');
      fireEvent.click(publishedOption);

      expect(screen.getByText('Academic Writing Protocol')).toBeInTheDocument();
      expect(screen.queryByText('Programming Design Protocol')).not.toBeInTheDocument();
    });

    it('should sort protocols by date', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const sortButton = screen.getByLabelText(/sort by date/i);
        fireEvent.click(sortButton);
      });

      const protocolTitles = screen.getAllByRole('heading').map(h => h.textContent);
      expect(protocolTitles).toEqual([
        'Programming Design Protocol',
        'Academic Writing Protocol',
      ]);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      vi.mocked(protocolService.getList).mockResolvedValue(mockProtocols);
    });

    it('should filter protocols by search term', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/search protocols/i);
        fireEvent.change(searchInput, { target: { value: 'academic' } });
      });

      expect(screen.getByText('Academic Writing Protocol')).toBeInTheDocument();
      expect(screen.queryByText('Programming Design Protocol')).not.toBeInTheDocument();
    });

    it('should show no results message when search has no matches', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/search protocols/i);
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      });

      expect(screen.getByText(/no protocols found/i)).toBeInTheDocument();
    });
  });

  describe('Protocol Actions', () => {
    beforeEach(() => {
      vi.mocked(protocolService.getList).mockResolvedValue(mockProtocols);
    });

    it('should navigate to protocol details on card click', async () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', () => ({
        ...vi.importActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      render(<ProtocolList />);
      
      await waitFor(() => {
        const protocolCard = screen.getByText('Academic Writing Protocol');
        fireEvent.click(protocolCard);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/protocol/1');
    });

    it('should show delete confirmation dialog', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const deleteButton = screen.getAllByLabelText(/delete protocol/i)[0];
        fireEvent.click(deleteButton);
      });

      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });

    it('should handle protocol deletion', async () => {
      vi.mocked(protocolService.delete).mockResolvedValue(undefined);
      
      render(<ProtocolList />);
      
      await waitFor(() => {
        const deleteButton = screen.getAllByLabelText(/delete protocol/i)[0];
        fireEvent.click(deleteButton);
      });

      const confirmButton = screen.getByText(/confirm/i);
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(protocolService.delete).toHaveBeenCalledWith('1');
        expect(protocolService.getList).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when loading fails', async () => {
      const error = new Error('Failed to load protocols');
      vi.mocked(protocolService.getList).mockRejectedValue(error);
      
      render(<ProtocolList />);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load protocols/i)).toBeInTheDocument();
      });
    });

    it('should show error message when deletion fails', async () => {
      vi.mocked(protocolService.getList).mockResolvedValue(mockProtocols);
      vi.mocked(protocolService.delete).mockRejectedValue(new Error('Failed to delete'));
      
      render(<ProtocolList />);
      
      await waitFor(() => {
        const deleteButton = screen.getAllByLabelText(/delete protocol/i)[0];
        fireEvent.click(deleteButton);
      });

      const confirmButton = screen.getByText(/confirm/i);
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to delete/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no protocols exist', async () => {
      vi.mocked(protocolService.getList).mockResolvedValue([]);
      
      render(<ProtocolList />);
      
      await waitFor(() => {
        expect(screen.getByText(/no protocols found/i)).toBeInTheDocument();
        expect(screen.getByText(/create your first protocol/i)).toBeInTheDocument();
      });
    });

    it('should navigate to create protocol page from empty state', async () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', () => ({
        ...vi.importActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      vi.mocked(protocolService.getList).mockResolvedValue([]);
      
      render(<ProtocolList />);
      
      await waitFor(() => {
        const createButton = screen.getByText(/create your first protocol/i);
        fireEvent.click(createButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/protocol/create');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(protocolService.getList).mockResolvedValue(mockProtocols);
    });

    it('should have proper ARIA labels', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'protocols');
        expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-labelledby', expect.any(String));
      });
    });

    it('should be keyboard navigable', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const firstProtocol = screen.getAllByRole('listitem')[0];
        firstProtocol.focus();
        expect(document.activeElement).toBe(firstProtocol);
        
        fireEvent.keyDown(firstProtocol, { key: 'Enter' });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should announce status changes to screen readers', async () => {
      render(<ProtocolList />);
      
      await waitFor(() => {
        const deleteButton = screen.getAllByLabelText(/delete protocol/i)[0];
        fireEvent.click(deleteButton);
      });

      const confirmButton = screen.getByText(/confirm/i);
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/protocol deleted/i)).toHaveAttribute('role', 'status');
      });
    });
  });
});
