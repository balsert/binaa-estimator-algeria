import { useEffect } from 'react';
import { useCapacitor } from '@/hooks/useCapacitor';

interface MobileOptimizedProps {
  children: React.ReactNode;
}

const MobileOptimized = ({ children }: MobileOptimizedProps) => {
  const { isNative, keyboardHeight } = useCapacitor();

  useEffect(() => {
    if (isNative) {
      // Prevent zoom on input focus
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }

      // Add native app class for styling
      document.body.classList.add('native-app');
    }
  }, [isNative]);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined 
      }}
    >
      {children}
    </div>
  );
};

export default MobileOptimized;