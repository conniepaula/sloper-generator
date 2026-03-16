import type { ReactElement, ReactNode } from "react";

interface ConditionalWrapProps {
  condition: boolean;
  wrap: (children: ReactNode) => ReactElement;
  children: ReactNode;
}
export const ConditionalWrap = (props: ConditionalWrapProps) => {
  const { condition, wrap, children } = props;
  return condition ? wrap(children) : children;
};
