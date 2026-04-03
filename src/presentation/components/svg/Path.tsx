import type { SVGProps } from "react";

import { getStrokeVariant } from "../../styles/stroke.variants";
import type { Role } from "../../../core/pattern/drafting/types";

interface PathProps extends SVGProps<SVGPathElement> {
  role: Role;
}

export const Path = (props: PathProps) => {
  const { role, ...rest } = props;
  const variant = getStrokeVariant(role);
  return <path {...variant} {...rest} />;
};
