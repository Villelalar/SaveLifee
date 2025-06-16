// Animation utilities for SaveLife app
import { keyframes } from '@mui/system';

// Define reusable keyframes
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Animation presets with durations and easings
export const animations = {
  fadeIn: {
    animation: `${fadeIn} 0.6s ease-out forwards`,
  },
  slideUp: {
    animation: `${slideUp} 0.6s ease-out forwards`,
  },
  slideInRight: {
    animation: `${slideInRight} 0.6s ease-out forwards`,
  },
  pulse: {
    animation: `${pulse} 2s ease-in-out infinite`,
  },
  shimmer: {
    animation: `${shimmer} 2.5s infinite linear`,
    backgroundSize: '200% 100%',
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)',
  },
  // Staggered animations for lists
  staggered: (index) => ({
    animation: `${fadeIn} 0.5s ease-out forwards`,
    animationDelay: `${0.1 * index}s`,
  }),
};

// Helper function to apply animations with delay
export const withDelay = (animation, delayInSeconds) => ({
  ...animation,
  animationDelay: `${delayInSeconds}s`,
});

export default animations;
