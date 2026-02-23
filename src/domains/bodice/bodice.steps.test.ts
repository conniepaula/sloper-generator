import { describe, expect, test } from "vitest";
import { createBodiceDraftContext } from "./bodice.context";
import { MOCK_MEASUREMENTS } from "./bodice.constants";
import {
  draftBaseBack,
  draftBaseFront,
  draftHelpersBack,
  draftHelpersFront,
  draftNecklineFront,
  draftShoulderFront,
  draftWaistFront,
} from "./bodice.steps";

// TODO: Finish testing all lines
describe("testing bodice steps", () => {
  // create context
  const ctx = createBodiceDraftContext(MOCK_MEASUREMENTS);

  test("draftBaseFront: creates base front points and construction lines", () => {
    draftBaseFront(ctx);

    expect(ctx.points.front_centerTop).toBeDefined();
    expect(ctx.points.front_centerWaist).toBeDefined();
    expect(ctx.points.front_sideWaist).toBeDefined();

    expect(ctx.lines.front_centerFront).toBeDefined();
    expect(ctx.lines.front_waistGuide).toBeDefined();

    expect(ctx.lines.front_centerFront.role).toBe("construction");
    expect(ctx.lines.front_waistGuide.role).toBe("construction");
  });

  test("draftHelpersFront: adds bust, armscye and shoulder guides", () => {
    draftHelpersFront(ctx);

    expect(ctx.points.front_centerBust).toBeDefined();
    expect(ctx.points.front_centerArmscye).toBeDefined();
    expect(ctx.points.front_sideShoulder).toBeDefined();

    expect(ctx.lines.front_bustGuide.role).toBe("guide");
    expect(ctx.lines.front_armscyeGuide.role).toBe("guide");
    expect(ctx.lines.front_shoulderGuide.role).toBe("construction");
  });

  test("draftShoulderFront + draftNecklineFront: adds shoulder line and neckline curve", () => {
    draftShoulderFront(ctx);
    draftNecklineFront(ctx);

    expect(ctx.lines.front_shoulder.role).toBe("main_outer");
    expect(ctx.curves.front_neckline.role).toBe("main_outer");
  });

  test("draftWaistFront: creates waist dart and waist segments", () => {
    draftWaistFront(ctx);

    expect(ctx.lines.front_waistDartLeftLeg.role).toBe("main_inner");
    expect(ctx.lines.front_waistDartRightLeg.role).toBe("main_inner");

    expect(ctx.lines.front_waistCenterToRightDartLeg.role).toBe("main_outer");
    expect(ctx.lines.front_waistLeftDartLegToSideSeam.role).toBe("main_outer");
  });

  test("draftBaseBack: creates base back structure", () => {
    draftBaseBack(ctx);

    expect(ctx.points.back_centerBackTop).toBeDefined();
    expect(ctx.lines.back_centerBack.role).toBe("construction");
  });

  test("draftHelpersBack: adds bust and shoulder line guides", () => {
    draftHelpersBack(ctx);

    expect(ctx.points.back_sideBust).toBeDefined();
    expect(ctx.points.back_sideShoulder).toBeDefined();

    expect(ctx.lines.back_bustGuide.role).toBe("guide");
    expect(ctx.lines.back_shoulderGuide.role).toBe("construction");
  });
});
