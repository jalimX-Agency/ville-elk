/**
 * Suites and gallery, as the owner described them in the intake form and the
 * two voice notes: three suites upstairs, one bedroom on the ground floor,
 * bathrooms in large-format Italian tile.
 *
 * The photographs here are the owner's own phone pictures. They are placeholders
 * until the professional shoot lands, and the dashboard replaces them one by
 * one — nothing in the code refers to a file name.
 *
 *   npx tsx prisma/seed-rooms.ts
 */
import { scriptClient } from "./client";

const SUITES = [
  {
    slug: "suite-parentale",
    position: 1,
    level: "+1",
    areaSqm: 50,
    nameFr: "Suite parentale",
    nameEn: "Master suite",
    nameEs: "Suite principal",
    nameAr: "الجناح الرئيسي",
    descriptionFr:
      "Plus de cinquante mètres carrés à l'étage, avec sa salle de bain en carrelage italien grand format. La pièce prend la lumière sur deux côtés.",
    descriptionEn:
      "Over fifty square metres upstairs, with its own bathroom in large-format Italian tile. The room takes light on two sides.",
    descriptionEs:
      "Más de cincuenta metros cuadrados en la planta alta, con su baño en gran formato de azulejo italiano. La habitación recibe luz por dos lados.",
    descriptionAr:
      "أزيد من خمسين متراً مربعاً في الطابق العلوي، بحمّام من البلاط الإيطالي كبير المقاس. تدخلها الإضاءة من جهتين.",
    imageUrl: "/images/villa-elk/bedroom-1.jpg",
    altFr: "La suite parentale à l'étage",
    altEn: "The master suite upstairs",
    altEs: "La suite principal en la planta alta",
    altAr: "الجناح الرئيسي في الطابق العلوي",
  },
  {
    slug: "suite-deux",
    position: 2,
    level: "+1",
    areaSqm: null,
    nameFr: "Deuxième suite",
    nameEn: "Second suite",
    nameEs: "Segunda suite",
    nameAr: "الجناح الثاني",
    descriptionFr:
      "À l'étage, avec sa salle de bain privative en carrelage italien grand format.",
    descriptionEn: "Upstairs, with its own bathroom in large-format Italian tile.",
    descriptionEs: "En la planta alta, con baño privado en gran formato de azulejo italiano.",
    descriptionAr: "في الطابق العلوي، بحمّام خاص من البلاط الإيطالي كبير المقاس.",
    imageUrl: "/images/villa-elk/bedroom-2.jpg",
    altFr: "La deuxième suite",
    altEn: "The second suite",
    altEs: "La segunda suite",
    altAr: "الجناح الثاني",
  },
  {
    slug: "suite-trois",
    position: 3,
    level: "+1",
    areaSqm: null,
    nameFr: "Troisième suite",
    nameEn: "Third suite",
    nameEs: "Tercera suite",
    nameAr: "الجناح الثالث",
    descriptionFr:
      "La troisième chambre de l'étage, elle aussi avec sa salle de bain privative.",
    descriptionEn: "The third room upstairs, also with its own bathroom.",
    descriptionEs: "La tercera habitación de la planta alta, también con baño privado.",
    descriptionAr: "الغرفة الثالثة في الطابق العلوي، هي الأخرى بحمّام خاص.",
    imageUrl: "/images/villa-elk/bedroom-2-detail.jpg",
    altFr: "La troisième suite",
    altEn: "The third suite",
    altEs: "La tercera suite",
    altAr: "الجناح الثالث",
  },
  {
    slug: "chambre-rez-de-chaussee",
    position: 4,
    level: "0",
    areaSqm: null,
    nameFr: "Chambre du rez-de-chaussée",
    nameEn: "Ground-floor bedroom",
    nameEs: "Habitación de la planta baja",
    nameAr: "غرفة الطابق الأرضي",
    descriptionFr:
      "De plain-pied, avec sa salle de bain, à deux pas du séjour et de la terrasse — pratique pour qui préfère éviter les escaliers.",
    descriptionEn:
      "On the level, with its own bathroom, a step from the living room and the terrace — useful for anyone who would rather avoid the stairs.",
    descriptionEs:
      "A ras de suelo, con su baño, a dos pasos del salón y de la terraza — práctico para quien prefiera evitar las escaleras.",
    descriptionAr:
      "في المستوى الأرضي، بحمّامها الخاص، على بعد خطوات من الصالون والتراس — مناسبة لمن يفضّل تجنّب الدرج.",
    imageUrl: "/images/villa-elk/bathroom-gold.jpg",
    altFr: "La salle de bain de la chambre du rez-de-chaussée",
    altEn: "The bathroom of the ground-floor bedroom",
    altEs: "El baño de la habitación de la planta baja",
    altAr: "حمّام غرفة الطابق الأرضي",
  },
];

const GALLERY: [string, string, string, string, string][] = [
  // [file, fr, en, es, ar]
  [
    "pool-terrace-sunset.jpg",
    "La piscine au coucher du soleil",
    "The pool at sunset",
    "La piscina al atardecer",
    "المسبح عند الغروب",
  ],
  [
    "pool-terrace-day.jpg",
    "La piscine privée et sa terrasse en bois",
    "The private pool and its wooden terrace",
    "La piscina privada y su terraza de madera",
    "المسبح الخاص وتراسه الخشبي",
  ],
  [
    "salon-marocain.jpg",
    "Le salon marocain",
    "The Moroccan sitting room",
    "El salón marroquí",
    "الصالون المغربي",
  ],
  [
    "tv-lounge-onyx-1.jpg",
    "Le séjour européen",
    "The European living room",
    "El salón europeo",
    "الصالون الأوروبي",
  ],
  [
    "tv-lounge-onyx-2.jpg",
    "Le séjour, vu de l'entrée",
    "The living room, seen from the entrance",
    "El salón, visto desde la entrada",
    "الصالون من جهة المدخل",
  ],
  [
    "tv-lounge-onyx-3.jpg",
    "Un coin du séjour",
    "A corner of the living room",
    "Un rincón del salón",
    "ركن من الصالون",
  ],
  [
    "dining-terrace.jpg",
    "La table dressée sur la terrasse",
    "The table laid on the terrace",
    "La mesa puesta en la terraza",
    "مائدة مهيّأة على التراس",
  ],
  [
    "terrace-garden.jpg",
    "La terrasse plantée surplombant le patio",
    "The planted terrace above the patio",
    "La terraza ajardinada sobre el patio",
    "التراس المشجّر المطل على الفناء",
  ],
  [
    "bedroom-1.jpg",
    "La suite parentale",
    "The master suite",
    "La suite principal",
    "الجناح الرئيسي",
  ],
  ["bedroom-2.jpg", "La deuxième suite", "The second suite", "La segunda suite", "الجناح الثاني"],
  [
    "bedroom-2-detail.jpg",
    "Un détail de la deuxième suite",
    "A detail of the second suite",
    "Un detalle de la segunda suite",
    "تفصيل من الجناح الثاني",
  ],
  [
    "bathroom-gold.jpg",
    "Une salle de bain en carrelage italien",
    "A bathroom in Italian tile",
    "Un baño en azulejo italiano",
    "حمّام بالبلاط الإيطالي",
  ],
  [
    "bathroom-shower.jpg",
    "La douche à l'italienne",
    "The walk-in shower",
    "La ducha a ras de suelo",
    "الدوش الإيطالي",
  ],
  ["hammam.jpg", "Le hammam", "The hammam", "El hammam", "الحمّام المغربي"],
  [
    "gym.jpg",
    "La salle de sport ouverte sur le patio de bambous",
    "The gym opening onto the bamboo patio",
    "El gimnasio abierto al patio de bambú",
    "قاعة الرياضة المطلة على فناء الخيزران",
  ],
  [
    "cinema-lounge-red.jpg",
    "La salle de cinéma et sa banquette de velours",
    "The cinema room and its velvet daybed",
    "La sala de cine y su diván de terciopelo",
    "قاعة السينما وأريكتها المخملية",
  ],
  [
    "barber-corner.jpg",
    "Le coin coiffure du niveau inférieur",
    "The barber corner on the lower level",
    "El rincón de peluquería del nivel inferior",
    "ركن الحلاقة في الطابق السفلي",
  ],
  [
    "staircase.jpg",
    "L'escalier reliant les trois niveaux",
    "The staircase linking the three levels",
    "La escalera que une los tres niveles",
    "الدرج الرابط بين الطوابق الثلاثة",
  ],
  [
    "hallway-marble.jpg",
    "Le couloir du rez-de-chaussée",
    "The ground-floor hallway",
    "El pasillo de la planta baja",
    "ممر الطابق الأرضي",
  ],
  [
    "entrance-benches.jpg",
    "L'entrée et ses banquettes",
    "The entrance and its benches",
    "La entrada y sus bancos",
    "المدخل ومقاعده",
  ],
  [
    "entrance-vases.jpg",
    "Un détail de l'entrée",
    "A detail of the entrance",
    "Un detalle de la entrada",
    "تفصيل من المدخل",
  ],
  [
    "garage.jpg",
    "Le garage couvert à l'entrée de la villa",
    "The covered garage at the villa entrance",
    "El garaje cubierto en la entrada de la villa",
    "المرآب المغطى عند مدخل الفيلا",
  ],
];

async function main() {
  const db = scriptClient();

  for (const suite of SUITES) {
    await db.suite.upsert({ where: { slug: suite.slug }, create: suite, update: suite });
  }

  // Matched on the file path so re-seeding cannot duplicate a photograph.
  for (const [file, fr, en, es, ar] of GALLERY) {
    const imageUrl = `/images/villa-elk/${file}`;
    const position = GALLERY.findIndex((row) => row[0] === file) + 1;
    const data = { imageUrl, position, altFr: fr, altEn: en, altEs: es, altAr: ar };

    const existing = await db.galleryImage.findFirst({ where: { imageUrl } });
    if (existing) {
      await db.galleryImage.update({ where: { id: existing.id }, data });
    } else {
      await db.galleryImage.create({ data });
    }
  }

  console.log(`Seeded ${await db.suite.count()} suites and ${await db.galleryImage.count()} photographs.`);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
