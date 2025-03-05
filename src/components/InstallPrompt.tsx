import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      console.log('App installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
  };

  if (!isInstallable && !isIOS) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 border border-indigo-100">
      {isInstallable ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-800">Install Family Directory</h3>
            <button 
              onClick={() => setIsInstallable(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">Install this app on your device for quick and easy access.</p>
          <button
            onClick={handleInstallClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
          >
            <Download size={18} className="mr-2" /> Install App
          </button>
        </div>
      ) : isIOS ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-800">Install on iOS</h3>
            <button 
              onClick={() => setIsIOS(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">To install this app on your iPhone:</p>
          <ol className="text-sm text-gray-600 list-decimal pl-5 mb-2">
            <li>Tap the share button <span className="inline-block w-5 h-5 text-center leading-5 bg-gray-200 rounded">⎙</span></li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" in the top right corner</li>
          </ol>
        </div>
      ) : null}
    </div>
  );
};

export default InstallPrompt;