import { describe, expect, it } from "vitest";

const initialNodes = [
  { id: "source", type: "input" },
  { id: "service", type: "default" },
  { id: "storage", type: "output" },
];

const initialEdges = [
  { source: "source", target: "service" },
  { source: "service", target: "storage" },
];

describe("editor starter graph", () => {
  it("connects source to the destination through the service", () => {
    expect(initialNodes.map(({ id }) => id)).toEqual([
      "source",
      "service",
      "storage",
    ]);
    expect(initialEdges).toEqual([
      { source: "source", target: "service" },
      { source: "service", target: "storage" },
    ]);
  });
});
