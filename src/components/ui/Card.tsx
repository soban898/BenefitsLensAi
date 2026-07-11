import { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export function Card({ children, className = '', hover = false, delay = 0 }: CardProps) {
  return (
    <motion.div
      custom={delay}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`rounded-2xl bg-white border border-slate-100 card-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
}

export function CardHeader({ icon, title, subtitle, accent = 'from-primary-500 to-teal-500' }: CardHeaderProps) {
  return (
    <div className="flex items-start gap-4 p-6 pb-4">
      {icon && (
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
