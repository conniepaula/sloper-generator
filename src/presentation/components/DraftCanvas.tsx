import { useLayoutEffect, useRef, useState } from "react";
import type { BoundingBox } from "../../geometry/geometry.types";
import { useCamera } from "../hooks/useCamera";
import { getBoundingBoxCenter } from "../../geometry/geometry.helpers";

type DraftCanvasProps = {
  children: React.ReactNode;
  bounds: BoundingBox;
};

export const DraftCanvas: React.FC<DraftCanvasProps> = ({
  children,
  bounds,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  const { transform, handlers } = useCamera({ initialPan: center });

  useLayoutEffect(() => {
    if (!svgRef.current) return;
    const { width, height } = svgRef.current.getBoundingClientRect();
    const patternCenter = getBoundingBoxCenter(bounds);
    setCenter({
      x: width / 2 - patternCenter.x,
      y: height / 2 - patternCenter.y,
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className="h-screen w-screen"
      onMouseDown={handlers.onMouseDown}
      onWheel={handlers.onWheel}
      // viewBox="-5 -5 30 90"
    >
      <g transform={transform}>{children}</g>
    </svg>
  );
};
