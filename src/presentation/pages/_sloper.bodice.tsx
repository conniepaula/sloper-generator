import { SquareArrowRightExit } from "lucide-react";
import { useRef, useState } from "react";

import { draftSloper } from "../../application/draft-sloper";
import type { SloperType } from "../../core/slopers/registry";
import { DEFAULT_MEASUREMENTS as m } from "../../slopers/bodice/measurements/defaults";
import type { BodiceMeasurements } from "../../slopers/bodice/measurements/schema";
import { MeasurementForm } from "../components/MeasurementForm";
import { Curve } from "../components/svg/Curve";
import { Line } from "../components/svg/Line";
import { Button } from "../components/ui/Button";
import { Canvas } from "../components/svg/Canvas";
import { Card } from "../components/ui/Card";
import { MetaWrapper } from "../components/layout/MetaWrapper";
import { ExportOptionsDialog } from "../components/ExportOptionsDialog";
import { Toast } from "@base-ui/react/toast";
import { makeToast } from "../utils/make-toast-factory";
import type { ToastData } from "../components/ui/Toast";
import { Annotation } from "../components/svg/Annotation";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toastManager = Toast.useToastManager<ToastData>();

  const { result } = draftState;

  const sloper: SloperType = "bodice";
  const svgRef = useRef<SVGSVGElement>(null);

  const onFormSubmit = (data: BodiceMeasurements) => {
    const result = draftSloper(sloper, data);
    setDraftState({ measurements: data, result });
    const toast = result.ok
      ? makeToast({ ok: true, code: "DRAFT_SUCCESSFUL" })
      : makeToast({ ok: false, code: result.error.code });
    toastManager.add<ToastData>(toast);
  };

  const handleExportClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseExportDialog = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <MetaWrapper
      title="Bodice – Sloper Generator"
      description="Enter your measurements to generate a custom bodice block for all your pattern-making needs."
    >
      <main className="flex flex-col items-center justify-center">
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
          <Card.Content className="flex flex-col gap-2 px-2 md:overflow-y-hidden">
            <MeasurementForm onSubmit={onFormSubmit} sloperType={sloper} />
            <Button
              className="mx-2 flex-1 md:hidden"
              intent="neutral"
              icon={SquareArrowRightExit}
              disabled={!result.ok}
              onClick={handleExportClick}
            >
              Export
            </Button>
          </Card.Content>
        </Card>
        {result.ok && (
          <div className="">
            <Button
              icon={SquareArrowRightExit}
              intent="neutral"
              className="absolute bottom-2 left-2 hidden md:block"
              disabled={!result.ok}
              onClick={handleExportClick}
            >
              Export
            </Button>
            <div className="z-10 hidden md:block">
              <Canvas bounds={result.data.bounds} ref={svgRef}>
                {result.data.entities.map(({ id, kind, geometry, role }) => {
                  switch (kind) {
                    case "line":
                      return (
                        <Line key={id} id={id} role={role} {...geometry} />
                      );
                    case "curve":
                      return (
                        <Curve key={id} id={id} role={role} {...geometry} />
                      );
                  }
                })}
                {result.data.annotations.map((annotation) => (
                  <Annotation key={annotation.id} annotation={annotation} />
                ))}
              </Canvas>
            </div>
          </div>
        )}
        {result.ok && (
          <ExportOptionsDialog
            open={isDialogOpen}
            onOpenChange={handleCloseExportDialog}
            bounds={result.data.bounds}
            svgRef={svgRef}
          />
        )}
      </main>
    </MetaWrapper>
  );
};

export default BodicePage;
