import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GiftCardMaker } from '../GiftCardMaker';

// Mock child components
vi.mock('../ImageUploader', () => ({
  ImageUploader: vi.fn(({ onImageUpload }) => (
    <div data-testid="mock-image-uploader">
      <button onClick={() => onImageUpload('mock-image.png')}>Upload Image</button>
    </div>
  ))
}));

vi.mock('../TextInputs', () => ({
  TextInputs: vi.fn(({ onDearChange, onMessageChange, onFromChange }) => (
    <div data-testid="mock-text-inputs">
      <button onClick={() => {
        onDearChange('Test');
        onMessageChange('Test Message');
        onFromChange('Tester');
      }}>
        Update Text
      </button>
    </div>
  ))
}));

vi.mock('../GiftCardPreview', () => ({
  GiftCardPreview: vi.fn(({ backgroundImage, dearText, messageText, fromText }) => (
    <div data-testid="mock-preview">
      <div>Background: {backgroundImage}</div>
      <div>Dear: {dearText}</div>
      <div>Message: {messageText}</div>
      <div>From: {fromText}</div>
    </div>
  ))
}));

vi.mock('../DownloadButton', () => ({
  DownloadButton: vi.fn(() => (
    <button data-testid="mock-download">
      Download
    </button>
  ))
}));

describe('GiftCardMaker', () => {
  it('renders all components correctly', () => {
    render(<GiftCardMaker />);
    
    expect(screen.getByTestId('mock-image-uploader')).toBeInTheDocument();
    expect(screen.getByTestId('mock-text-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('mock-preview')).toBeInTheDocument();
    expect(screen.getByTestId('mock-download')).toBeInTheDocument();
  });

  it('updates state when image is selected', () => {
    render(<GiftCardMaker />);
    
    const uploadButton = screen.getByText('Upload Image');
    fireEvent.click(uploadButton);
    
    expect(screen.getByText('Background: mock-image.png')).toBeInTheDocument();
  });

  it('updates state when text is changed', () => {
    render(<GiftCardMaker />);
    
    const updateButton = screen.getByText('Update Text');
    fireEvent.click(updateButton);
    
    expect(screen.getByText('Dear: Test')).toBeInTheDocument();
    expect(screen.getByText('Message: Test Message')).toBeInTheDocument();
    expect(screen.getByText('From: Tester')).toBeInTheDocument();
  });

  it('renders with default background template', () => {
    render(<GiftCardMaker />);
    
    expect(screen.getByText(/Background: https:\/\/images\.pexels\.com/)).toBeInTheDocument();
  });
}); 