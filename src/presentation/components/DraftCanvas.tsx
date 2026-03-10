import { useLayoutEffect, useRef, useState } from "react";

import type { BoundingBox } from "../../geometry/types";

import { useCamera, type Pan } from "../hooks/useCamera";
import { getBoundingBoxMetrics } from "../../geometry/helpers";

type DraftCanvasProps = {
  children: React.ReactNode;
  bounds: BoundingBox;
};

export const DraftCanvas: React.FC<DraftCanvasProps> = ({
  children,
  bounds,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [center, setCenter] = useState<Pan | null>(null);
  const [isSeeded, setIsSeeded] = useState(false);

  const { transform, handlers } = useCamera({
    initialPan: center ?? { x: 0, y: 0 },
    initialZoom: zoom ?? 1,
    isSeeded,
  });

  useLayoutEffect(() => {
    if (!svgRef.current) return;
    const { width, height } = svgRef.current.getBoundingClientRect();
    const patternBbox = getBoundingBoxMetrics(bounds);
    const zoomX = width / patternBbox.width;
    const zoomY = height / patternBbox.height;
    const zoomFit = Math.min(zoomX, zoomY) * 0.9;
    setCenter({
      x: width / 2 - patternBbox.center.x * zoomFit,
      y: height / 2 - patternBbox.center.y * zoomFit,
    });
    setZoom(zoomFit);
    setIsSeeded(true);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="h-screen w-screen bg-amber-200"
      onMouseDown={handlers.onMouseDown}
      onWheel={handlers.onWheel}
      shapeRendering="geometricPrecision"
      // viewBox="-5 -5 30 90"
    >
      <g transform={transform}>{children}</g>
    </svg>
  );
};
