import { filterServices, serviceMatchesQuery } from "./serviceSearch";

const wheelTruing = {
  id: 1,
  name: "Wheel cleaning/truing",
  description: "Clean rims and true wheels.",
};

const tuneUp = {
  id: 2,
  name: "Standard tune-up",
  description: "Adjust shifting and braking.",
};

describe("serviceSearch", () => {
  it("matches substring searches", () => {
    expect(serviceMatchesQuery(tuneUp, "tune")).toBe(true);
    expect(serviceMatchesQuery(wheelTruing, "wheel")).toBe(true);
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
});
