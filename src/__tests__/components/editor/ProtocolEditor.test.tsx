import { render, screen, fireEvent, waitFor } from '../../../setup/test-utils';
import { ProtocolEditor } from '../../../components/editor/ProtocolEditor';
import { vi } from 'vitest';
import { Protocol } from '../../../types/protocol';
import { useCollaboration } from '../../../hooks/useCollaboration';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: vi.fn(({ value, onChange }) => (
    <div data-testid="mock-monaco-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="mock-editor-textarea"
      />
    </div>
  )),
}));

// Mock collaboration hook
vi.mock('../../../hooks/useCollaboration', () => ({
  useCollaboration: vi.fn(),
}));

describe('ProtocolEditor Component', () => {
  const mockProtocol: Protocol = {
    id: '1',
    title: 'Test Protocol',
    description: 'Test Description',
    content: '# Test Content',
    status: 'draft',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    user_id: '1',
    author: { id: '1', name: 'Test User' },
    tags: [],
  };

  const mockOnChange = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    (useCollaboration as jest.Mock).mockReturnValue({
      isConnected: true,
      activeUsers: [],
      sendOperation: vi.fn(),
      applyOperation: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render editor with initial content', () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      expect(screen.getByTestId('mock-editor-textarea')).toHaveValue(mockProtocol.content);
    });

    it('should render toolbar with all buttons', () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /format/i })).toBeInTheDocument();
    });

    it('should render collaboration status', () => {
      (useCollaboration as jest.Mock).mockReturnValue({
        isConnected: true,
        activeUsers: [{ id: '2', name: 'Other User' }],
        sendOperation: vi.fn(),
        applyOperation: vi.fn(),
      });

      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      expect(screen.getByText(/other user/i)).toBeInTheDocument();
      expect(screen.getByTestId('connection-status')).toHaveTextContent(/connected/i);
    });
  });

  describe('Editor Functionality', () => {
    it('should handle content changes', async () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      const editor = screen.getByTestId('mock-editor-textarea');
      fireEvent.change(editor, { target: { value: '# New Content' } });
      
      expect(mockOnChange).toHaveBeenCalledWith('# New Content');
    });

    it('should handle save action', async () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      expect(mockOnSave).toHaveBeenCalled();
    });

    it('should format content when format button is clicked', async () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      const editor = screen.getByTestId('mock-editor-textarea');
      fireEvent.change(editor, { target: { value: '#Unformatted  Content' } });
      fireEvent.click(screen.getByRole('button', { name: /format/i }));
      
      expect(mockOnChange).toHaveBeenCalledWith('# Unformatted Content');
    });
  });

  describe('Preview Mode', () => {
    it('should toggle between edit and preview modes', () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      fireEvent.click(screen.getByRole('button', { name: /preview/i }));
      expect(screen.getByTestId('preview-mode')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-monaco-editor')).not.toBeInTheDocument();
      
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.queryByTestId('preview-mode')).not.toBeInTheDocument();
      expect(screen.getByTestId('mock-monaco-editor')).toBeInTheDocument();
    });

    it('should render markdown preview correctly', () => {
      render(
        <ProtocolEditor
          protocol={{ ...mockProtocol, content: '# Heading\n\nParagraph' }}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      fireEvent.click(screen.getByRole('button', { name: /preview/i }));
      
      expect(screen.getByRole('heading')).toHaveTextContent('Heading');
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });
  });

  describe('Collaboration Features', () => {
    it('should show disconnected state', () => {
      (useCollaboration as jest.Mock).mockReturnValue({
        isConnected: false,
        activeUsers: [],
        sendOperation: vi.fn(),
        applyOperation: vi.fn(),
      });

      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      expect(screen.getByTestId('connection-status')).toHaveTextContent(/disconnected/i);
    });

    it('should handle collaborative editing', async () => {
      const mockSendOperation = vi.fn();
      (useCollaboration as jest.Mock).mockReturnValue({
        isConnected: true,
        activeUsers: [{ id: '2', name: 'Other User' }],
        sendOperation: mockSendOperation,
        applyOperation: vi.fn(),
      });

      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      const editor = screen.getByTestId('mock-editor-textarea');
      fireEvent.change(editor, { target: { value: '# New Content' } });
      
      expect(mockSendOperation).toHaveBeenCalledWith({
        type: 'update',
        content: '# New Content',
      });
    });
  });

  describe('Auto-save Feature', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto-save after delay', () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      const editor = screen.getByTestId('mock-editor-textarea');
      fireEvent.change(editor, { target: { value: '# New Content' } });
      
      vi.advanceTimersByTime(2000); // Auto-save delay
      
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when save fails', async () => {
      const mockError = new Error('Failed to save');
      const mockOnSaveError = vi.fn().mockRejectedValue(mockError);

      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSaveError}
        />
      );
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle save shortcut (Ctrl+S)', () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      fireEvent.keyDown(window, { key: 's', ctrlKey: true });
      expect(mockOnSave).toHaveBeenCalled();
    });

    it('should handle preview shortcut (Ctrl+P)', () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      fireEvent.keyDown(window, { key: 'p', ctrlKey: true });
      expect(screen.getByTestId('preview-mode')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Editor tools');
      expect(screen.getByTestId('mock-monaco-editor')).toHaveAttribute('aria-label', 'Protocol editor');
    });

    it('should announce status changes to screen readers', async () => {
      render(
        <ProtocolEditor
          protocol={mockProtocol}
          onChange={mockOnChange}
          onSave={mockOnSave}
        />
      );
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/saved successfully/i)).toHaveAttribute('role', 'status');
      });
    });
  });
});
