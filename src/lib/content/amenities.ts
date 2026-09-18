import type { Amenity } from "./types";

/**
 * Seed content, confirmed by the owner's intake form.
 *
 * When the dashboard ships, replace the body of `getAmenities` with a Prisma
 * query (`db.amenity.findMany({ where: { published: true }, orderBy: { order: "asc" } })`)
 * — the rows already have this shape, so no component has to change. Images
 * move from /public to R2 by swapping `image.src` for the uploaded URL.
 */
const AMENITIES: Amenity[] = [
  {
    id: "piscine",
    order: 1,
    published: true,
    name: {
      fr: "Piscine privée & terrasse",
      en: "Private pool & terrace",
      es: "Piscina privada y terraza",
      ar: "مسبح خاص وتراس",
    },
    image: {
      src: "/images/villa-elk/pool-terrace-day.jpg",
      alt: {
        fr: "La piscine privée et sa terrasse en bois",
        en: "The private pool and its wooden terrace",
        es: "La piscina privada y su terraza de madera",
        ar: "المسبح الخاص وتراسه الخشبي",
      },
    },
  },
  {
    id: "hammam",
    order: 2,
    published: true,
    name: {
      fr: "Hammam & spa",
      en: "Hammam & spa",
      es: "Hammam y spa",
      ar: "حمام مغربي وسبا",
    },
    image: {
      src: "/images/villa-elk/hammam.jpg",
      alt: {
        fr: "Le hammam en pierre et laiton",
        en: "The hammam in stone and brass",
        es: "El hammam en piedra y latón",
        ar: "الحمّام المغربي بالحجر والنحاس",
      },
    },
  },
  {
    id: "gym",
    order: 3,
    published: true,
    name: {
      fr: "Salle de sport",
      en: "Gym",
      es: "Gimnasio",
      ar: "قاعة رياضية",
    },
    image: {
      src: "/images/villa-elk/gym.jpg",
      alt: {
        fr: "La salle de sport ouverte sur le patio de bambous",
        en: "The gym opening onto the bamboo patio",
        es: "El gimnasio abierto al patio de bambú",
        ar: "قاعة الرياضة المطلة على فناء الخيزران",
      },
    },
  },
  {
    id: "jardin",
    order: 4,
    published: true,
    name: {
      fr: "Jardin & terrasse plantée",
      en: "Garden & planted terrace",
      es: "Jardín y terraza ajardinada",
      ar: "حديقة وتراس مشجّر",
    },
    image: {
      src: "/images/villa-elk/terrace-garden.jpg",
      alt: {
        fr: "La terrasse plantée surplombant le patio",
        en: "The planted terrace above the patio",
        es: "La terraza ajardinada sobre el patio",
        ar: "التراس المشجّر المطل على الفناء",
      },
    },
  },
  {
    id: "cinema",
    order: 5,
    published: true,
    name: {
      fr: "Salle de cinéma privée",
      en: "Private cinema room",
      es: "Sala de cine privada",
      ar: "قاعة سينما خاصة",
    },
    image: {
      src: "/images/villa-elk/cinema-lounge-red.jpg",
      alt: {
        fr: "La salle de cinéma et sa banquette de velours",
        en: "The cinema room and its velvet daybed",
        es: "La sala de cine y su diván de terciopelo",
        ar: "قاعة السينما وأريكتها المخملية",
      },
    },
  },
  {
    id: "parking",
    order: 6,
    published: true,
    name: {
      fr: "Garage intérieur sécurisé",
      en: "Secure indoor garage",
      es: "Garaje interior seguro",
      ar: "مرآب داخلي آمن",
    },
    image: {
      src: "/images/villa-elk/garage.jpg",
      alt: {
        fr: "Le garage couvert à l'entrée de la villa",
        en: "The covered garage at the villa entrance",
        es: "El garaje cubierto en la entrada de la villa",
        ar: "المرآب المغطى عند مدخل الفيلا",
      },
    },
  },
  // No photograph yet — these show as type until the shoot lands.
  {
    id: "barbecue",
    order: 7,
    published: true,
    name: {
      fr: "Coin barbecue sur la terrasse",
      en: "Terrace barbecue corner",
      es: "Rincón de barbacoa en la terraza",
      ar: "ركن للشواء على التراس",
    },
    image: null,
  },
  {
    id: "climatisation",
    order: 8,
    published: true,
    name: {
      fr: "Climatisation intégrale",
      en: "Full air conditioning",
      es: "Aire acondicionado integral",
      ar: "تكييف هواء شامل",
    },
    image: null,
  },
];

export function getAmenities(): Amenity[] {
  return AMENITIES.filter((a) => a.published).sort((a, b) => a.order - b.order);
}
