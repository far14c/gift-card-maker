import React, { useState } from 'react';
import { GiftCardPreview } from './GiftCardPreview';
import { ImageUploader } from './ImageUploader';
import { TextInputs } from './TextInputs';
import { DownloadButton } from './DownloadButton';

export const GiftCardMaker: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [dearText, setDearText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [fromText, setFromText] = useState('');

  // Default background template
  const defaultTemplate = 'https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg';

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-6 sm:p-8 border-b border-amber-100">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">Gift Card Maker</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <GiftCardPreview 
            backgroundImage={backgroundImage || defaultTemplate}
            dearText={dearText}
            messageText={messageText}
            fromText={fromText}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ImageUploader 
            onImageUpload={setBackgroundImage} 
          />
          
          <TextInputs 
            dearText={dearText}
            messageText={messageText}
            fromText={fromText}
            onDearChange={setDearText}
            onMessageChange={setMessageText}
            onFromChange={setFromText}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8 border-t border-amber-100 flex justify-center">
        <DownloadButton 
          previewId="gift-card-preview"
          filename="my-gift-card.png"
        />
      </div>
    </div>
  );
};