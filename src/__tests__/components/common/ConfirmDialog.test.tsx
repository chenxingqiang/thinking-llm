import { render, screen, fireEvent } from '../../../setup/test-utils';
import { ConfirmDialog } from '../../../infrastructure/components/common/ConfirmDialog';
import { vi } from 'vitest';

describe('ConfirmDialog Component', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render dialog with title and message', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    });

    it('should render default button text when not provided', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render custom button text when provided', () => {
      const customProps = {
        ...defaultProps,
        confirmText: 'Yes, do it',
        cancelText: 'No, go back',
      };
      
      render(<ConfirmDialog {...customProps} />);
      
      expect(screen.getByText(customProps.confirmText)).toBeInTheDocument();
      expect(screen.getByText(customProps.cancelText)).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
      render(<ConfirmDialog {...defaultProps} open={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Severity Styles', () => {
    it('should apply warning styles by default', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toHaveClass('MuiButton-containedWarning');
    });

    it('should apply error styles when severity is error', () => {
      render(<ConfirmDialog {...defaultProps} severity="error" />);
      
      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toHaveClass('MuiButton-containedError');
    });

    it('should apply info styles when severity is info', () => {
      render(<ConfirmDialog {...defaultProps} severity="info" />);
      
      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toHaveClass('MuiButton-containedInfo');
    });
  });

  describe('Interactions', () => {
    it('should call onConfirm when confirm button is clicked', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Confirm'));
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Cancel'));
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when clicking outside the dialog', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      fireEvent.click(document.querySelector('.MuiBackdrop-root')!);
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when pressing escape key', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', expect.any(String));
      expect(dialog).toHaveAttribute('aria-describedby', expect.any(String));
    });

    it('should trap focus within dialog', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const cancelButton = screen.getByText('Cancel');
      const confirmButton = screen.getByText('Confirm');
      
      // Focus should cycle between the buttons
      cancelButton.focus();
      fireEvent.keyDown(cancelButton, { key: 'Tab' });
      expect(document.activeElement).toBe(confirmButton);
      
      fireEvent.keyDown(confirmButton, { key: 'Tab' });
      expect(document.activeElement).toBe(cancelButton);
    });

    it('should focus confirm button by default', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      expect(document.activeElement).toBe(screen.getByText('Confirm'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title and message', () => {
      render(<ConfirmDialog {...defaultProps} title="" message="" />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle very long title and message', () => {
      const longText = 'a'.repeat(1000);
      render(<ConfirmDialog {...defaultProps} title={longText} message={longText} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle rapid open/close transitions', () => {
      const { rerender } = render(<ConfirmDialog {...defaultProps} open={false} />);
      
      // Rapidly toggle open state
      rerender(<ConfirmDialog {...defaultProps} open={true} />);
      rerender(<ConfirmDialog {...defaultProps} open={false} />);
      rerender(<ConfirmDialog {...defaultProps} open={true} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
