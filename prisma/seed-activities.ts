/**
 * The places near the villa, from the owner's list of 29 September 2026 with
 * the driving times he gave; each checked on Google Maps from the villa
 * (HXFX+F99) the same day. Photographs are Unsplash stock (free for
 * commercial use), credited on the page; the owner can swap any of them for
 * the place's own from the dashboard.
 *
 * Safe to run again: rows are matched by slug, and only rows that do not yet
 * exist are created, so the owner's edits are never overwritten.
 *
 *   npx tsx prisma/seed-activities.ts
 */
import { scriptClient } from "./client";

const img = (file: string) => `/images/activites/${file}`;

type Seed = {
  slug: string;
  category: "golf" | "loisirs" | "aquatique" | "restauration";
  minutes: number;
  name: [string, string, string, string];
  description: [string, string, string, string];
  alt: [string, string, string, string];
  image: string;
  credit: string;
  websiteUrl: string;
  mapsQuery: string;
};

const ACTIVITIES: Seed[] = [
  {
    slug: "golf-noria",
    category: "golf",
    minutes: 5,
    name: ["Noria Golf Club", "Noria Golf Club", "Noria Golf Club", "نادي نوريا للغولف"],
    description: [
      "Un parcours de 18 trous au pied de l'Atlas, dessiné en trois ambiances : jardins fleuris, bassins autour de la noria et paysage désertique.",
      "An 18-hole course at the foot of the Atlas, laid out in three moods: flowering gardens, basins around the water wheel and a desert landscape.",
      "Un recorrido de 18 hoyos al pie del Atlas, con tres ambientes: jardines floridos, estanques alrededor de la noria y un paisaje desértico.",
      "ملعب من 18 حفرة عند سفح الأطلس، بثلاثة أجواء: حدائق مزهرة، أحواض حول الناعورة ومشهد صحراوي.",
    ],
    alt: ["Un parcours de golf bordé de palmiers", "A golf course lined with palm trees", "Un campo de golf bordeado de palmeras", "ملعب غولف تحيط به أشجار النخيل"],
    image: img("golf-noria.jpg"),
    credit: "Michael Mitrakos / Unsplash",
    websiteUrl: "https://www.madaefgolfs.com/nos-golfs/noria-golf-club-marrakech/",
    mapsQuery: "Noria Golf Club Marrakech, Km 5 rue de Tahanaout",
  },
  {
    slug: "golf-montgomerie",
    category: "golf",
    minutes: 9,
    name: ["The Montgomerie Marrakech", "The Montgomerie Marrakech", "The Montgomerie Marrakech", "ذا مونتغمري مراكش"],
    description: [
      "Dix-huit trous signés Colin Montgomerie sur 75 hectares, avec vue sur l'Atlas et la Koutoubia.",
      "Eighteen holes by Colin Montgomerie across 75 hectares, with views of the Atlas and the Koutoubia.",
      "Dieciocho hoyos firmados por Colin Montgomerie en 75 hectáreas, con vistas al Atlas y a la Kutubía.",
      "ثماني عشرة حفرة من تصميم كولن مونتغمري على 75 هكتارًا، مع إطلالة على الأطلس والكتبية.",
    ],
    alt: ["Un green au soleil couchant, montagnes au loin", "A green in the evening sun, mountains beyond", "Un green al atardecer, montañas al fondo", "ملعب غولف عند الغروب والجبال في الأفق"],
    image: img("golf-montgomerie.jpg"),
    credit: "Matthew McBrayer / Unsplash",
    websiteUrl: "https://www.prestigiagolf.com/montgomerie-marrakech-golf/presentation",
    mapsQuery: "The Montgomerie Marrakech, Avenue Guemassa",
  },
  {
    slug: "laser-game",
    category: "loisirs",
    minutes: 7,
    name: ["Laser Games Marrakech", "Laser Games Marrakech", "Laser Games Marrakech", "ليزر غيمز مراكش"],
    description: [
      "Un labyrinthe de 480 m² plongé dans la lumière noire, des parties de 20 minutes entre amis ou en famille, et une salle de jeux.",
      "A 480 m² maze under black light, 20-minute games with friends or family, and a games room.",
      "Un laberinto de 480 m² con luz negra, partidas de 20 minutos entre amigos o en familia, y una sala de juegos.",
      "متاهة مساحتها 480 م² تحت الضوء الأسود، جولات من 20 دقيقة مع الأصدقاء أو العائلة، وقاعة ألعاب.",
    ],
    alt: ["Une salle de jeux aux néons", "A neon-lit games hall", "Una sala de juegos con neones", "قاعة ألعاب بأضواء النيون"],
    image: img("laser-game.jpg"),
    credit: "Adhitya Sibikumar / Unsplash",
    websiteUrl: "https://lasergames.ma/",
    mapsQuery: "Laser games Marrakech, Rte d'Ourika",
  },
  {
    slug: "karting",
    category: "loisirs",
    minutes: 6,
    name: ["Marrakech Kart Racing", "Marrakech Kart Racing", "Marrakech Kart Racing", "مراكش كارت ريسينغ"],
    description: [
      "Une piste en plein air, des karts pour adultes et pour enfants, et des karts biplaces pour rouler avec les plus petits.",
      "An open-air track, karts for adults and children, and two-seaters to drive with the little ones.",
      "Una pista al aire libre, karts para adultos y niños, y karts biplaza para conducir con los más pequeños.",
      "حلبة في الهواء الطلق، سيارات كارت للكبار والصغار، وسيارات بمقعدين للقيادة مع الأطفال.",
    ],
    alt: ["Un kart sur la piste", "A kart on the track", "Un kart en la pista", "سيارة كارت على الحلبة"],
    image: img("karting.jpg"),
    credit: "Nicolas Peyrol / Unsplash",
    websiteUrl: "https://www.marrakechgrandprix.com/marrakech-kart-racing/",
    mapsQuery: "Marrakech Kart Racing, Route de l'Ourika",
  },
  {
    slug: "padel",
    category: "loisirs",
    minutes: 3,
    name: ["Padel Square Marrakech", "Padel Square Marrakech", "Padel Square Marrakech", "بادل سكوير مراكش"],
    description: [
      "Des terrains récents à trois minutes de la villa, avec club-house et terrasse, pour une partie le matin avant la piscine.",
      "New courts three minutes from the villa, with a club house and terrace, for a morning game before the pool.",
      "Pistas nuevas a tres minutos de la villa, con club social y terraza, para un partido por la mañana antes de la piscina.",
      "ملاعب حديثة على بعد ثلاث دقائق من الفيلا، مع نادٍ وتراس، لمباراة صباحية قبل المسبح.",
    ],
    alt: ["Une raquette de padel sur le court", "A padel racket on court", "Una pala de pádel en la pista", "مضرب بادل في الملعب"],
    image: img("padel.jpg"),
    credit: "Manuel Pappacena / Unsplash",
    websiteUrl: "",
    mapsQuery: "Padel Square Marrakech, Complexe commercial Cherifa",
  },
  {
    slug: "oasiria",
    category: "aquatique",
    minutes: 5,
    name: ["Oasiria Water Park", "Oasiria Water Park", "Oasiria Water Park", "حديقة أوازيريا المائية"],
    description: [
      "Le premier parc aquatique du Maroc : dix hectares de jardins, la plus grande piscine à vagues d'Afrique et une vingtaine d'attractions.",
      "Morocco's first water park: ten hectares of gardens, Africa's largest wave pool and some twenty attractions.",
      "El primer parque acuático de Marruecos: diez hectáreas de jardines, la mayor piscina de olas de África y una veintena de atracciones.",
      "أول حديقة مائية في المغرب: عشرة هكتارات من الحدائق، أكبر مسبح أمواج في إفريقيا وحوالي عشرين لعبة.",
    ],
    alt: ["Toboggans et palmiers dans un parc aquatique", "Slides and palm trees in a water park", "Toboganes y palmeras en un parque acuático", "زلاجات مائية ونخيل في حديقة مائية"],
    image: img("oasiria.jpg"),
    credit: "Meg von Haartman / Unsplash",
    websiteUrl: "https://oasiria.com/",
    mapsQuery: "Oasiria Water Park Marrakech, Km 4 Route d'Amizmiz",
  },
  {
    slug: "eden-aquapark",
    category: "aquatique",
    minutes: 9,
    name: ["Eden Aquapark", "Eden Aquapark", "Eden Aquapark", "إيدن أكوابارك"],
    description: [
      "Un parc familial au cadre verdoyant : dix-neuf toboggans et attractions, une rivière, une plage pour les enfants et un snack.",
      "A family park in green surroundings: nineteen slides and rides, a lazy river, a children's beach and a snack bar.",
      "Un parque familiar en un entorno verde: diecinueve toboganes y atracciones, un río, una playa infantil y un bar.",
      "حديقة عائلية وسط الخضرة: تسع عشرة زلاجة ولعبة، نهر، شاطئ للأطفال ومطعم خفيف.",
    ],
    alt: ["Les toboggans d'un parc aquatique", "The slides of a water park", "Los toboganes de un parque acuático", "زلاجات حديقة مائية"],
    image: img("eden-aquapark.jpg"),
    credit: "Konrad Burdyn / Unsplash",
    websiteUrl: "https://www.facebook.com/edenaquapark/",
    mapsQuery: "Eden Aquapark Marrakech",
  },
  {
    slug: "urban-parc",
    category: "loisirs",
    minutes: 6,
    name: ["Urban Parc Marrakech", "Urban Parc Marrakech", "Urban Parc Marrakech", "أوربان بارك مراكش"],
    description: [
      "Le nouveau parc de loisirs de la route d'Amizmiz, pensé pour les familles et les enfants.",
      "The new leisure park on the Amizmiz road, designed for families and children.",
      "El nuevo parque de ocio de la carretera de Amizmiz, pensado para familias y niños.",
      "حديقة الترفيه الجديدة على طريق أمزميز، مصممة للعائلات والأطفال.",
    ],
    alt: ["Un espace de jeux et de trampolines", "A play and trampoline area", "Un espacio de juegos y camas elásticas", "فضاء ألعاب وترامبولين"],
    image: img("urban-parc.jpg"),
    credit: "Lawrence Crayton / Unsplash",
    websiteUrl: "https://urbanparcmaroc.com/",
    mapsQuery: "URBAN PARC MARRAKECH, Douar Bengaoui",
  },
  {
    slug: "frikis",
    category: "restauration",
    minutes: 3,
    name: ["Atlas Cherifia by Frikiss", "Atlas Cherifia by Frikiss", "Atlas Cherifia by Frikiss", "أطلس الشريفية باي فريكيس"],
    description: [
      "Une adresse marocaine généreuse : grillades choisies à la boucherie et cuites devant vous, tanjia et tajines, dans une grande salle familiale.",
      "A generous Moroccan place: meat chosen at the butcher's counter and grilled in front of you, tanjia and tagines, in a big family dining room.",
      "Un restaurante marroquí generoso: carne elegida en la carnicería y asada ante usted, tanjia y tajines, en un gran comedor familiar.",
      "مطعم مغربي سخي: لحوم تختارونها من الجزارة وتُشوى أمامكم، طنجية وطواجن، في قاعة عائلية واسعة.",
    ],
    alt: ["Des brochettes sur le grill", "Skewers on the grill", "Brochetas en la parrilla", "أسياخ مشوية على الفحم"],
    image: img("frikis.jpg"),
    credit: "Hamid Roshaan / Unsplash",
    websiteUrl: "",
    mapsQuery: "Atlas Cherifia By Frikiss, Marrakech",
  },
  {
    slug: "mcdonalds",
    category: "restauration",
    minutes: 6,
    name: ["McDonald's", "McDonald's", "McDonald's", "ماكدونالدز"],
    description: [
      "Pour un repas rapide qui met tout le monde d'accord, surtout les enfants.",
      "For a quick meal everyone agrees on, children most of all.",
      "Para una comida rápida que pone a todos de acuerdo, sobre todo a los niños.",
      "لوجبة سريعة يتفق عليها الجميع، خاصة الأطفال.",
    ],
    alt: ["Un burger et des frites", "A burger and fries", "Una hamburguesa con patatas", "برغر وبطاطس مقلية"],
    image: img("mcdonalds.jpg"),
    credit: "Jonathan Borba / Unsplash",
    websiteUrl: "https://www.mcdonalds.ma/",
    mapsQuery: "McDonald's J253+HCW Marrakech",
  },
  {
    slug: "kfc",
    category: "restauration",
    minutes: 6,
    name: ["KFC", "KFC", "KFC", "كنتاكي"],
    description: [
      "Le poulet frit croustillant, sur place ou à emporter pour un soir à la villa.",
      "Crispy fried chicken, eat in or take away for an evening at the villa.",
      "Pollo frito crujiente, para comer allí o llevar a la villa.",
      "دجاج مقلي مقرمش، في المطعم أو سفري لأمسية في الفيلا.",
    ],
    alt: ["Du poulet frit dans un panier", "Fried chicken in a basket", "Pollo frito en una cesta", "دجاج مقلي في سلة"],
    image: img("kfc.jpg"),
    credit: "Erik Mclean / Unsplash",
    websiteUrl: "",
    mapsQuery: "KFC, Av. du 7ème Art, Marrakech",
  },
];

async function main() {
  const db = scriptClient();
  let position = (await db.activity.aggregate({ _max: { position: true } }))._max.position ?? 0;
  let created = 0;
  for (const a of ACTIVITIES) {
    if (await db.activity.findUnique({ where: { slug: a.slug } })) continue;
    position += 1;
    await db.activity.create({
      data: {
        slug: a.slug,
        position,
        category: a.category,
        minutes: a.minutes,
        nameFr: a.name[0],
        nameEn: a.name[1],
        nameEs: a.name[2],
        nameAr: a.name[3],
        descriptionFr: a.description[0],
        descriptionEn: a.description[1],
        descriptionEs: a.description[2],
        descriptionAr: a.description[3],
        imageUrl: a.image,
        altFr: a.alt[0],
        altEn: a.alt[1],
        altEs: a.alt[2],
        altAr: a.alt[3],
        imageCredit: a.credit,
        websiteUrl: a.websiteUrl,
        mapsQuery: a.mapsQuery,
      },
    });
    created += 1;
  }
  console.log(`Created ${created} activities (${await db.activity.count()} in total).`);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
