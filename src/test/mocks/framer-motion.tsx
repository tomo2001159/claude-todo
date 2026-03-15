import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react';

// framer-motion 固有のプロパティを除去して通常のHTML要素としてレンダリングする
type MotionExtra = {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  whileTap?: unknown;
  whileHover?: unknown;
  layout?: unknown;
  children?: ReactNode;
};

type MotionDivProps = HTMLAttributes<HTMLDivElement> & MotionExtra;
type MotionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & MotionExtra;
type MotionSpanProps = HTMLAttributes<HTMLSpanElement> & MotionExtra;

function omitMotionProps<T extends MotionExtra>(props: T): Omit<T, keyof MotionExtra> {
  const { initial: _i, animate: _a, exit: _e, transition: _t, whileTap: _wt, whileHover: _wh, layout: _l, children: _c, ...rest } = props;
  return rest as Omit<T, keyof MotionExtra>;
}

export const motion = {
  div: ({ children, ...props }: MotionDivProps) => (
    <div {...omitMotionProps(props)}>{children}</div>
  ),
  button: ({ children, ...props }: MotionButtonProps) => (
    <button {...omitMotionProps(props)}>{children}</button>
  ),
  span: ({ children, ...props }: MotionSpanProps) => (
    <span {...omitMotionProps(props)}>{children}</span>
  ),
};

export const AnimatePresence = ({ children }: { children?: ReactNode }) => <>{children}</>;
