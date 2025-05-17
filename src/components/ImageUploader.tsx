import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (dataUrl: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onImageUpload(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-gray-700">Upload Background</h2>
      
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8 
          flex flex-col items-center justify-center gap-4 
          transition-all duration-300 ease-in-out cursor-pointer
          ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-300 hover:bg-amber-50/50'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className={`h-10 w-10 ${isDragging ? 'text-amber-500' : 'text-gray-400'}`} />
        
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, or GIF (max. 5MB)
          </p>
        </div>
        
        <input 
          type="file" 
          id="file-input" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
};