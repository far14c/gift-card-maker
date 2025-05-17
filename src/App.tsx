import React from 'react';
import { GiftCardMaker } from './components/GiftCardMaker';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <GiftCardMaker />
    </div>
  );
}

export default App;