import {
  filterServices,
  getHighlightedNameSegments,
  getQueryVariants,
  partitionServicesForDisplay,
  serviceMatchesQuery,
  sortServicesByRelevance,
} from "./serviceSearch";

const wheelTruing = {
  id: "wheel",
  name: "Wheel Cleaning/Truing (per tire)",
  description: "Clean rims and true wheels.",
};

const tuneUp = {
  id: "standard",
  name: "Standard Tune-Up",
  description: "Adjust shifting and braking.",
};

const deluxeTuneUp = {
  id: "deluxe",
  name: "Deep Clean Tune-Up",
  description: "Standard Tune-Up plus bearing service.",
};

const popularIds = new Set(["standard"]);

describe("serviceSearch", () => {
  it("matches substring searches", () => {
    expect(serviceMatchesQuery(tuneUp, "tune")).toBe(true);
    expect(serviceMatchesQuery(wheelTruing, "wheel")).toBe(true);
  });

  it("matches tune up with spacing variants", () => {
    expect(serviceMatchesQuery(tuneUp, "tune up")).toBe(true);
    expect(serviceMatchesQuery(tuneUp, "tune-up")).toBe(true);
    expect(serviceMatchesQuery(tuneUp, "tuneup")).toBe(true);
  });

  it("matches close misspellings like true -> truing", () => {
    expect(serviceMatchesQuery(wheelTruing, "true")).toBe(true);
    expect(serviceMatchesQuery(wheelTruing, "trui")).toBe(true);
  });

  it("requires all query words to match for multi-word searches", () => {
    expect(serviceMatchesQuery(wheelTruing, "wheel true")).toBe(true);
    expect(serviceMatchesQuery(wheelTruing, "wheel tune")).toBe(false);
  });

  it("returns all services when the query is empty", () => {
    expect(filterServices([wheelTruing, tuneUp], "")).toHaveLength(2);
    expect(filterServices([wheelTruing, tuneUp], "   ")).toHaveLength(2);
  });

  it("filters unrelated services", () => {
    expect(filterServices([wheelTruing, tuneUp], "true")).toEqual([wheelTruing]);
  });

  it("ranks standard tune-up ahead of other tune services", () => {
    const sorted = sortServicesByRelevance(
      [deluxeTuneUp, tuneUp, wheelTruing],
      "tune up",
      popularIds
    );
    expect(sorted[0].id).toBe("standard");
  });

  it("partitions browse mode into popular and rest", () => {
    const result = partitionServicesForDisplay(
      [deluxeTuneUp, tuneUp, wheelTruing],
      "",
      popularIds
    );
    expect(result.mode).toBe("browse");
    expect(result.popular.map((service) => service.id)).toEqual(["standard"]);
    expect(result.rest).toHaveLength(2);
  });

  it("highlights matched text in the service name", () => {
    const segments = getHighlightedNameSegments("Standard Tune-Up", "tune");
    expect(segments.some((segment) => segment.highlight)).toBe(true);
  });

  it("normalizes query variants", () => {
    expect(getQueryVariants("tune up")).toEqual(
      expect.arrayContaining(["tune up", "tune-up", "tuneup"])
    );
  });
});
