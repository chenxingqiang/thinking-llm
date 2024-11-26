import { render, screen, fireEvent } from '@testing-library/react';
import { ProtocolDetail } from '../../pages/ProtocolDetail';
import { MemoryRouter } from 'react-router-dom';

describe('ProtocolDetail', () => {
  it('renders all tabs', () => {
    render(
      <MemoryRouter>
        <ProtocolDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Versions')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('switches content when tabs are clicked', () => {
    render(
      <MemoryRouter>
        <ProtocolDetail />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Versions'));
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/Version/);

    fireEvent.click(screen.getByText('Usage'));
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/How to Use/);
  });
}); 