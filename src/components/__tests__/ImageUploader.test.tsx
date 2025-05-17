import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { ImageUploader } from '../ImageUploader';

// Mock FileReader type
type MockFileReader = {
  readAsDataURL: ReturnType<typeof vi.fn>;
  result: string;
  onload: ((e: { target: { result: string } }) => void) | null;
};

describe('ImageUploader', () => {
  const mockOnImageUpload = vi.fn();
  const defaultProps = {
    onImageUpload: mockOnImageUpload
  };

  beforeEach(() => {
    mockOnImageUpload.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders upload section correctly', () => {
    render(<ImageUploader {...defaultProps} />);
    expect(screen.getByText('Upload Background')).toBeInTheDocument();
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
  });

  it('handles file upload correctly', async () => {
    const { container } = render(<ImageUploader {...defaultProps} />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
    
    if (input) {
      // Mock FileReader
      const mockFileReader: MockFileReader = {
        readAsDataURL: vi.fn(),
        result: 'data:image/png;base64,ZHVtbXkgY29udGVudA==',
        onload: null
      };
      
      vi.spyOn(window, 'FileReader').mockImplementation(() => {
        const reader = mockFileReader as unknown as FileReader;
        // Simulate readAsDataURL by triggering onload in next tick
        reader.readAsDataURL = () => {
          setTimeout(() => {
            if (mockFileReader.onload) {
              mockFileReader.onload({ target: { result: mockFileReader.result } });
            }
          }, 0);
        };
        return reader;
      });
      
      await act(async () => {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(input, 'files', {
          value: [file]
        });
        input.dispatchEvent(event);
      });
    }
    
    await vi.waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith('data:image/png;base64,ZHVtbXkgY29udGVudA==');
    });
  });

  it('shows error for invalid file type', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { container } = render(<ImageUploader {...defaultProps} />);
    
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
    
    if (input) {
      await act(async () => {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(input, 'files', {
          value: [file]
        });
        input.dispatchEvent(event);
      });
    }
    
    await vi.waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Please select an image file');
      expect(mockOnImageUpload).not.toHaveBeenCalled();
    });
    alertMock.mockRestore();
  });

  it('shows error for large files', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { container } = render(<ImageUploader {...defaultProps} />);
    
    // Create a large file that exceeds 5MB
    const largeContent = new Array(5 * 1024 * 1024 + 1).fill('a').join('');
    const largeFile = new File([largeContent], 'large.png', { type: 'image/png' });
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
    
    if (input) {
      await act(async () => {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(input, 'files', {
          value: [largeFile]
        });
        input.dispatchEvent(event);
      });
    }
    
    await vi.waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('File size must be less than 5MB');
      expect(mockOnImageUpload).not.toHaveBeenCalled();
    });
    alertMock.mockRestore();
  });

  it('handles drag and drop', async () => {
    render(<ImageUploader {...defaultProps} />);
    const dropzone = screen.getByText(/Click to upload or drag and drop/).parentElement?.parentElement;
    expect(dropzone).toBeTruthy();
    
    if (dropzone) {
      await act(async () => {
        // Simulate dragenter
        const dragEnterEvent = new Event('dragenter', { bubbles: true });
        dropzone.dispatchEvent(dragEnterEvent);
      });
      
      // Wait for state update
      await vi.waitFor(() => {
        const text = screen.queryByText('Drop your image here');
        expect(text).toBeInTheDocument();
      });
      
      await act(async () => {
        // Simulate dragleave
        const dragLeaveEvent = new Event('dragleave', { bubbles: true });
        dropzone.dispatchEvent(dragLeaveEvent);
      });
      
      // Wait for state update
      await vi.waitFor(() => {
        const text = screen.queryByText('Click to upload or drag and drop');
        expect(text).toBeInTheDocument();
      });
    }
  });
}); 