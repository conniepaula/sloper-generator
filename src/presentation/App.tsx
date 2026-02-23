import { draftSloper } from "../application/draftSloper";
import { MOCK_MEASUREMENTS as m } from "../domains/bodice/bodice.constants";
import { DraftCanvas, DraftCubicBezier } from "../render/DraftCanvas";
import { SvgLine } from "../render/SvgLine";

function App() {
  // THIS PAGE IS BEING USED FOR _TESTING_, not the final product!
  const result = draftSloper("bodice", m);

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

  return (
    <main className="">
      <div>
        <DraftCanvas>
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
                            ? "black"
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
