import type { ReactNode } from "react";

interface MetaProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const MetaWrapper = (props: MetaProps) => {
  const { children, title, description } = props;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      {children}
    </>
  );
};
