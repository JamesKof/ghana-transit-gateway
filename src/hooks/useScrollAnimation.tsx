import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

// Component wrapper for scroll animations
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "blur";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out, filter ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    const hiddenStyles: Record<string, React.CSSProperties> = {
      "fade-up": { opacity: 0, transform: "translateY(30px)" },
      "fade-down": { opacity: 0, transform: "translateY(-30px)" },
      "fade-left": { opacity: 0, transform: "translateX(-30px)" },
      "fade-right": { opacity: 0, transform: "translateX(30px)" },
      scale: { opacity: 0, transform: "scale(0.95)" },
      blur: { opacity: 0, filter: "blur(10px)" },
    };

    const visibleStyles: React.CSSProperties = {
      opacity: 1,
      transform: "translate(0) scale(1)",
      filter: "blur(0)",
    };

    return {
      ...baseStyles,
      ...(isVisible ? visibleStyles : hiddenStyles[animation]),
    };
  };

  return (
    <div ref={ref} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  );
}

// Stagger animation for lists
interface StaggerRevealProps {
  children: React.ReactNode[];
  className?: string;
  childClassName?: string;
  staggerDelay?: number;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale";
  threshold?: number;
}

export function StaggerReveal({
  children,
  className = "",
  childClassName = "",
  staggerDelay = 100,
  animation = "fade-up",
  threshold = 0.1,
}: StaggerRevealProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold });

  const getChildStyles = (index: number): React.CSSProperties => {
    const baseStyles = {
      transition: `opacity 500ms ease-out, transform 500ms ease-out`,
      transitionDelay: `${index * staggerDelay}ms`,
    };

    const hiddenStyles: Record<string, React.CSSProperties> = {
      "fade-up": { opacity: 0, transform: "translateY(20px)" },
      "fade-down": { opacity: 0, transform: "translateY(-20px)" },
      "fade-left": { opacity: 0, transform: "translateX(-20px)" },
      "fade-right": { opacity: 0, transform: "translateX(20px)" },
      scale: { opacity: 0, transform: "scale(0.9)" },
    };

    const visibleStyles: React.CSSProperties = {
      opacity: 1,
      transform: "translate(0) scale(1)",
    };

    return {
      ...baseStyles,
      ...(isVisible ? visibleStyles : hiddenStyles[animation]),
    };
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div key={index} className={childClassName} style={getChildStyles(index)}>
          {child}
        </div>
      ))}
    </div>
  );
}
