import { describe, expect, it } from "vitest";
import { InvariantError } from "./invariant-error";
import { mapDomainBoundaryError } from "./domain-boundary-error-mapper";
import { DomainError } from "./domain-error";

describe("mapDomainBoundaryError", () => {
  it("returns same InvariantError", () => {
    const invErr = new InvariantError("testing");
    const mappedInvErr = mapDomainBoundaryError(invErr, {
      sloper: "bodice",
      stage: "drafting",
    });

    expect(mappedInvErr).toBe(invErr);
    expect(mappedInvErr).toBeInstanceOf(InvariantError);
  });

  it("returns same DomainError", () => {
    const dmnErr = new DomainError("testing", {
      sloper: "bodice",
      stage: "drafting",
    });
    const mappedDmnErr = mapDomainBoundaryError(dmnErr, {
      sloper: "bodice",
      stage: "drafting",
    });

    expect(mappedDmnErr).toBe(dmnErr);
    expect(mappedDmnErr).toBeInstanceOf(DomainError);
  });

  it("uses provided sloper and stage when wrapping", () => {
    const err = new Error("testing");

    const mappedErr = mapDomainBoundaryError(err, {
      sloper: "bodice",
      stage: "contours",
    });

    if (!(mappedErr instanceof DomainError)) {
      throw new Error("expected DomainError");
    }

    expect(mappedErr).toBeInstanceOf(DomainError);
    expect(mappedErr.sloper).toBe("bodice");
    expect(mappedErr.stage).toBe("contours");
    expect(mappedErr.origin).toBe("unexpected");
  });

  it("wraps plain error into DomainError", () => {
    const err = new Error("testing");
    const mappedErr = mapDomainBoundaryError(err, {
      sloper: "bodice",
      stage: "drafting",
    });

    if (!(mappedErr instanceof DomainError)) {
      throw new Error("expected DomainError");
    }

    expect(mappedErr).toBeInstanceOf(DomainError);
    expect(mappedErr).not.toBe(err);
    expect(mappedErr.message).toContain("testing");
    expect(mappedErr.sloper).toBe("bodice");
    expect(mappedErr.stage).toBe("drafting");
    expect(mappedErr.origin).toBe("unexpected");
    expect(mappedErr.cause).toBe(err);
  });

  it("wraps non-error into DomainError", () => {
    const nonErr = "there was an issue";
    const mappedErr = mapDomainBoundaryError(nonErr, {
      sloper: "bodice",
      stage: "drafting",
    });

    if (!(mappedErr instanceof DomainError)) {
      throw new Error("expected DomainError");
    }

    expect(mappedErr).toBeInstanceOf(DomainError);
    expect(mappedErr.sloper).toBe("bodice");
    expect(mappedErr.stage).toBe("drafting");
    expect(mappedErr.origin).toBe("unexpected");
    expect(mappedErr.cause).toBe(nonErr);
    expect(mappedErr.message.length).toBeGreaterThan(0);
  });
});
