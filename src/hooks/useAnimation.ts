import { useEffect } from 'react';
import { useSharedValue, withTiming, withSpring, Easing } from 'react-native-reanimated';

interface Options {
  duration?: number;
  delay?: number;
  from?: number;
}

export const useFadeIn = ({ duration = 400, delay = 0, from = 0 }: Options = {}) => {
  const opacity = useSharedValue(from);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return opacity;
};

export const useSlideUp = ({ delay = 0, from = 30 }: Options = {}) => {
  const translateY = useSharedValue(from);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, {
        damping: 14,
        stiffness: 120,
        mass: 0.8,
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return translateY;
};

export const useInitialAnimation = (delay: number = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return { opacity, translateY };
};

