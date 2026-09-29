import type { Dictionary } from "./types";

export const es = {
  meta: {
    title: "Villa Elk — Villa de lujo en Golf Argan, Marrakech",
    description:
      "Villa privada de cuatro suites en Golf Argan, Marrakech, a 12 minutos del aeropuerto: piscina, hammam, cine, gimnasio y azotea marroquí. Hasta 10 huéspedes.",
  },
  nav: {
    home: "Inicio",
    rooms: "Suites",
    gallery: "Galería",
    amenities: "Servicios",
    contact: "Contacto",
    concierge: "Conserjería",
    activities: "Actividades",
    bookNow: "Reservar",
  },
  hero: {
    eyebrow: "Golf Argan · Agdal · Marrakech",
    title: "Villa Elk",
    threshold: "Cruce el umbral.",
    scroll: "Entrar",
    subtitle:
      "Una casa urbana contemporánea en tres niveles y una azotea, tranquila, a doce minutos del aeropuerto.",
    cta: "Descubrir la villa",
    bookCta: "Consultar disponibilidad",
  },
  tour: {
    eyebrow: "La villa",
    title: "Nivel por nivel",
    levelLabel: "Nivel",
    levels: [
      {
        code: "0",
        name: "Planta baja",
        title: "Recibir",
        body: "El corazón de la casa: un doble salón, marroquí y europeo, en torno a una chimenea contemporánea, el comedor y una cocina totalmente equipada. Todo se abre a la terraza y su piscina privada, protegida de las miradas por visillos.",
        spaces: ["Salón marroquí y salón europeo", "Chimenea contemporánea", "Comedor", "Cocina equipada", "Suite con baño", "Aseo de invitados", "Piscina privada", "Terraza, barbacoa y comedor exterior", "Garaje interior seguro"],
        photos: { main: "La piscina privada bajo su pérgola", detail: "El salón marroquí" },
      },
      {
        code: "−1",
        name: "Sótano",
        title: "Descansar",
        body: "Abajo, una planta entera dedicada al bienestar: un spa con hammam, un gimnasio abierto a un patio, una sala de cine privada y un espacio de peluquería. Sin necesidad de salir.",
        spaces: ["Spa y hammam", "Gimnasio con patio", "Sala de cine", "Peluquería", "Almacenaje"],
        photos: { main: "El hammam", detail: "El gimnasio abierto al patio" },
      },
      {
        code: "+1",
        name: "Planta alta",
        title: "Dormir",
        body: "Tres suites pensadas como habitaciones de hotel, cada una con su balcón privado. La suite principal, de unos 60 m², reúne vestidor, despacho y un baño con bañera de mármol y ducha a ras de suelo.",
        spaces: ["Suite principal · unos 60 m²", "Dos suites con balcón", "Bañera de mármol", "Duchas a ras de suelo", "Ropa de cama de alta gama"],
        photos: { main: "La suite principal", detail: "La bañera de mármol de la suite principal" },
      },
      {
        code: "+2",
        name: "Azotea",
        title: "El Sta7",
        body: "Arriba, el Sta7 cambia de ambiente: un salón marroquí revestido de zellige, una cocina de verano con horno de pizza y barbacoa, y vistas hasta el Atlas. Para almuerzos largos y cenas bajo el cielo de Marrakech.",
        spaces: ["Salón marroquí de zellige", "Cocina de verano", "Horno de pizza", "Barbacoa", "Vistas al Atlas"],
        photos: { main: "El salón marroquí de la azotea", detail: "El horno de pizza de la azotea" },
      },
    ],
  },
  amenities: {
    eyebrow: "Servicios",
    title: "Lo que ofrece la villa",
    conciergeLink: "Descubrir la conserjería privada",
  },
  location: {
    eyebrow: "Ubicación",
    title: "Tranquila, y a minutos de todo",
    intro:
      "Golf Argan Resort, en el barrio de Agdal: una calle tranquila, sin ruido, y todo Marrakech a un corto trayecto en coche.",
    places: [
      { minutes: "12", label: "Aeropuerto de Marrakech-Menara" },
      { minutes: "3", label: "Campos de golf Nouria y Argan" },
      { minutes: "3", label: "Avenida Mohammed VI" },
      { minutes: "5", label: "Morocco Mall" },
      { minutes: "5", label: "Al Mazar y cine Megarama" },
    ],
    unit: "min",
    note: "Tiempos en coche.",
  },
  suites: {
    meta: {
      title: "Suites — Villa Elk, Marrakech",
      description:
        "Cuatro suites con baño propio, incluida una suite principal de unos 60 m² con bañera de mármol, vestidor y despacho. Balcones privados, ropa de cama de alta gama.",
    },
    eyebrow: "Dormir",
    title: "Cuatro suites",
    intro:
      "Tres suites en la planta alta, cada una con balcón privado, y una cuarta en la planta baja, cerca de los salones. Todas tienen baño propio, televisión, amplio almacenaje y ropa de cama de alta gama elegida para noches de verdadero descanso.",
    levelNames: { ground: "Planta baja", upper: "Planta alta" },
    areaLabel: "Unos",
    viewSuite: "Ver la suite",
    backToSuites: "Todas las suites",
    featuresTitle: "En la suite",
    photosTitle: "En imágenes",
    otherSuites: "Las otras suites",
    allPhotos: "Todas las fotos",
    photosUnit: "fotos",
    ctaTitle: "La villa entera, solo para ustedes",
    suiteLabel: "Suite",
    spaces: {
      bedroom: "Dormitorio",
      desk: "Escritorio",
      bathroom: "Baño",
      balcony: "Balcón",
      details: "Detalles",
      other: "Más",
    },
  },
  gallery: {
    meta: {
      title: "Galería — Villa Elk, Golf Argan, Marrakech",
      description:
        "La villa en imágenes: piscina, azotea, suites, hammam, cine y gimnasio, en Golf Argan, Agdal, Marrakech.",
    },
    intro: "La villa tal como es, nivel por nivel — del sótano a la azotea.",
    eyebrow: "Recorrido",
    title: "Dentro de Villa Elk",
    categories: {
      all: "Todo",
      exterieur: "Exterior",
      rdc: "Planta baja",
      sousSol: "Sótano",
      suites: "Suites",
      rooftop: "Azotea",
    },
    filterLabel: "Filtrar por espacio",
    showMore: "Mostrar más fotos",
    shownOf: "fotos mostradas de",
    viewer: { open: "Ampliar la foto", close: "Cerrar", previous: "Foto anterior", next: "Foto siguiente" },
  },
  reserve: {
    meta: {
      title: "Reservar Villa Elk — Alquiler de villa completa en Marrakech",
      description:
        "Solicite sus fechas en Villa Elk, villa privada de cuatro suites en Golf Argan, Marrakech. La villa entera, hasta 10 huéspedes. Respondemos en 24 horas.",
    },
    eyebrow: "Reserva",
    title: "Solicite sus fechas",
    intro:
      "Villa Elk se alquila entera, a un solo grupo cada vez. Díganos cuándo desea venir y cuántos serán: nuestro equipo le responde en 24 horas con la tarifa y la disponibilidad.",
    asideTitle: "Conviene saber",
    asideLines: [
      "La villa entera, nunca compartida",
      "Hasta 10 huéspedes",
      "Esta solicitud no bloquea fechas ni le compromete a nada",
      "Depósito al confirmar, resto a la llegada",
      "Cancelación gratuita hasta 48 horas antes de la llegada",
    ],
    form: {
      name: "Nombre completo",
      email: "Email",
      phone: "Teléfono o WhatsApp",
      phoneHint: "Opcional — la forma más rápida de responderle",
      arrival: "Llegada",
      departure: "Salida",
      guests: "Número de huéspedes",
      message: "Sobre su estancia",
      messageHint: "Opcional — la ocasión, horarios de llegada, peticiones particulares",
      submit: "Enviar la solicitud",
      submitting: "Enviando…",
      nights: "noches",
      booked: "Reservado",
      pickArrival: "Elija su llegada",
      pickDeparture: "Elija su salida",
      clear: "Borrar fechas",
      done: "Aceptar",
      previousMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      fewer: "Menos huéspedes",
      more: "Más huéspedes",
      datePlaceholder: "Elegir",
      consent: "Usamos estos datos únicamente para responder a su solicitud y preparar su estancia.",
      consentLink: "Política de privacidad",
    },
    wizard: {
      step: "Paso",
      datesTitle: "Sus fechas",
      detailsTitle: "Sus datos",
      continue: "Continuar",
      edit: "Modificar",
      available: "Estas fechas están disponibles.",
      summary: "Su estancia",
      estimate: "Estimación",
      estimateNote: "a tarifa base, tasa turística aparte",
    },
    success: {
      title: "Solicitud enviada",
      body: "Gracias. Nuestro equipo le responderá en 24 horas con la tarifa y la disponibilidad de sus fechas.",
      again: "Hacer otra solicitud",
    },
    errors: {
      name: "Indique su nombre.",
      email: "Indique una dirección de email válida.",
      arrival: "Elija una fecha de llegada.",
      departure: "Elija una fecha de salida.",
      order: "La salida debe ser posterior a la llegada.",
      past: "Elija una fecha de llegada futura.",
      guests: "La villa acoge hasta 10 huéspedes.",
      minStay: "La estancia mínima es de 3 noches.",
      unavailable: "Estas fechas ya no están disponibles: la villa ya está reservada durante parte de esta estancia. Elija otras fechas.",
      generic: "No se pudo enviar la solicitud. Inténtelo de nuevo o escríbanos por WhatsApp.",
    },
  },
  contact: {
    meta: {
      title: "Contacto — Villa Elk, Marrakech",
      description:
        "Escriba a Villa Elk por WhatsApp o por email. Golf Argan Resort, Agdal, Marrakech. Respondemos en 24 horas.",
    },
    addressTitle: "Dirección",
    address: "Golf Argan Resort, extensión — villa 2\nAgdal, Marrakech, Marruecos",
    instagramCta: "Seguir en Instagram",
    reachTitle: "Contactarnos",
    eyebrow: "Contacto",
    title: "Planifiquemos su estancia",
    description:
      "El equipo de Villa Elk responde en menos de 24h para organizar su estancia en Marrakech.",
    whatsappCta: "Escribir por WhatsApp",
    emailCta: "Enviar un email",
    mapCta: "Ver en Google Maps",
    responseTime: "Respuesta en 24 horas",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    instagramLabel: "Instagram",
    directionsCta: "Cómo llegar a la villa",
    mapTitle: "Villa Elk en el mapa de Marrakech",
    plusCodeLabel: "Plus Code",
    gettingThereTitle: "Llegar a la villa",
    gettingThere: [
      {
        label: "Aeropuerto Marrakech-Menara",
        distance: "6 km · 12 a 15 min",
      },
      {
        label: "Plaza Jemaa el-Fna y la medina",
        distance: "7 km · 15 a 20 min",
      },
      {
        label: "Golfs Noria y Argan",
        distance: "3 min",
      },
    ],
    transferNote: "Traslado privado desde el aeropuerto bajo petición: nuestra conserjería le recoge.",
    conciergeCta: "Ver la conserjería",
    bookTitle: "¿Ya tiene sus fechas?",
  },
  stay: {
    eyebrow: "Tarifas",
    from: "Desde",
    price: "3.700 DH",
    per: "la noche",
    approx: "unos 350 €",
    taxLabel: "Tasa turística",
    tax: "31 DH por persona y noche",
    taxApprox: "unos 3 €",
    minStay: "Estancia mínima de 3 noches para garantizar una experiencia privilegiada.",
    languages: "Nuestro equipo habla árabe, francés e inglés.",
  },
  concierge: {
    meta: {
      title: "Conserjería privada — Villa Elk, Marrakech",
      description: "Traslados, chef privado, excursiones, tratamientos en la villa, cuidado de niños: la conserjería privada de Villa Elk organiza su estancia en Marrakech, bajo petición.",
    },
    eyebrow: "Conserjería privada",
    title: "El arte de vivir Marrakech, con toda sencillez.",
    intro: [
      "Porque una estancia excepcional no se limita a una villa bonita, Villa Elk le abre las puertas de un servicio de conserjería privado, pensado para responder a sus deseos y hacerle disfrutar plenamente de Marrakech.",
      "A través de nuestra red de socios cuidadosamente seleccionados, le acompañamos antes de su llegada y durante toda su estancia para organizar, con una simple petición, los servicios que necesite.",
    ],
    groups: [
      {
        title: "Llegada y transporte",
        items: [
          {
            name: "Traslados privados desde y hacia el aeropuerto",
            body: "Recibimiento personalizado y organización de sus desplazamientos.",
          },
          {
            name: "Alquiler de vehículos",
            body: "Vehículos de alta gama, con o sin chófer, según sus necesidades.",
          },
        ],
      },
      {
        title: "Arte de vivir y gastronomía",
        items: [
          {
            name: "Reservas exclusivas",
            body: "Restaurantes, mesas privilegiadas, rooftops, locales de moda, beach clubs y direcciones confidenciales.",
          },
          {
            name: "Chef y cocinero privado",
            body: "Desayuno, almuerzo, cena o recepción privada directamente en la villa, a su gusto.",
          },
        ],
      },
      {
        title: "Experiencias privadas",
        items: [
          {
            name: "Excursiones y descubrimientos a medida",
            body: "El Atlas, el desierto de Agafay, escapadas privadas, actividades culturales y experiencias auténticas alrededor de Marrakech.",
          },
          {
            name: "Programas personalizados",
            body: "También podemos organizar programas personalizados para que descubra la región a su ritmo.",
          },
        ],
      },
      {
        title: "Belleza y bienestar",
        items: [
          {
            name: "Belleza a domicilio",
            body: "Tratamientos, masajes y servicios de bienestar en la intimidad de su villa.",
          },
          {
            name: "Peluquería y cuidados tradicionales",
            body: "Peluquería, hammam, exfoliación tradicional y tratamientos de belleza realizados por profesionales seleccionados.",
          },
        ],
      },
      {
        title: "Deporte y bienestar",
        items: [
          {
            name: "Entrenador personal",
            body: "Sesiones personalizadas en la villa o en un espacio adecuado, según sus objetivos y su programa.",
          },
        ],
      },
      {
        title: "Servicios para familias",
        items: [
          {
            name: "Niñera y cuidado de niños",
            body: "Le ponemos en contacto con profesionales seleccionados para que los padres disfruten plenamente de su estancia, con total tranquilidad.",
          },
        ],
      },
    ],
    onDemandTitle: "Y todo lo que necesite",
    onDemand: "¿Necesita algo que no figura en esta lista? Pídanoslo: lo organizamos bajo petición.",
    stepsTitle: "Su deseo, nuestra organización",
    stepsIntro: "En Villa Elk queremos que cada detalle de su estancia sea sencillo, fluido y personalizado.",
    steps: [
      "Nos cuenta lo que desea.",
      "Le ponemos en contacto con el socio adecuado.",
    ],
    exclusive: "Nuestro servicio de conserjería se ofrece exclusivamente a los huéspedes de Villa Elk.",
    terms: "Los servicios los prestan directamente nuestros socios y están sujetos a disponibilidad, reserva previa y tarifas según los servicios solicitados.",
    cta: "Solicitar un servicio",
    imageAlt: "El salón marroquí de la villa",
  },
  activities: {
    meta: {
      title: "Actividades cerca de Villa Elk — Golf, parques acuáticos y ocio en Marrakech",
      description: "Campos de golf, parques acuáticos, karting, pádel, laser game y restaurantes: todo lo que hacer a pocos minutos de Villa Elk, en Golf Argan, Marrakech.",
    },
    eyebrow: "Alrededor de la villa",
    title: "Todo, a pocos minutos.",
    intro: "Golf Argan es un punto de partida ideal: dos campos de golf, dos parques acuáticos, deporte y comida para todos los gustos, a menos de diez minutos en coche.",
    timelineTitle: "Desde la villa, en coche",
    minutes: "min",
    website: "Web oficial",
    directions: "Cómo llegar",
    categories: {
      golf: "Golf",
      loisirs: "Deporte y ocio",
      aquatique: "Parques acuáticos",
      restauration: "Dónde comer",
    },
    conciergeTitle: "¿Le apetece ir?",
    conciergeBody: "Reservas, traslados, chófer: nuestra conserjería organiza sus salidas bajo petición.",
    conciergeCta: "Descubrir la conserjería",
    homeLink: "Actividades alrededor de la villa",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que conviene saber antes de reservar",
    intro: "Las respuestas a las preguntas que más nos hacen. Para lo demás, escríbanos: respondemos en 24 horas.",
    questions: [
      {
        question: "¿Dónde está Villa Elk?",
        answer: "Villa Elk es una villa privada en Golf Argan Resort, en el barrio de Agdal de Marrakech (Plus Code HXFX+F99). Está a 12 minutos del aeropuerto Marrakech-Menara y a unos 15 minutos de la plaza Jemaa el-Fna.",
      },
      {
        question: "¿Cuántas personas puede alojar la villa?",
        answer: "La villa tiene cuatro suites y aloja hasta 10 huéspedes, en cuatro niveles: sótano de bienestar (hammam, cine, gimnasio), planta baja con la piscina, planta alta con las suites y azotea.",
      },
      {
        question: "¿Cuánto cuesta una noche?",
        answer: "Desde 3.700 DH la noche, unos 350 €. Se añade la tasa turística: 31 DH por persona y noche, unos 3 €.",
      },
      {
        question: "¿Hay una estancia mínima?",
        answer: "Sí: 3 noches como mínimo, para garantizar una experiencia exclusiva.",
      },
      {
        question: "¿Qué está incluido?",
        answer: "Piscina privada, hammam, cine, gimnasio, azotea marroquí con horno de pizza, wifi, aire acondicionado, domótica, cámaras de seguridad y servicio de limpieza. Hay un chef disponible bajo petición.",
      },
      {
        question: "¿A qué hora son la llegada y la salida?",
        answer: "Llegada a partir de las 15 h, salida antes de las 11 h. Si necesita otro horario, indíquelo en su solicitud.",
      },
      {
        question: "¿Cómo reservar?",
        answer: "Elija sus fechas en la página Reservar, que muestra la disponibilidad, y envíe su solicitud. Respondemos en 24 horas; la reserva se confirma con una ficha de reserva enviada por email.",
      },
      {
        question: "¿Organizan el traslado desde el aeropuerto?",
        answer: "Sí. Nuestra conserjería organiza traslados privados desde y hacia el aeropuerto, además de chófer, excursiones y chef privado, bajo petición.",
      },
      {
        question: "¿Qué idiomas habla el equipo?",
        answer: "El equipo habla árabe, francés e inglés, por WhatsApp, por email o en persona.",
      },
    ],
  },
  theme: {
    toDark: "Cambiar a modo oscuro",
    toLight: "Cambiar a modo claro",
  },
  footer: {
    description: "Villa Elk — Golf Argan Resort, Agdal, Marrakech.",
    rights: "Todos los derechos reservados.",
    legal: "Aviso legal",
    privacy: "Política de privacidad",
  },
} satisfies Dictionary;
