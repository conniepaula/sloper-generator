import type { SVGProps } from "react";
import type { Line } from "../geometry/geometry.types";

interface SvgLineProps extends SVGProps<SVGElement> {
  geometry: Line;
}

export function SvgLine(props: SvgLineProps) {
  const { geometry, ...rest } = props;
  return (
    <line
      x1={geometry.from.x}
      y1={geometry.from.y}
      x2={geometry.to.x}
      y2={geometry.to.y}
      stroke="black"
      strokeWidth="0.1"
      {...rest}
    />
  );
}
