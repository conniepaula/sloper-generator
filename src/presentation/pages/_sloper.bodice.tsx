import { Download } from "lucide-react";
import { useRef, useState } from "react";
import { Toaster } from "sonner";

import { draftSloper } from "../../application/draft-sloper";
import { exportPdf } from "../../application/export/export-pdf";
import type { SloperType } from "../../core/slopers/registry";
import { DEFAULT_MEASUREMENTS as m } from "../../slopers/bodice/measurements/defaults";
import type { BodiceMeasurements } from "../../slopers/bodice/measurements/schema";
import { MeasurementForm } from "../components/MeasurementForm";
import { Curve } from "../components/svg/Curve";
import { Line } from "../components/svg/Line";
import { Button } from "../components/ui/Button";
import { ERROR_TOAST_DESCRIPTION, ERROR_TOAST_TITLE } from "../constants";
import { toast } from "../utils/toast";
import { Canvas } from "../components/svg/Canvas";
import { Card } from "../components/ui/Card";
import { MetaWrapper } from "../components/layout/MetaWrapper";

interface DraftState {
  measurements: BodiceMeasurements;
  result: ReturnType<typeof draftSloper>;
}

const BodicePage = () => {
  // THIS PAGE IS BEING USED FOR _TESTING_, not the final product!
  const [draftState, setDraftState] = useState<DraftState>(() => ({
    measurements: m,
    result: draftSloper("bodice", m),
  }));

  const { result } = draftState;

  const sloper: SloperType = "bodice";
  const svgRef = useRef<SVGSVGElement>(null);

  const onFormSubmit = (data: BodiceMeasurements) => {
    const result = draftSloper(sloper, data);
    setDraftState({ measurements: data, result });
    if (!result.ok) {
      toast({
        title: ERROR_TOAST_TITLE[result.error.code],
        description: ERROR_TOAST_DESCRIPTION[result.error.code],
      });
    }
  };

  const handleExport = () => {
    if (!result.ok) return;
    const svg = svgRef.current;
    if (!svg) return;

    exportPdf(svg, result.data.bounds, { size: "a4" });
  };

  return (
    <MetaWrapper
      title="Bodice – Sloper Generator"
      description="Enter your measurements to generate a custom bodice block for all your pattern-making needs."
    >
      <main className="flex flex-col items-center justify-center">
        <Toaster position="bottom-right" />
        <Card className="flex flex-col rounded-none sm:my-2 sm:max-w-md sm:rounded-xl md:absolute md:top-0 md:right-0 md:mr-2 md:h-96 md:w-96 md:overflow-hidden">
          <Card.Header>
            <Card.Title className="text-xl font-bold">
              Bodice Generator
            </Card.Title>
            <Card.Description>
              <p>
                Input your measurements to generate a custom bodice block
                pattern for all your sewing needs.
              </p>
              <p className="md:hidden">
                For a better experience, access this site on desktop.
              </p>
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-2 md:overflow-y-hidden">
            <MeasurementForm onSubmit={onFormSubmit} sloperType={sloper} />
            <Button
              onClick={handleExport}
              className="flex-1 md:hidden"
              intent="neutral"
              icon={Download}
              iconProps={{ size: 18 }}
            >
              Download
            </Button>
          </Card.Content>
        </Card>
        {result.ok && (
          <div className="">
            <Button
              onClick={handleExport}
              icon={Download}
              intent="neutral"
              className="absolute bottom-2 left-2 hidden md:block"
            >
              Download
            </Button>
            <div className="z-10 hidden md:block">
              <Canvas bounds={result.data.bounds} ref={svgRef}>
                {result.data.entities.map(({ id, kind, geometry, role }) => {
                  switch (kind) {
                    case "line":
                      return <Line key={id} role={role} {...geometry} />;
                    case "curve":
                      return <Curve key={id} role={role} {...geometry} />;
                  }
                })}
              </Canvas>
            </div>
          </div>
        )}
      </main>
    </MetaWrapper>
  );
};

export default BodicePage;
