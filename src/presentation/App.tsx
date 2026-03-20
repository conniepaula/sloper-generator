import { Download } from "lucide-react";
import { useRef, useState } from "react";

import { draftSloper } from "../application/draft-sloper";
import { exportPdf } from "../application/export/export-pdf";
import type { SloperType } from "../core/slopers/registry";
import { DraftCubicBezier } from "../render/DraftCanvas";
import { SvgLine } from "../render/SvgLine";
import { DEFAULT_MEASUREMENTS as m } from "../slopers/bodice/measurements/defaults";
import type { BodiceMeasurements } from "../slopers/bodice/measurements/schema";
import { DraftCanvas } from "./components/DraftCanvas";
import { MeasurementForm } from "./components/MeasurementForm";
import { Button } from "./components/ui/Button";

function App() {
  // THIS PAGE IS BEING USED FOR _TESTING_, not the final product!
  const [measurements, setMeasurements] = useState<BodiceMeasurements>(m);
  const sloper: SloperType = "bodice";
  const result = draftSloper(sloper, measurements);
  const svgRef = useRef<SVGSVGElement>(null);

  const onFormSubmit = (data: BodiceMeasurements) => {
    setMeasurements(data);
  };

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
    <main className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4 bg-gray-50 px-6 py-4 sm:my-2 sm:max-w-md sm:rounded-md md:absolute md:top-0 md:right-0 md:mr-2 md:h-96 md:w-96">
        <div>
          <h1 className="text-xl font-bold">Bodice Generator</h1>
          <span className="text-sm text-gray-500 md:hidden">
            For a better experience, access this site on a computer.
          </span>
        </div>
        <MeasurementForm
          title="Bodice Measurements"
          onSubmit={onFormSubmit}
          sloperType={sloper}
        />
        <Button
          onClick={handleExport}
          className="bg-gray-400 md:hidden"
          icon={Download}
          iconProps={{ size: 18 }}
        >
          Download
        </Button>
      </div>
      <div className="">
        <Button
          onClick={handleExport}
          icon={Download}
          className="absolute bottom-2 left-2 hidden bg-gray-400 md:block"
        >
          Download
        </Button>
        <div className="hidden md:block">
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
      </div>
    </main>
  );
}

export default App;
