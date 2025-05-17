import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInputs } from '../TextInputs';

describe('TextInputs', () => {
  const mockOnDearChange = vi.fn();
  const mockOnMessageChange = vi.fn();
  const mockOnFromChange = vi.fn();
  
  const defaultProps = {
    dearText: 'John',
    messageText: 'Happy Birthday!',
    fromText: 'Jane',
    onDearChange: mockOnDearChange,
    onMessageChange: mockOnMessageChange,
    onFromChange: mockOnFromChange
  };

  beforeEach(() => {
    mockOnDearChange.mockClear();
    mockOnMessageChange.mockClear();
    mockOnFromChange.mockClear();
  });

  it('renders all input fields with correct values', () => {
    render(<TextInputs {...defaultProps} />);
    
    expect(screen.getByLabelText(/dear/i)).toHaveValue('John');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Happy Birthday!');
    expect(screen.getByLabelText(/from/i)).toHaveValue('Jane');
  });

  it('calls onDearChange when dear field is updated', () => {
    render(<TextInputs {...defaultProps} />);
    const dearInput = screen.getByLabelText(/dear/i);
    
    fireEvent.change(dearInput, { target: { value: 'Alice' } });
    
    expect(mockOnDearChange).toHaveBeenCalledWith('Alice');
  });

  it('calls onMessageChange when message field is updated', () => {
    render(<TextInputs {...defaultProps} />);
    const messageInput = screen.getByLabelText(/message/i);
    
    fireEvent.change(messageInput, { target: { value: 'Merry Christmas!' } });
    
    expect(mockOnMessageChange).toHaveBeenCalledWith('Merry Christmas!');
  });

  it('calls onFromChange when from field is updated', () => {
    render(<TextInputs {...defaultProps} />);
    const fromInput = screen.getByLabelText(/from/i);
    
    fireEvent.change(fromInput, { target: { value: 'Bob' } });
    
    expect(mockOnFromChange).toHaveBeenCalledWith('Bob');
  });
}); 