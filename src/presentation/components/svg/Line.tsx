import type { Point } from "../../../geometry/types";
import type { SVGProps } from "react";
import { stroke, type StrokeVariants } from "../../styles/stroke.variants";

interface LineProps
  extends
    Omit<SVGProps<SVGLineElement>, "x1" | "x2" | "y1" | "y2" | "from" | "to">,
    StrokeVariants {
  to: Point;
  from: Point;
}

export const Line = (props: LineProps) => {
  const { from, to, intent, className, ...rest } = props;
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      className={stroke({ intent }, className)}
      {...rest}
    />
  );
};
