import enSiteConfig from "../assets/siteConfig.json";
import esLocale from "./locales/es";

const NAME_ALIASES = {
  "tube replacement (per tire)": "Tube and/or Tire Replacement (per tire)",
  "tube replacement ebike (per tire)": "Tube and/or Tire Replacement ebike (per tire)",
  "new bike build (adult) (ebike)": "New bike build (adult) ebike",
  "pedal installalation": "Pedal installation",
  "pedals installalation": "Pedal installation",
};

const EXTRA_SPANISH_BY_NAME = {
  "bike dropoff": { name: "Entrega de bicicleta en el taller" },
  "bike pickup": { name: "Recogida de bicicleta en el taller" },
  "standard tune-up ebike": {
    name: "Ajuste estándar ebike",
    description:
      "Lavado completo de la bicicleta\r\nLimpieza de cassette/roda libre\r\nLimpieza y lubricación de cadena\r\nLubricación de cables\r\nReemplazo de cables deshilachados\r\nIndexado de cambios\r\nLimpieza de frenos\r\nLimpieza y centrado de ruedas\r\nEngrase del sillín",
  },
  "drop bar wrap (for repairs)": {
    name: "Re-envoltura de manillar de carretera",
    description:
      "En bicicletas con manillar de carretera, debemos quitar la mitad de la cinta para acceder a los cables de freno/cambio y luego volver a envolver.",
  },
  "drop bar wrap (re-wrap)": {
    name: "Re-envoltura de manillar de carretera",
    description:
      "En bicicletas con manillar de carretera, debemos quitar la mitad de la cinta para acceder a los cables de freno/cambio y luego volver a envolver.",
  },
  "drop bar aerobar (re-mount)": {
    name: "Reinstalación de acoples aerodinámicos",
    description: "Los acoples aerodinámicos deben retirarse para acceder a las fundas.",
  },
  "rethreading of crank arm": {
    name: "Roscado de biela",
    description:
      "Con una herramienta se cortan las roscas de la biela e inserta una pieza nueva para el tamaño de pedal 9/16\".",
  },
  "rust removal": { name: "Eliminación de óxido" },
  "shimano nexus internal gear service": { name: "Servicio de cambio interno Shimano Nexus" },
  "suspension fork install": {
    name: "Instalación de horquilla de suspensión",
    description:
      "Retirar la horquilla vieja\r\nTransferir la copa de dirección\r\nCortar el tubo de dirección nuevo\r\nInstalar tuerca de arranque si es necesario (salvo SWAT)\r\nReinstalar espaciadores/potencia\r\nReinstalar freno delantero",
  },
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
  const extra =
    EXTRA_SPANISH_BY_NAME[normalizeName(englishName)] || EXTRA_SPANISH_BY_NAME[normalized];
  const fromConfig = SPANISH_LOOKUP.get(normalized);

  if (!fromConfig && !extra) {
    return null;
  }

  return {
    name: fromConfig?.name || extra?.name,
    description: fromConfig?.description ?? extra?.description ?? null,
  };
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
