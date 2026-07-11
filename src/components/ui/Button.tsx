import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, type MotionProps } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  animated?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-teal-500 text-white shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30',
  secondary:
    'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200',
  ghost: 'text-primary-700 hover:bg-primary-50',
  outline:
    'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', animated = true, className = '', children, ...props }, ref) => {
    const motionProps: MotionProps = animated
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { type: 'spring', stiffness: 400, damping: 17 },
        }
      : {};

    return (
      <motion.button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...motionProps}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
