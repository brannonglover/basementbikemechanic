import enSiteConfig from "../assets/siteConfig.json";
import esLocale from "./locales/es";

const NAME_ALIASES = {
  "tube and/or tire replacement (per tire)": "Tube Replacement (per tire)",
  "tube and/or tire replacement ebike (per tire)": "Tube Replacement ebike (per tire)",
  "new bike build (adult) ebike": "New bike build (adult) (ebike)",
};

const EXTRA_SPANISH_BY_NAME = {
  "bike dropoff": { name: "Entrega de bicicleta en el taller" },
  "bike pickup": { name: "Recogida de bicicleta en el taller" },
  "bottom bracket replacement": { name: "Reemplazo de pedalier" },
  "brake bleed (top off)": { name: "Purga de frenos (relleno)" },
  "cable and housing replacement ebike (per cable)": {
    name: "Reemplazo de cable y funda ebike (por cable)",
  },
  "component install": { name: "Instalación de componente" },
  "component install e-bike": { name: "Instalación de componente e-bike" },
  "drivetrain installation": {
    name: "Instalación de transmisión",
    description:
      "Reemplazo de todos los componentes de transmisión en la bicicleta\r\n- Cambio\r\n- Bielas\r\n- Cassette\r\n- Desviador",
  },
  "drop bar wrap (for repairs)": {
    name: "Envoltura de manillar (para reparaciones)",
    description:
      "En bicicletas con manillar de carretera, debemos quitar la mitad de la cinta para acceder a los cables de freno/cambio y luego volver a envolver.",
  },
  "freewheel install": { name: "Instalación de roda libre" },
  "hanger install": { name: "Instalación de patilla de cambio" },
  "headset adjustment": { name: "Ajuste de dirección" },
  "headset adjustment ebike": { name: "Ajuste de dirección ebike" },
  "hydraulic brake install ebike (front)": { name: "Instalación de freno hidráulico ebike (delantero)" },
  "hydraulic brake install ebike (rear)": { name: "Instalación de freno hidráulico ebike (trasero)" },
  "internally routed cables": { name: "Cables con paso interno" },
  "mechanical disc brake adjustment": { name: "Ajuste de freno de disco mecánico" },
  "rethreading of crank arm": { name: "Roscado de biela" },
  "rotor install ebike (front)": { name: "Instalación de disco ebike (delantero)" },
  "rotor install ebike (rear)": { name: "Instalación de disco ebike (trasero)" },
  "shimano nexus internal gear service": { name: "Servicio de cambio interno Shimano Nexus" },
  "spoke replacement": { name: "Reemplazo de radio" },
  "suspension fork install": { name: "Instalación de horquilla de suspensión" },
  "v-brake alignment": { name: "Alineación de V-Brake" },
  "wheel install w/ wiring ebike": { name: "Instalación de rueda con cableado ebike" },
};

function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function buildSpanishLookup() {
  const lookup = new Map();

  const add = (englishName, spanishName, spanishDescription) => {
    if (!englishName || !spanishName) return;
    lookup.set(normalizeName(englishName), {
      name: spanishName,
      description: spanishDescription ?? null,
    });
  };

  enSiteConfig.services.forEach((enService, index) => {
    const esService =
      esLocale.siteConfig.services.find((item) => item.id === enService.id) ||
      esLocale.siteConfig.services[index];
    if (!esService) return;

    const spanishDescription = esService.list?.map((item) => item.task).join("\r\n") || null;
    add(enService.service, esService.service, spanishDescription);
  });

  enSiteConfig.individual_services.forEach((enService) => {
    const esService = esLocale.siteConfig.individual_services.find(
      (item) => item.id === enService.id
    );
    if (esService) {
      add(enService.service, esService.service, null);
    }
  });

  return lookup;
}

const SPANISH_LOOKUP = buildSpanishLookup();

function resolveEnglishName(name) {
  const normalized = normalizeName(name);
  const alias = NAME_ALIASES[normalized];
  return alias || name;
}

function getSpanishTranslation(englishName) {
  const resolved = resolveEnglishName(englishName);
  const normalized = normalizeName(resolved);
  return SPANISH_LOOKUP.get(normalized) || EXTRA_SPANISH_BY_NAME[normalizeName(englishName)] || null;
}

export function localizeBikeOpsService(service, locale) {
  if (locale !== "es" || !service) {
    return service;
  }

  const translation = getSpanishTranslation(service.name);
  if (!translation) {
    return service;
  }

  return {
    ...service,
    nameEn: service.name,
    descriptionEn: service.description,
    name: translation.name,
    description: translation.description ?? service.description,
  };
}

export function localizeBikeOpsServices(services, locale) {
  if (locale !== "es" || !Array.isArray(services)) {
    return services;
  }
  return services.map((service) => localizeBikeOpsService(service, locale));
}
