import type { CubicBezier, Line, Point } from "../geometry/geometry.types";

type DraftCanvasProps = {
  // points: BodicePoints;
  children: React.ReactNode;
};

// export const DraftCanvas: React.FC<DraftCanvasProps> = ({ points, children }) => {
//   return (
//     <svg width={900} height={900}
//     viewBox="-5 -5 30 50">
//       {Object.entries(points).map(([name, p]) => (
//         <g key={name}>
//           <circle cx={p.x} cy={p.y} r={0.2} fill="red" />
//           <text x={p.x + 1} y={p.y + 1} fontSize={1}>
//             {name}
//           </text>
//         </g>
//       ))}
//     </svg>
//   );
// };

export const DraftCanvas: React.FC<DraftCanvasProps> = ({ children }) => {
  return (
    <svg width={900} height={900} viewBox="-5 -5 30 90">
      {children}
    </svg>
  );
};

export const DraftPoint: React.FC<{ name: string; x: number; y: number }> = ({
  name,
  x,
  y,
}) => {
  return (
    <g key={name}>
      <circle cx={x} cy={y} r={0.2} fill="red" />
      <text x={x + 1} y={y + 1} fontSize={0.5}>
        {name}
      </text>
    </g>
  );
};

interface DraftLineProps {
  to: Point;
  from: Point;
  strokeColor?: string;
}

export const DraftLine: React.FC<DraftLineProps> = ({
  from,
  to,
  strokeColor = "black",
}) => {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={strokeColor}
      strokeWidth="0.1"
    />
  );
};

export const DraftCubicBezier: React.FC<CubicBezier> = ({
  start,
  control1,
  control2,
  end,
}) => {
  return (
    <path
      d={`
    M ${start.x} ${start.y}
    C ${control1.x} ${control1.y},
      ${control2.x} ${control2.y},
      ${end.x} ${end.y}
  `}
      fill="none"
      stroke="black"
      strokeWidth="0.1"
    />
  );
};

type DraftManyCubicBezierProps = {
  curves: CubicBezier[];
};

export const DraftManyCubicBezier: React.FC<DraftManyCubicBezierProps> = ({
  curves,
}) => {
  const firstCurve = curves[0];

  return (
    <path
      d={`
    M ${firstCurve.start.x} ${firstCurve.start.y}
    ${curves
      .map(
        (curve) => `C ${curve.control1.x} ${curve.control1.y},
      ${curve.control2.x} ${curve.control2.y},
      ${curve.end.x} ${curve.end.y}

      `,
      )
      .join(" ")}
  `}
      fill="none"
      stroke="black"
      strokeWidth="0.1"
    />
  );
};
