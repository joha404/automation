// Optimized variants with smooth timing
export const sidebarVariants = {
  open: {
    width: "260px",
    transition: {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.4,
    },
  },
  closed: {
    width: "70px",
    transition: {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.4,
    },
  },
};

// Container for staggered animation - only when opening
export const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  collapsed: {
    // No animation when collapsed - items stay visible
  },
};

// Individual menu item animation with proper states
export const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -15,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
      duration: 0.1,
    },
  },
  collapsed: {
    opacity: 1, // Always visible when collapsed
    x: 0, // No offset when collapsed
    transition: {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.2,
    },
  },
};

// Text-only animation for when sidebar opens
export const textVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.5,
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.15,
    },
  },
};

// Icon variants (always visible)
export const iconVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
      duration: 0.3,
    },
  },
  closed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "tween",
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.2,
    },
  },
};