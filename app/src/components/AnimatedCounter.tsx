import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });
  const [count, setCount] = useState(0);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCount(easedProgress * end);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isVisible, end, duration]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
