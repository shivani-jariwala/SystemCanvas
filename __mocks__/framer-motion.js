/**
 * Jest mock for framer-motion.
 *
 * Replaces motion components with plain DOM elements and
 * AnimatePresence with a pass-through so tests render
 * without the animation runtime.
 */
const React = require('react');

const motion = new Proxy(
  {},
  {
    get: (_target, prop) => {
      return React.forwardRef((props, ref) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
        return React.createElement(prop, { ...rest, ref });
      });
    },
  },
);

module.exports = {
  motion,
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({}),
  useMotionValue: (val) => ({ get: () => val, set: () => {} }),
};
