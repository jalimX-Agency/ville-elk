import type { Dictionary } from "./types";

export const es = {
  meta: {
    title: "Villa Elk — Villa de lujo en Golf Argan, Marrakech",
    description:
      "Villa Elk, una villa contemporánea con tres suites y un dormitorio en 3 niveles en Golf Argan Resort, Agdal, Marrakech. Piscina privada, hammam, cine privado — hasta 10 huéspedes.",
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
      "Una villa urbana de arquitectura moderna y depurada, distribuida en tres niveles, en el corazón del barrio turístico de Agdal.",
    cta: "Descubrir la villa",
    bookCta: "Consultar disponibilidad",
  },
  concept: {
    eyebrow: "El espíritu del lugar",
    title: "Tres niveles, una sola idea: la calma",
    body: "Golf Argan Resort, extensión — villa 2. A pocos minutos del campo de golf y del centro de Agdal, Villa Elk se despliega en tres niveles: líneas limpias, piedra clara y luz rasante, pensada para estancias en familia o entre amigos cercanos.",
    stats: [
      { value: "04", label: "Habitaciones / suites" },
      { value: "10", label: "Huéspedes máximo" },
      { value: "03", label: "Niveles" },
    ],
  },
  tour: {
    eyebrow: "La villa",
    title: "Nivel a nivel",
    levelLabel: "Nivel",
    levels: [
      {
        code: "0",
        name: "Planta baja",
        title: "Vivir",
        body: "Cruzado el umbral: un doble salón, europeo y marroquí, el comedor y la cocina, un dormitorio con su baño — y la terraza abierta a la piscina.",
        spaces: ["Doble salón europeo y marroquí", "Comedor", "Cocina", "Dormitorio con baño", "Piscina y terraza", "Rincón de barbacoa", "Garaje interior seguro", "Pequeño jardín"],
      },
      {
        code: "−1",
        name: "Nivel inferior",
        title: "Recuperarse",
        body: "Abajo, al resguardo del calor: el hammam, un gimnasio abierto a un patio de bambú y la sala de cine.",
        spaces: ["Hammam", "Gimnasio", "Sala de cine"],
      },
      {
        code: "+1",
        name: "Planta alta",
        title: "Descansar",
        body: "Arriba, tres suites, entre ellas una suite principal de más de 50 m², con baños de gres porcelánico italiano de gran formato.",
        spaces: ["Suite principal · más de 50 m²", "Dos suites", "Gres italiano de gran formato", "Hasta 10 huéspedes"],
      },
    ],
  },
  amenities: {
    eyebrow: "Servicios",
    title: "Lo que ofrece la villa",
  },
  suites: {
    meta: {
      title: "Suites y habitaciones — Villa Elk, Marrakech",
      description:
        "Tres suites en la planta alta, incluida una suite principal de más de 50 m², y una habitación a ras de suelo. Baños en gran formato de azulejo italiano. Hasta 10 huéspedes.",
    },
    eyebrow: "Dormir",
    title: "Tres suites y una habitación",
    intro:
      "La planta alta reúne tres suites, cada una con su baño en gran formato de azulejo italiano. Una cuarta habitación queda a ras de suelo, cerca del salón y de la terraza.",
    levelNames: { ground: "Planta baja", upper: "Planta alta" },
    areaLabel: "Más de",
  },
  gallery: {
    meta: {
      title: "Galería — Villa Elk, Golf Argan, Marrakech",
      description:
        "La villa en imágenes: piscina, salones, suites, hammam, gimnasio y sala de cine, en Golf Argan, Agdal, Marrakech.",
    },
    intro: "La villa tal como está hoy, nivel por nivel.",
    eyebrow: "Recorrido",
    title: "Dentro de Villa Elk",
    note: "Fotos tomadas por el propietario — pronto llegará un reportaje profesional.",
  },
  booking: {
    eyebrow: "Reserva",
    title: "Condiciones de estancia",
    currency: "Tarifas mostradas en MAD (dírham marroquí)",
    policyTitle: "Política de reserva",
    policyLines: [
      "Depósito obligatorio para confirmar la reserva",
      "Cancelación gratuita hasta 48h antes de la llegada",
      "Pago por transferencia, efectivo o tarjeta",
    ],
  },
  reserve: {
    meta: {
      title: "Reservar Villa Elk — Alquiler de villa completa en Marrakech",
      description:
        "Solicite sus fechas en Villa Elk, villa privada de tres suites y una habitación en Golf Argan, Agdal, Marrakech. La villa entera, hasta 10 huéspedes. Respondemos en 24 horas.",
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
