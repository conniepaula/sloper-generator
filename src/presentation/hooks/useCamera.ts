import { useEffect, useRef, useState } from "react";
import { clamp } from "../../core/math";

export type Pan = {
  x: number;
  y: number;
};

type UseCameraProps = {
  initialPan: Pan;
};

export function useCamera(props: UseCameraProps) {
  const { initialPan } = props;
  // camera state
  const [pan, setPan] = useState<Pan>(() => ({
    x: initialPan.x,
    y: initialPan.y,
  }));
  const [zoom, setZoom] = useState(1);
  const hasInitialized = useRef(false);
  // interaction state
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  // TODO: Fix firefox pixelation on zoom
  // TODO: Add zoom on pinch for mobile
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const SENSITIVITY = 0.002;

    const factor = Math.exp(-e.deltaY * SENSITIVITY);
    const newZoom = clamp(zoom * factor, 0.2, 50);
    // zooming to cursor
    const rect = e.currentTarget.getBoundingClientRect();
    const cursorScreen = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const x = cursorScreen.x - ((cursorScreen.x - pan.x) / zoom) * newZoom;
    const y = cursorScreen.y - ((cursorScreen.y - pan.y) / zoom) * newZoom;

    setPan({ x, y });
    setZoom(newZoom);
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    if (!initialPan.x || !initialPan.y) return;

    setPan({ x: initialPan.x, y: initialPan.y });
    hasInitialized.current = true;
  }, [initialPan]);

  useEffect(() => {
    if (!isDragging) return;
    // attach window listeners
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;

      setPan((prevPan) => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const transform = `scale(${zoom}) translate(${pan.x / zoom} ${pan.y / zoom})`;

  return { transform, handlers: { onMouseDown, onWheel } };
}
