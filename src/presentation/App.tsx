import { useRef } from "react";

import { draftSloper } from "../application/draft-sloper";
import { MOCK_MEASUREMENTS as m } from "../slopers/bodice/bodice.constants";
import { DraftCubicBezier } from "../render/DraftCanvas";
import { SvgLine } from "../render/SvgLine";
import { DraftCanvas } from "./components/DraftCanvas";
import { exportPdf } from "../application/export/export-pdf";

function App() {
  // THIS PAGE IS BEING USED FOR _TESTING_, not the final product!
  const result = draftSloper("bodice", m);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!result.ok) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Draft failed</h2>
        <p>
          <strong>{result.error.code}</strong>: {result.error.message}
        </p>
      </div>
    );
  }

  const handleExport = () => {
    const svg = svgRef.current;
    if (!svg) return;

    exportPdf(svg, result.data.bounds);
  };

  return (
    <main className="">
      <div>
        <button
          onClick={handleExport}
          className="absolute bottom-0 left-0 mb-2 ml-2 inline-flex items-center rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400"
        >
          <svg
            className="mr-2 h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          <span>Download</span>
        </button>
        <DraftCanvas bounds={result.data.bounds} ref={svgRef}>
          {result.data.entities.map(
            ({ id, kind, geometry, exportable, role }) => {
              switch (kind) {
                case "line":
                  return (
                    <SvgLine
                      key={id}
                      stroke={
                        exportable
                          ? ["main_outer", "main_inner"].includes(role)
                            ? "#000"
                            : `#D8D8D8`
                          : "transparent"
                      }
                      strokeDasharray={role === "guide" ? 0.3 : 0}
                      geometry={geometry}
                    />
                  );
                case "curve":
                  return <DraftCubicBezier key={id} {...geometry} />;
              }
            },
          )}
        </DraftCanvas>
      </div>
    </main>
  );
}

export default App;
