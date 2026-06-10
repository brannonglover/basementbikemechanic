const siteConfig = {
  title: "Basement Bike Mechanic",
  tagline: "Pedalea con confianza, repara con cuidado",
  phone: "(404) 596-4088",
  email: "support@basementbikemechanic.com",
  site_description:
    "En Basement Bike Mechanic, todo el trabajo de reparación de bicicletas se realiza aquí en mi taller del sótano en Atlanta: usted deja su bicicleta en el taller y yo me encargo de principio a fin. Atiendo a la comunidad ciclista de Atlanta con reparación experta, mantenimiento y ajustes diseñados para que pedalee con fluidez y seguridad. Si no le resulta conveniente venir, ofrezco recogida opcional dentro de 5 millas: recojo y devuelvo su bicicleta, pero el trabajo de reparación siempre se hace aquí en el taller (no en su domicilio ni en el sitio). Ya sea commuter diario, ciclista de fin de semana o ciclista serio, recibe un servicio amable y profesional en un ambiente acogedor. Desde pinchazos y ajustes de frenos hasta revisiones completas, atiendo todo tipo de bicicletas con cuidado y precisión. ¿Listo para un ajuste? Trabajo exclusivamente con cita para darle a su bicicleta la atención que merece. Escríbame por texto o reserve en línea.",
  regular_maintenance_first:
    "Los ajustes regulares y el mantenimiento adecuado son esenciales para mantener su bicicleta segura, eficiente y agradable de usar. Un ajuste ayuda a que frenos y cambios funcionen con suavidad, que los neumáticos estén bien inflados y que todas las piezas móviles estén limpias y lubricadas, lo que reduce el desgaste y prolonga la vida útil de los componentes. El mantenimiento adecuado puede evitar reparaciones costosas al detectar problemas pequeños antes de que se conviertan en fallas mayores, y también mejora el rendimiento, facilitando el pedaleo y haciendo los paseos más cómodos.",
  regular_maintenance_second:
    "Además de ahorrar dinero y tiempo, una bicicleta bien mantenida es más segura, con frenado confiable, manejo estable y menos probabilidades de averías en carretera o sendero. Ya sea que pedalee a diario u ocasionalmente, invertir en un ajuste mantiene su bicicleta en óptimas condiciones y le ayuda a aprovechar al máximo cada paseo.",
  service_header: "Ajustes",
  services: [
    {
      id: 0,
      service: "Ajuste estándar",
      list: [
        { id: 0, task: "Lavado completo de la bicicleta" },
        { id: 1, task: "Limpieza de cassette/roda libre (ultrasónica)" },
        { id: 2, task: "Limpieza y lubricación de cadena" },
        { id: 3, task: "Lubricación de cables (+15 para manillar de carretera)" },
        { id: 4, task: "Reemplazo de cables deshilachados" },
        { id: 5, task: "Indexado de cambios" },
        { id: 6, task: "Limpieza de frenos" },
        { id: 7, task: "Limpieza y centrado de ruedas" },
        { id: 8, task: "Engrase del sillín" },
      ],
      price: 120,
    },
    {
      id: 1,
      service: "Ajuste estándar ebike",
      list: [
        { id: 0, task: "Lavado completo de la bicicleta" },
        { id: 1, task: "Limpieza de cassette/roda libre" },
        { id: 2, task: "Limpieza y lubricación de cadena" },
        { id: 3, task: "Lubricación de cables" },
        { id: 4, task: "Reemplazo de cables deshilachados" },
        { id: 5, task: "Indexado de cambios" },
        { id: 6, task: "Limpieza de frenos" },
        { id: 7, task: "Limpieza y centrado de ruedas" },
        { id: 8, task: "Engrase del sillín" },
      ],
      price: 155,
    },
    {
      id: 2,
      service: 'Ajuste de bicicleta infantil (hasta 20")',
      list: [
        { id: 0, task: "Lavado completo de la bicicleta" },
        { id: 1, task: "Limpieza y lubricación de cadena" },
        { id: 2, task: "Lubricación de cables (+15 para manillar de carretera)" },
        { id: 3, task: "Reemplazo de cables deshilachados" },
        { id: 4, task: "Grease del sillín" },
      ],
      price: 45,
    },
    {
      id: 3,
      service: "Ajuste de limpieza profunda",
      list: [
        { id: 0, task: "Ajuste estándar más..." },
        { id: 1, task: "Limpieza o reemplazo de rodamientos de buje según condición (+15 para rodamientos sellados)" },
        { id: 2, task: "Limpieza o reemplazo de rodamientos de pedalier según condición (+15 para rodamientos sellados)" },
      ],
      price: 175,
    },
    {
      id: 4,
      service: "Servicio de horquilla 50 h",
      list: [
        { id: 0, task: "Desmontaje de las botellas inferiores" },
        { id: 1, task: "Limpieza de botellas inferiores" },
        { id: 2, task: "Retirar y limpiar (reemplazar si es necesario) anillos de espuma" },
        { id: 3, task: "Limpieza de barras superiores (exterior)" },
        { id: 4, task: "Grasa nueva en sellos" },
        { id: 5, task: "Reensamblaje de botellas inferiores" },
        { id: 6, task: "Aceite nuevo en botellas inferiores (si es necesario)" },
      ],
      price: 75,
    },
    {
      id: 5,
      service: "Servicio de horquilla 200 h",
      list: [
        { id: 0, task: "Desmontaje de botellas inferiores" },
        { id: 1, task: "Limpieza de cilindros inferiores" },
        { id: 2, task: "Retirar, limpiar e instalar anillos de espuma" },
        { id: 3, task: "Retirar, limpiar e instalar sellos limpiadores" },
        { id: 4, task: "Desmontaje de barras superiores" },
        { id: 5, task: "Limpiar/lubricar/instalar (o reemplazar) todas las juntas tóricas" },
        { id: 6, task: "Reensamblar barras superiores" },
        { id: 7, task: "Limpieza de barras superiores (exterior)" },
        { id: 8, task: "Grasa nueva en sellos" },
        { id: 9, task: "Reensamblaje de botellas inferiores" },
        { id: 10, task: "Aceite nuevo en barras superiores" },
      ],
      price: 150,
    },
    {
      id: 6,
      service: "Servicio de amortiguador 50 h",
      list: [
        { id: 0, task: "Desmontaje del amortiguador" },
        { id: 1, task: "Limpieza del cámara de aire" },
        { id: 2, task: "Retirar, limpiar y lubricar juntas tóricas (reemplazar si es necesario)" },
        { id: 3, task: "Aceite fresco en cámara de aire para compresión suave" },
        { id: 4, task: "Reensamblaje del amortiguador" },
      ],
      price: 75,
    },
    {
      id: 7,
      service: "Servicio de amortiguador 200 h",
      list: [
        { id: 0, task: "Desmontaje del amortiguador" },
        { id: 1, task: "Limpieza del cámara de aire" },
        { id: 2, task: "Retirar, limpiar y lubricar juntas tóricas (reemplazar si es necesario)" },
        { id: 3, task: "Retirar, limpiar y engrasar depósito de aceite" },
        { id: 4, task: "Retirar, limpiar y engrasar IFP" },
        { id: 5, task: "Instalar IFP a la profundidad correcta para compresión" },
        { id: 6, task: "Llenar cámara inferior con presión de aire adecuada" },
        { id: 7, task: "Aceite fresco en cámara de aire para compresión suave" },
        { id: 8, task: "Reensamblaje del amortiguador" },
      ],
      price: 150,
    },
  ],
  additional_services: "Servicios",
  individual_services: [
    { id: 2, service: "Limpieza/centrado de rueda (por neumático)", price: 25 },
    { id: 3, service: "Reemplazo de cámara (por neumático)", price: 20 },
    { id: 4, service: "Reemplazo de cámara ebike (por neumático)", price: 40 },
    { id: 7, service: "Reemplazo de neumático tubeless (por neumático)", price: 35 },
    { id: 8, service: "Purga de frenos (por freno)", price: 45 },
    { id: 9, service: "Purga de frenos ebike (por freno)", price: 65 },
    { id: 10, service: "Alineación de patilla de cambio", price: 35 },
    { id: 11, service: "Reemplazo de cable (por cable)", price: 15 },
    { id: 12, service: "Reemplazo de cable y funda (por cable)", price: 35 },
    { id: 13, service: "Indexado de cambios", price: 25 },
    { id: 14, service: "Reemplazo de cadena", price: 10 },
    { id: 15, service: "Limpieza y asentado de pastillas (por freno)", price: 30 },
    { id: 16, service: "Limpieza y asentado de pastillas ebike (por freno)", price: 40 },
    { id: 17, service: "Envoltura de manillar de carretera", price: 35 },
    { id: 18, service: "Instalación de pedales", price: 8 },
    { id: 19, service: "Reemplazo de rodamientos de buje", price: 35 },
    { id: 20, service: "Montaje de bicicleta nueva (niños)", price: 45 },
    { id: 21, service: "Montaje de bicicleta nueva (adulto)", price: 100 },
    { id: 22, service: "Montaje de bicicleta nueva (adulto) ebike", price: 150 },
    { id: 23, service: "Montaje de bicicleta de viaje", price: 75 },
  ],
  bikes: [{ id: 0, name: "", images: [], price: 300 }],
};

const messages = {
  seo: {
    defaultTitle:
      "Reparación de bicicletas en Atlanta | Ajustes y servicio | Basement Bike Mechanic",
    defaultDescription:
      "Reparación y ajustes de bicicletas en Atlanta con cita previa. Deje su bici en 2272 Melinda Dr NE — recogida y devolución opcional dentro de 5 millas. Todo el trabajo en mi taller del sótano; sin reparaciones móviles en el sitio. Envíe un texto o reserve en línea.",
    privacyTitle: "Política de privacidad | Basement Bike Mechanic",
    privacyDescription:
      "Cómo Basement Bike Mechanic recopila y usa la información de contacto para servicios de reparación de bicicletas. Sin spam; nunca vendemos sus datos.",
    termsTitle: "Términos de servicio | Basement Bike Mechanic",
    termsDescription:
      "Términos para mensajes SMS, servicios de reparación de bicicletas, presupuestos y responsabilidad en Basement Bike Mechanic en Atlanta.",
    bikesTitle: "Bicicletas usadas en venta en Atlanta | Basement Bike Mechanic",
    bikesDescription:
      "Explore bicicletas usadas de calidad en venta de Basement Bike Mechanic en Atlanta. Contáctenos sobre disponibilidad y precios.",
    bookTitle: "Reservar una reparación | Basement Bike Mechanic",
    bookDescription:
      "Solicite una reparación de bicicleta con Basement Bike Mechanic en Atlanta. Complete el formulario para reservar su servicio y recibir actualizaciones por SMS.",
  },
  nav: {
    home: "Inicio",
    about: "Acerca de",
    bikesForSale: "Bicicletas en venta",
    bookNow: "Reservar",
    main: "Principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    switchToLight: "Cambiar a modo claro",
    switchToDark: "Cambiar a modo oscuro",
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    language: "Idioma",
    english: "English",
    spanish: "Español",
  },
  footer: {
    backToHome: "Volver al inicio",
    privacyPolicy: "Política de privacidad",
    termsConditions: "Términos y condiciones",
  },
  home: {
    heroTitle: "Reparación de bicicletas y ajustes en Atlanta",
    disclaimer:
      "Aviso: no ofrezco servicios de reparación móvil en el sitio. Todo el trabajo se realiza en mi taller del sótano en Atlanta.",
    reviewsHeading: "Lo que dicen los clientes",
    aboutHeading: "Acerca de",
    aboutP1:
      "Crecí en Roswell, GA, donde las bicicletas eran parte de la vida: pedaleaba a todas partes y desarrollé una verdadera pasión por el ciclismo. Me encanta el ciclismo de montaña y los senderos del norte de Georgia. Ese amor por las bicicletas nunca se fue.",
    aboutP2:
      "Hace un par de años convertí esa pasión de toda la vida en Basement Bike Mechanic. El nombre es literal: trabajo desde mi sótano en Atlanta, una cita a la vez — reparación en el taller, no móvil ni en el sitio. Trabajar con cita no es solo una preferencia de horario: significa que cada bicicleta recibe atención real y enfocada en lugar de apresurarse en una cola de taller.",
    aboutP3:
      "Cuando deja su bicicleta conmigo, soy yo quien trabaja en ella de principio a fin. Sin traspasos, sin atajos. Solo un ciclista de Atlanta que cuida las bicicletas de otros igual que la suya.",
    maintenanceHeading: "Mantenimiento regular",
    tuneUpImageAlt:
      "Mecánico realizando ajuste y reparación de bicicleta en Atlanta",
    tabTuneUps: "Ajustes",
    tabServices: "Servicios",
    contactText: "Texto:",
    contactEmail: "Correo:",
    contactLocation: "Ubicación:",
    mapTitle:
      "Mapa con la ubicación de Basement Bike Mechanic en 2272 Melinda Dr NE, Atlanta GA 30345",
    smsHeading: "Comunicación por SMS",
    smsP1:
      "Enviamos actualizaciones por SMS de Basement Bike Mechanic relacionadas con reparaciones activas, incluyendo confirmaciones de reserva, progreso del servicio y avisos de recogida.",
    smsP2:
      "Los clientes optan por recibir mensajes al enviar el formulario de solicitud de reparación en nuestro sitio web y marcar la casilla opcional de consentimiento SMS. Esta casilla se muestra durante el proceso de reserva y debe seleccionarse para recibir mensajes.",
    smsP3:
      "La frecuencia de mensajes varía. Pueden aplicarse tarifas de mensajes y datos. Responda STOP para cancelar, HELP para ayuda. No se envían mensajes de marketing.",
    smsViewOur: "Consulte nuestra",
    smsAnd: "y",
    smsTermsOfService: "Términos de servicio",
  },
  mobileTuneUp: {
    chooseLabel: "Elija un ajuste",
    detailsOpen: "Detalles abiertos",
    tapToView: "Toque para ver detalles",
  },
  bikes: {
    pageTitle: "Bicicletas usadas en venta en Atlanta",
    introP1Prefix:
      "Explore nuestras bicicletas usadas actuales. La disponibilidad puede cambiar rápidamente — para la información más actualizada, envíe un texto al",
    introP1Middle: "o un correo a",
    introP2:
      "¿Busca algo específico (carretera, commuter, montaña o ebike)? Contáctenos y le ayudaremos a encontrar una buena opción.",
    loadingLabel: "Cargando bicicletas en venta",
    loadingHint: "Cargando bicicletas en venta…",
    loadError:
      "No pudimos cargar los listados en este momento. Actualice la página o contáctenos en",
    noBikes:
      "No hay bicicletas listadas actualmente. Vuelva pronto o contáctenos en",
    inquireSuffix: " para consultar disponibilidad.",
    loadErrorSuffix: ".",
    tileAlt: "{{name}} bicicleta usada en venta en Atlanta",
    close: "Cerrar",
    prev: "← Anterior",
    next: "Siguiente →",
    contactMe: "Contácteme",
    imageAlt: "{{name}} - imagen {{index}}",
    jsonLdName: "Bicicletas usadas en venta en Atlanta",
    jsonLdListName: "Bicicletas usadas en venta en Atlanta",
  },
  privacy: {
    title: "Política de privacidad",
    intro:
      "En Basement Bike Mechanic, su privacidad importa. Solo recopilamos información de contacto que usted proporciona voluntariamente al solicitar servicios de reparación de bicicletas. Esta página describe cómo manejamos su número de teléfono y protegemos sus datos.",
    optInTitle: "1. Optar por SMS",
    optInP1:
      "El consentimiento SMS se recopila mediante el formulario de reserva de reparación en nuestro sitio web. Para optar, debe:",
    optInLi1: "Ingresar su número de teléfono en el formulario de reserva.",
    optInLi2: "Marcar la casilla opcional de consentimiento SMS antes de enviar.",
    optInP2:
      'La casilla dice: "Al marcar esta casilla, permite que Basement Bike Mechanic le envíe mensajes SMS relacionados con reparaciones, incluyendo confirmaciones de reserva, actualizaciones de servicio y avisos de recogida. Sin textos de marketing. La frecuencia varía. Pueden aplicarse tarifas de mensajes y datos. Responda STOP para cancelar y HELP para ayuda."',
    optInP3:
      "Marcar esta casilla es opcional. Si lo hace, permite que Basement Bike Mechanic le envíe actualizaciones SMS relacionadas con su reparación.",
    useTitle: "2. Uso de su información de contacto",
    useP1:
      "Su número de teléfono se usa únicamente con fines operativos relacionados con la reparación de bicicletas:",
    useLi1: "Responder consultas y proporcionar presupuestos.",
    useLi2: "Informarle sobre el estado de la reparación.",
    useLi3: "Avisarle cuando su bicicleta esté lista para recoger.",
    useLi4: "Discutir piezas, presupuestos y problemas técnicos encontrados durante el servicio.",
    optOutTitle: "3. Cancelar SMS",
    optOutP:
      "Puede cancelar los mensajes SMS en cualquier momento respondiendo STOP a cualquier mensaje. Responda HELP para asistencia. Después de cancelar, ya no recibirá actualizaciones por SMS. Pueden aplicarse tarifas estándar de mensajes y datos.",
    noSpamTitle: "4. Política de no spam y uso de datos",
    noSpamP1: "Respetamos su bandeja de entrada y nunca:",
    noSpamLi1: "Enviaremos mensajes de marketing, boletines o promociones.",
    noSpamLi2: "Venderemos, compartiremos o arrendaremos su información a terceros.",
    noSpamP2: "Sus datos de contacto permanecen privados y solo los usa nuestro taller.",
    questionsPrefix: "Si tiene preguntas sobre esta política, por favor",
    emailUs: "envíenos un correo",
  },
  terms: {
    title: "Términos y condiciones",
    intro:
      "Bienvenido a Basement Bike Mechanic. Al usar nuestros servicios de reparación de bicicletas y canales de comunicación, acepta los siguientes términos. Léalos con atención.",
    smsTitle: "1. Términos de mensajes SMS",
    smsP1:
      "Al proporcionar su número móvil y marcar la casilla opcional de consentimiento SMS en nuestro formulario de reserva, permite que Basement Bike Mechanic le envíe actualizaciones SMS sobre su reparación. Esto incluye:",
    smsLi1: "Confirmaciones de reserva y recordatorios de cita.",
    smsLi2: "Actualizaciones de estado y progreso de la reparación.",
    smsLi3: "Presupuestos, disponibilidad de piezas y hallazgos técnicos.",
    smsLi4: "Avisos de recogida cuando su bicicleta esté lista.",
    smsP2:
      "No se enviarán mensajes de marketing. La frecuencia varía según su reparación. Pueden aplicarse tarifas estándar de mensajes y datos.",
    consentTitle: "2. Consentimiento y cancelación",
    consentP1:
      "El consentimiento SMS se recopila mediante el formulario de reserva en basementbikemechanic.com. Al enviar una reserva:",
    consentLi1: "Ingresa su número de teléfono.",
    consentLi2: "Puede marcar la casilla opcional de consentimiento SMS para recibir actualizaciones.",
    consentP2:
      'La casilla indica: "Al marcar esta casilla, permite que Basement Bike Mechanic le envíe mensajes SMS relacionados con reparaciones, incluyendo confirmaciones de reserva, actualizaciones de servicio y avisos de recogida. Sin textos de marketing. La frecuencia varía. Pueden aplicarse tarifas de mensajes y datos. Responda STOP para cancelar y HELP para ayuda."',
    consentP3Prefix:
      "Marcar esta casilla es opcional. Para cancelar en cualquier momento, responda STOP a cualquier mensaje, envíe HELP para asistencia o contáctenos en",
    consentP3Suffix:
      ". Los operadores no son responsables de mensajes retrasados o no entregados.",
    servicesTitle: "3. Servicios y presupuestos",
    servicesP:
      "Los presupuestos están sujetos a cambios según nuestra inspección. Comunicaremos cualquier hallazgo o costo adicional antes de proceder. El pago vence al completar el servicio, salvo acuerdo por escrito.",
    liabilityTitle: "4. Limitación de responsabilidad",
    liabilityP:
      "Basement Bike Mechanic presta servicios de reparación de buena fe. No somos responsables de daños preexistentes, desgaste o defectos fuera de nuestro control. Nuestra responsabilidad se limita al costo del servicio prestado. Las bicicletas y propiedad personal quedan bajo su propio riesgo mientras estén bajo nuestro cuidado.",
    generalTitle: "5. Términos generales",
    generalP1:
      "Nos reservamos el derecho de modificar estos términos. El uso continuado de nuestros servicios después de los cambios constituye aceptación. Si tiene preguntas sobre estos términos, por favor",
    emailUs: "envíenos un correo",
  },
  book: {
    successTitle: "Solicitud enviada",
    successBody:
      "Recibimos su solicitud de reserva y la enviamos a BikeOps. La revisaremos y le contactaremos pronto.",
    trackStatus: "Seguir el estado de su reparación",
    pageTitle: "Reservar una reparación",
    intro:
      "Complete el formulario a continuación para solicitar servicio. Todas las reparaciones se realizan en mi taller del sótano: deje su bicicleta en el taller o elija recogida dentro de 5 millas. Su reserva se enviará directamente a BikeOps, y el mensaje de consentimiento SMS se muestra aquí antes de enviar.",
    firstName: "Nombre *",
    lastName: "Apellido *",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    address: "Dirección",
    addressPlaceholder: "Dirección opcional",
    smsConsent:
      "Al marcar esta casilla, permite que Basement Bike Mechanic le envíe mensajes SMS relacionados con reparaciones, incluyendo confirmaciones de reserva, actualizaciones de servicio y avisos de recogida. Sin textos de marketing. La frecuencia varía. Pueden aplicarse tarifas de mensajes y datos. Responda STOP para cancelar y HELP para ayuda. Consulte nuestros",
    termsLink: "Términos y condiciones",
    privacyLink: "Política de privacidad",
    bikeDetails: "Detalles de la bicicleta",
    lookingUpBikes: "Buscando sus bicicletas guardadas...",
    savedBikes: "Bicicletas guardadas",
    savedBikesFor: "Bicicletas guardadas de {{name}}",
    eBike: "E-bike",
    standardBike: "Bicicleta estándar",
    bikeTypeAuto: "Tipo detectado automáticamente",
    bike: "Bicicleta",
    bikeN: "Bicicleta {{n}}",
    remove: "Eliminar",
    make: "Marca *",
    model: "Modelo",
    type: "Tipo",
    autoDetect: "Detectar automáticamente por marca/modelo",
    addAnotherBike: "Agregar otra bicicleta",
    collectionPricingHint:
      "El precio del servicio de recogida se aplica en BikeOps automáticamente cuando se acepta la reserva.",
    requestedServices: "Servicios solicitados",
    deliveryOption: "Opción de entrega",
    dropOffAtShop: "Entrega en el taller",
    collectionService: "Servicio de recogida",
    preferredCollectionPickup: "Fecha preferida de recogida",
    preferredDropOff: "Fecha preferida de entrega",
    preferredCollectionReturn: "Fecha preferida de devolución",
    preferredPickup: "Fecha preferida de recogida",
    time: "Hora",
    optional: "(opcional)",
    optionalOnly: "Opcional",
    selectDate: "Seleccione una fecha",
    selectTime: "Seleccione una hora",
    datesOptionalTitle: "Las fechas y horas son opcionales.",
    datesOptionalBody:
      "Déjelas en blanco si aún no está seguro, u omita la hora si es flexible sobre cuándo entregar o recoger.",
    collectionAddress: "Dirección de recogida",
    collectionAddressPlaceholder: "Calle, ciudad, código postal",
    checkingCollection:
      "Verificando si esta dirección está dentro de nuestra área de recogida de 5 millas…",
    verifyAddressError:
      "No pudimos verificar la dirección en este momento. La recogida solo está disponible dentro de 5 millas.",
    collectionUnavailable: "La recogida no está disponible para esta dirección.",
    milesAway: "Está a unas {{miles}} mi de distancia.",
    collectWithin: "Recogemos dentro de {{radius}} mi del taller.",
    collectionAvailable:
      "Buenas noticias: esta dirección está dentro de nuestra área de recogida de {{radius}} millas.",
    collectionWindowStart: "Inicio de ventana de recogida",
    collectionWindowEnd: "Fin de ventana de recogida",
    collectionHelper:
      "El servicio de recogida está disponible dentro de 5 millas del taller. Si prefiere entregar en el taller, elija esa opción arriba.",
    notesLabel: "¿Algo más que debamos saber?",
    notesPlaceholder: "Describa el problema, horarios o cualquier detalle útil.",
    submitting: "Enviando solicitud...",
    bookNow: "Reservar",
    servicesLoadError:
      "No se pudieron cargar los servicios de BikeOps. Actualice e intente de nuevo. Si usa un bloqueador de anuncios o herramienta de privacidad, desactívelo para este sitio.",
    checkingAddress: "Verificando dirección de recogida… intente de nuevo en un momento.",
    outsideRadius:
      "Esa dirección está fuera de nuestro radio de recogida de 5 millas. Elija entrega en el taller.",
    verifyFailed: "No pudimos verificar esa dirección de recogida. Revísela.",
    submitFailed: "No se pudo enviar la reserva. Intente de nuevo.",
    connectionFailed:
      "No se pudo enviar la reserva. Verifique su conexión e intente de nuevo.",
  },
  bookPicker: {
    matchingServices: "Servicios coincidentes",
    chooseServices: "Elija sus servicios",
    checkEach: "Marque cada uno que necesite",
    filterByType: "Filtrar servicios por tipo",
    searchPlaceholder: "O busque por nombre…",
    searchLabel: "Buscar servicios por nombre",
    loadingServices: "Cargando servicios…",
    noServices: "Ningún servicio coincide con su búsqueda.",
    selectedCount: "{{count}} seleccionados",
    selectedCountOne: "1 seleccionado",
    noneSelected: "Ninguno seleccionado aún",
    showAll: "Mostrar todo",
    showLess: "Mostrar menos",
    intro:
      "Toque una categoría o busque servicios, luego marque cada reparación o mantenimiento que desee en esta visita.",
    step1: "Paso 1:",
    narrowList: "Reduzca la lista (opcional)",
    clear: "Borrar",
    step2Prefix: "Paso 2:",
    searchResults: "{{count}} resultado",
    searchResultsPlural: "{{count}} resultados",
    servicesSelected: "{{count}} servicio seleccionado",
    showAllServices: "Mostrar los {{count}} servicios",
    mostRequested: "Más solicitados",
    moreServices: "Más servicios",
    noServicesHint:
      "Ningún servicio coincide con su búsqueda. Pruebe otra categoría o borre la búsqueda.",
    quickPick: {
      tuneUp: "Ajuste",
      brakes: "Frenos",
      flatTire: "Pinchazo / neumático",
      wheels: "Ruedas",
      ebike: "E-bike",
    },
  },
};

const locale = { messages, siteConfig };

export default locale;
