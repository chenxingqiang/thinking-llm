import { TextField, TextFieldProps } from '@mui/material';
import './Editor.css';

interface EditorProps {
  onChange: (text: string) => void;
}

export function Editor({ onChange }: EditorProps) {
  const handleChange: TextFieldProps['onChange'] = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="editor">
      <TextField
        fullWidth
        multiline
        rows={10}
        variant="outlined"
        placeholder="Start typing your thinking process here..."
        onChange={handleChange}
        className="editor-input"
      />
    </div>
  );
} 