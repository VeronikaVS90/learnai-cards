import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { updateSRS } from "./updateSRS";

const fixedDate = new Date("2025-01-01T00:00:00.000Z");

const buildCard = (
  overrides: Partial<Parameters<typeof updateSRS>[0]> = {}
) => ({
  interval: 1,
  easeFactor: 2.5,
  repetition: 0,
  dueAt: fixedDate.toISOString(),
  ...overrides,
});

describe("updateSRS", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resets repetition and interval on Again", () => {
    const result = updateSRS(
      buildCard({ interval: 6, repetition: 4, easeFactor: 2 }),
      0
    );

    expect(result.repetition).toBe(0);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBe(2);
    expect(result.dueAt).toBe("2025-01-02T00:00:00.000Z");
  });

  it("applies Hard adjustments with floor interval and EF drop", () => {
    const result = updateSRS(
      buildCard({ interval: 5, repetition: 3, easeFactor: 1.4 }),
      1
    );

    expect(result.interval).toBe(6); // 5 * 1.2 rounded
    expect(result.easeFactor).toBe(1.3); // cannot go below 1.3
    expect(result.repetition).toBe(3);
    expect(result.dueAt).toBe("2025-01-07T00:00:00.000Z");
  });

  it("handles Good for first and second repetitions", () => {
    const first = updateSRS(buildCard(), 2);
    expect(first.repetition).toBe(1);
    expect(first.interval).toBe(1);

    const second = updateSRS(first, 2);
    expect(second.repetition).toBe(2);
    expect(second.interval).toBe(3);
  });

  it("scales interval with ease factor on later Good reviews", () => {
    const card = buildCard({ interval: 5, repetition: 3, easeFactor: 2.4 });
    const result = updateSRS(card, 2);

    expect(result.interval).toBe(12); // round(5 * 2.4)
    expect(result.repetition).toBe(4);
    expect(result.dueAt).toBe("2025-01-13T00:00:00.000Z");
  });

  it("boosts interval and ease factor on Easy", () => {
    const card = buildCard({ interval: 4, repetition: 2, easeFactor: 2.3 });
    const result = updateSRS(card, 3);

    expect(result.repetition).toBe(3);
    expect(result.interval).toBe(13); // round(4 * (2.3 + 0.15) * 1.3)
    expect(result.easeFactor).toBeCloseTo(2.45, 2);
    expect(result.dueAt).toBe("2025-01-14T00:00:00.000Z");
  });
});
