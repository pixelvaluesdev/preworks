import { useCallback, useEffect, useRef } from 'react';

const usePressGuard = <Args extends unknown[]>(
  action: (...args: Args) => unknown,
  cooldownMs = 400,
) => {
  const actionRef = useRef(action);
  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  actionRef.current = action;

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return useCallback(
    (...args: Args) => {
      if (lockedRef.current) return;
      lockedRef.current = true;

      const release = () => {
        lockedRef.current = false;
        timerRef.current = null;
      };

      try {
        const result = actionRef.current(...args);
        if (
          result &&
          typeof (result as { then?: unknown }).then === 'function'
        ) {
          Promise.resolve(result).then(release, release);
        } else {
          timerRef.current = setTimeout(release, cooldownMs);
        }
      } catch (error) {
        release();
        throw error;
      }
    },
    [cooldownMs],
  );
};

export default usePressGuard;