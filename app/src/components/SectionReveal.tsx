import type { ReactNode, ReactElement } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface SectionRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  staggerDelay?: number;
  className?: string;
  threshold?: number;
}

export function SectionReveal({
  children,
  direction = 'up',
  staggerDelay = 80,
  className = '',
  threshold = 0.1,
}: SectionRevealProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold });

  const translateMap = {
    up: 'translateY(40px)',
    down: 'translateY(-40px)',
    left: 'translateX(40px)',
    right: 'translateX(-40px)',
  };

  const childArray = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        const delay = index * staggerDelay;
        const element = child as ReactElement<{ style?: Record<string, string>; className?: string }>;

        return cloneElement(element, {
          ...element.props,
          style: {
            ...element.props.style,
            opacity: isVisible ? '1' : '0',
            transform: isVisible ? 'translateY(0) translateX(0)' : translateMap[direction],
            transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          },
        });
      })}
    </div>
  );
}
