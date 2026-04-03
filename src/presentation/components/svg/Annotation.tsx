import type { Annotation as AnnotationType } from "../../../core/pattern/drafting/annotations/types";
import { Path } from "./Path";

interface AnnotationProps {
  annotation: AnnotationType;
}

export const Annotation = (props: AnnotationProps) => {
  const { id, type, shape } = props.annotation;

  switch (type) {
    case "cut_on_fold": {
      const {
        width,
        height,
        startPoint: { x, y },
      } = shape;
      return (
        <Path
          id={id}
          d={`M ${x} ${y} H ${x + width} V ${y + height} H ${x}`}
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
          role="annotation"
        />
      );
    }
  }
};
