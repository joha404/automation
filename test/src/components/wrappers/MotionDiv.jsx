import { motion } from 'framer-motion';

const MotionDiv = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  once = true,
  amount = 0.2,
  ...props
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      ...(direction === 'up' && { y: 20 }),
      ...(direction === 'down' && { y: -20 }),
      ...(direction === 'left' && { x: 20 }),
      ...(direction === 'right' && { x: -20 }),
      ...(direction === 'zoom-in' && { scale: 0.5 }),
      ...(direction === 'zoom-out' && { scale: 1.25 }),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={variants}
      viewport={{ once, amount }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionDiv;
