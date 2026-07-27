import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('pwa-install-installed') === 'true') {
      return;
    }

    // Check if dismissed recently (30 days)
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (new Date().getTime() - new Date(dismissedAt).getTime()) / (1000 * 3600 * 24);
      if (daysSinceDismissed < 30) return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show after 30 seconds
    const timer = setTimeout(() => {
      if (deferredPrompt) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-installed', 'true');
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 bg-[#1A1A1A] border border-white/[0.1] p-4 rounded-2xl shadow-2xl flex items-center gap-4"
        >
          <img src="https://res.cloudinary.com/dvvugpu04/image/upload/v1785159774/Mgiftnana_logo_uvjolg.png" alt="Icon" className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm">Install Mgiftna</h4>
            <p className="text-neutral-400 text-xs">Enjoy a native app experience.</p>
          </div>
          <button onClick={handleInstall} className="bg-amber-500 text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Install
          </button>
          <button onClick={handleDismiss} className="text-neutral-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
