import { render, screen } from '@testing-library/react';
import { MonacoEditor } from '../../components/editor/MonacoEditor';

describe('MonacoEditor', () => {
  it('renders without crashing', () => {
    render(
      <MonacoEditor
        value="Test content"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // Add more tests as needed
}); 