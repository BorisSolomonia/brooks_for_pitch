import { useEffect, useState } from "react";

/**
 * requestAnimationFrame-based number counter.
 * Counts from `start` to `end` over `duration` ms when `active` is true.
 */
export function useCountUp(
  end: number,
  duration = 1200,
  active = true,
  start = 0
): number {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!active) {
      setValue(start);
      return;
    }

    let raf: number;
    let startTime: number | null = null;
    const range = end - start;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(start + range * eased));

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, active, start]);

  return value;
}
