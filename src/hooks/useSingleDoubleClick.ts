import { useRef, useCallback } from 'react';

interface UseSingleDoubleClickOptions {
  onSingleClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  delay?: number;
}

export function useSingleDoubleClick({
  onSingleClick,
  onDoubleClick,
  delay = 250
}: UseSingleDoubleClickOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        onDoubleClick(e);
      } else {
        const eventCopy = { ...e };
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          onSingleClick(eventCopy as unknown as React.MouseEvent);
        }, delay);
      }
    },
    [onSingleClick, onDoubleClick, delay]
  );

  return handleClick;
}
