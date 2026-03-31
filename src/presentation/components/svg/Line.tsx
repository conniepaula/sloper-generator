import type { SVGProps } from "react";

import type { Point } from "../../../geometry/types";
import { getStrokeVariant } from "../../styles/stroke.variants";
import type { Role } from "../../../core/pattern/drafting/types";

interface LineProps extends Omit<
  SVGProps<SVGLineElement>,
  "x1" | "x2" | "y1" | "y2" | "from" | "to" | "strokeWidth"
> {
  to: Point;
  from: Point;
  role: Role;
}

export const Line = (props: LineProps) => {
  const { from, to, role, ...rest } = props;
  const variant = getStrokeVariant(role);
  return (
    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} {...variant} {...rest} />
  );
};
