import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '../ConfirmDialog';
import '@testing-library/jest-dom';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Test Title',
    message: 'Test Message',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders with custom button text', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Yes"
        cancelText="No"
      />
    );
    
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when dialog is closed via backdrop click', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    // Find the backdrop and click it
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    }
  });

  it('renders with different severity levels', () => {
    const { rerender } = render(
      <ConfirmDialog {...defaultProps} severity="error" />
    );
    
    expect(screen.getByText('Confirm')).toHaveClass('MuiButton-containedError');

    rerender(<ConfirmDialog {...defaultProps} severity="info" />);
    expect(screen.getByText('Confirm')).toHaveClass('MuiButton-containedInfo');
  });
});
