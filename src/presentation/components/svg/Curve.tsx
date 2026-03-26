import type { SVGProps } from "react";
import type { Point } from "../../../geometry/types";
import { stroke, type StrokeVariants } from "../../styles/stroke.variants";

interface CurveProps
  extends Omit<SVGProps<SVGPathElement>, "d" | "end">, StrokeVariants {
  start: Point;
  end: Point;
  control1: Point;
  control2: Point;
}

export const Curve = (props: CurveProps) => {
  const { start, control1, control2, end, intent, className, ...rest } = props;
  return (
    <path
      d={`
    M ${start.x} ${start.y}
    C ${control1.x} ${control1.y},
      ${control2.x} ${control2.y},
      ${end.x} ${end.y}
  `}
      className={stroke({ intent }, className)}
      {...rest}
    />
  );
};
