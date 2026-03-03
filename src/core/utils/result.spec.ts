import { describe, expect, it } from "vitest";
import { Ok, Err, ResultWrapper } from "./result";

describe("Result constructors", () => {
	it("Ok: creates a success result with data", () => {
		const r = Ok(42);
		expect(r).toEqual({ ok: true, data: 42 });
	});

	it("Err: creates a failure result with error", () => {
		const r = Err("nope");
		expect(r).toEqual({ ok: false, error: "nope" });
	});
});

describe("ResultWrapper.map", () => {
	it("maps data when ok is true", () => {
		const wrapped = ResultWrapper(Ok(2)).map((n) => n * 3).unwrap();
		expect(wrapped).toEqual({ ok: true, data: 6 });
	});

	it("preserves failure when ok is false", () => {
		const wrapped = ResultWrapper<number, string>(Err("bad")).map((n: number) => n * 3).unwrap();
		expect(wrapped).toEqual({ ok: false, error: "bad" });
	});
});

describe("ResultWrapper.andThen", () => {
	it("chains successful results", () => {
		const r = ResultWrapper(Ok(1))
			.andThen((n) => Ok(n + 1))
			.andThen((n) => Ok(n * 5))
			.unwrap();

		expect(r).toEqual({ ok: true, data: 10 });
	});

	it("short-circuits on first error and preserves error type", () => {
		const r = ResultWrapper(Ok(1))
			.andThen(() => Err("first"))
			.andThen(() => Ok(999))
			.unwrap();

		expect(r).toEqual({ ok: false, error: "first" });
	});

	it("returns original error when starting with Err", () => {
		const r = ResultWrapper(Err("start-fail"))
			.andThen(() => Ok(2))
			.unwrap();

		expect(r).toEqual({ ok: false, error: "start-fail" });
	});
});

describe("ResultWrapper.mapErr", () => {
	it("maps error when ok is false", () => {
		const r = ResultWrapper(Err("raw"))
			.mapErr((e) => `wrapped:${e}`)
			.unwrap();

		expect(r).toEqual({ ok: false, error: "wrapped:raw" });
	});

	it("preserves success when ok is true", () => {
		const r = ResultWrapper<string, string>(Ok("all good")).mapErr((e: string) => `x${e}`).unwrap();
		expect(r).toEqual({ ok: true, data: "all good" });
	});
});

describe("ResultWrapper.unwrap", () => {
	it("returns underlying result for Ok", () => {
		const base = Ok({ a: 1 });
		const r = ResultWrapper(base).unwrap();
		expect(r).toBe(base);
	});

	it("returns underlying result for Err", () => {
		const base = Err(new Error("boom"));
		const r = ResultWrapper(base).unwrap();
		expect(r).toBe(base);
	});
});


