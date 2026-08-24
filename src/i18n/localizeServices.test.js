import { localizeBikeOpsService } from "./localizeServices";

describe("localizeBikeOpsService", () => {
  const standardTuneUp = {
    id: "svc-1",
    name: "Standard Tune-Up",
    description: "Complete bike wash\r\nGear indexing",
    price: 120,
  };

  it("returns the service unchanged in English", () => {
    expect(localizeBikeOpsService(standardTuneUp, "en")).toBe(standardTuneUp);
  });

  it("translates known BikeOps services in Spanish", () => {
    const localized = localizeBikeOpsService(standardTuneUp, "es");
    expect(localized.name).toBe("Ajuste estándar");
    expect(localized.nameEn).toBe("Standard Tune-Up");
    expect(localized.description).toContain("Lavado completo de la bicicleta");
    expect(localized.descriptionEn).toBe(standardTuneUp.description);
  });

  it("translates BikeOps-only services in Spanish", () => {
    const localized = localizeBikeOpsService(
      { id: "svc-2", name: "Bike Dropoff", description: null, price: 10 },
      "es"
    );
    expect(localized.name).toBe("Entrega de bicicleta en el taller");
  });

  it("translates newly cataloged services in Spanish", () => {
    const localized = localizeBikeOpsService(
      { id: "svc-3", name: "Rear hub rebuild", description: null, price: 75 },
      "es"
    );
    expect(localized.name).toBe("Reconstrucción de buje trasero");
  });

  it("still translates the BikeOps e-bike tune-up after homepage cards are combined", () => {
    const localized = localizeBikeOpsService(
      {
        id: "svc-5",
        name: "Standard Tune-Up ebike",
        description: "Complete bike wash\r\nGear indexing",
        price: 155,
      },
      "es"
    );
    expect(localized.name).toBe("Ajuste estándar ebike");
    expect(localized.description).toContain("Lavado completo de la bicicleta");
  });
});
