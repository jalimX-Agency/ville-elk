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
  },
  theme: {
    toDark: "Cambiar a modo oscuro",
    toLight: "Cambiar a modo claro",
  },
  footer: {
    description: "Villa Elk — Golf Argan Resort, Agdal, Marrakech.",
    rights: "Todos los derechos reservados.",
  },
} satisfies Dictionary;
