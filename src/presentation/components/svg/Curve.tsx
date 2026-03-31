import type { SVGProps } from "react";

import type { Point } from "../../../geometry/types";
import { getStrokeVariant } from "../../styles/stroke.variants";
import type { Role } from "../../../core/pattern/drafting/types";

interface CurveProps extends Omit<SVGProps<SVGPathElement>, "d" | "end"> {
  start: Point;
  end: Point;
  control1: Point;
  control2: Point;
  role: Role;
}

export const Curve = (props: CurveProps) => {
  const { start, control1, control2, end, role, ...rest } = props;
  const variant = getStrokeVariant(role);
  return (
    <path
      d={`
    M ${start.x} ${start.y}
    C ${control1.x} ${control1.y},
      ${control2.x} ${control2.y},
      ${end.x} ${end.y}
  `}
      {...variant}
      {...rest}
    />
  );
};
