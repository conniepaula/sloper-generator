import { useLayoutEffect, useState } from "react";

import { useCamera, type Pan } from "../hooks/useCamera";
import type { Bounds } from "../../core/pattern/drafting/types";

type DraftCanvasProps = {
  children: React.ReactNode;
  bounds: Bounds;
  ref: React.RefObject<SVGSVGElement | null>;
};

export const DraftCanvas: React.FC<DraftCanvasProps> = ({
  children,
  bounds,
  ref,
}) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [center, setCenter] = useState<Pan | null>(null);
  const [isSeeded, setIsSeeded] = useState(false);

  const { transform, handlers } = useCamera({
    initialPan: center ?? { x: 0, y: 0 },
    initialZoom: zoom ?? 1,
    isSeeded,
  });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const zoomX = width / bounds.width;
    const zoomY = height / bounds.height;
    const zoomFit = Math.min(zoomX, zoomY) * 0.9;
    setCenter({
      x: width / 2 - bounds.center.x * zoomFit,
      y: height / 2 - bounds.center.y * zoomFit,
    });
    setZoom(zoomFit);
    setIsSeeded(true);
  }, []);

  return (
    <svg
      ref={ref}
      id="svg-canvas"
      className="h-screen w-screen bg-amber-200"
      onMouseDown={handlers.onMouseDown}
      onWheel={handlers.onWheel}
      shapeRendering="geometricPrecision"
    >
      <g transform={transform}>{children}</g>
    </svg>
  );
};
