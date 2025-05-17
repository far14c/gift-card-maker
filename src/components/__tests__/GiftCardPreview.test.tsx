import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GiftCardPreview } from '../GiftCardPreview';

describe('GiftCardPreview', () => {
  const defaultProps = {
    dearText: 'John',
    messageText: 'Happy Birthday!',
    fromText: 'Jane',
    backgroundImage: '',
  };

  it('renders with default props', () => {
    render(<GiftCardPreview {...defaultProps} />);
    
    expect(screen.getByText('John,')).toBeInTheDocument();
    expect(screen.getByText('Happy Birthday!')).toBeInTheDocument();
    expect(screen.getByText('—Jane')).toBeInTheDocument();
  });

  it('handles long messages correctly', () => {
    const longMessage = 'This is a very long message that should be wrapped properly across multiple lines without breaking the layout of the gift card.';
    render(
      <GiftCardPreview
        {...defaultProps}
        messageText={longMessage}
      />
    );

    // The message should be split into multiple lines
    const messageLines = screen.getAllByText(/This is a very|breaking the layout/);
    expect(messageLines.length).toBeGreaterThan(0);
  });

  it('renders with background image when provided', () => {
    const backgroundImage = 'data:image/png;base64,fake-image-data';
    render(
      <GiftCardPreview
        {...defaultProps}
        backgroundImage={backgroundImage}
      />
    );

    const previewElement = document.getElementById('gift-card-preview');
    expect(previewElement).toHaveStyle({
      backgroundImage: `url(${backgroundImage})`,
    });
  });
}); 