import { MOCK_MEASUREMENTS as m } from "../domains/bodice/bodice.constants";
import { draftBodice } from "../domains/bodice/bodice.draft";

import { bodiceContextToDraftDocument } from "../domains/bodice/bodice.toDraftDocument";
import { DraftCanvas, DraftCubicBezier } from "../render/DraftCanvas";
import { SvgLine } from "../render/SvgLine";

function App() {
  // THIS PAGE IS BEING USED FOR _TESTING_, not the final product!
  // const yOffset = m.frontWaistHeight - m.backWaistHeight;
  const ctx = draftBodice(m);
  const { entities } = bodiceContextToDraftDocument(ctx);
  console.log(entities);
  return (
    <main className="">
      <div>
        <DraftCanvas>
          {entities.map(({ id, kind, geometry, exportable, role }) => {
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
          })}
        </DraftCanvas>
      </div>
    </main>
  );
}

export default App;
