import React from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  previewId: string;
  filename: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ previewId, filename }) => {
  const handleDownload = async () => {
    const element = document.getElementById(previewId);
    if (!element) return;

    try {
      // Wait for fonts to be loaded
      await document.fonts.ready;
      
      // Force a layout recalculation
      element.style.opacity = '0.99';
      await new Promise(resolve => setTimeout(resolve, 0));
      element.style.opacity = '1';

      const dataUrl = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        fontEmbedCSS: document.querySelector('style')?.textContent || '',
        skipFonts: false
      });
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow-sm transition-all duration-300 transform hover:scale-105"
    >
      <Download className="h-5 w-5" />
      Download Gift Card
    </button>
  );
};