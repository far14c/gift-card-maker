import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DownloadButton } from '../DownloadButton';
import * as htmlToImage from 'html-to-image';

describe('DownloadButton', () => {
  const defaultProps = {
    previewId: 'test-preview',
    filename: 'gift-card.png'
  };

  beforeEach(() => {
    // Mock document.getElementById
    document.body.innerHTML = `<div id="${defaultProps.previewId}"></div>`;
    
    // Mock document.fonts
    if (!document.fonts) {
      Object.defineProperty(document, 'fonts', {
        value: { ready: Promise.resolve() }
      });
    }

    // Mock html-to-image
    vi.mock('html-to-image', () => ({
      toPng: vi.fn().mockResolvedValue('data:image/png;base64,fake-image-data')
    }));
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders download button correctly', () => {
    render(<DownloadButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: /download gift card/i })).toBeInTheDocument();
  });

  it('triggers download when clicked', async () => {
    const user = userEvent.setup();
    
    // Mock anchor creation and download
    const mockAnchor = document.createElement('a');
    const mockClick = vi.fn();
    Object.defineProperties(mockAnchor, {
      click: { value: mockClick, configurable: true },
      download: { value: '', writable: true },
      href: { value: '', writable: true }
    });

    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement');
    createElementSpy.mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor;
      return originalCreateElement(tag);
    });

    render(<DownloadButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /download gift card/i });
    
    await user.click(button);
    
    await vi.waitFor(() => {
      expect(mockAnchor.download).toBe(defaultProps.filename);
      expect(mockClick).toHaveBeenCalled();
    });
  });

  it('shows error alert when download fails', async () => {
    const user = userEvent.setup();
    
    // Mock html-to-image to throw error
    vi.mocked(htmlToImage.toPng).mockRejectedValueOnce(new Error('Failed to generate'));
    
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<DownloadButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /download gift card/i });
    
    await user.click(button);
    
    await vi.waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Failed to generate image. Please try again.');
      expect(consoleMock).toHaveBeenCalled();
    });
  });
}); 