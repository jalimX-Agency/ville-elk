/**
 * The amenities as the owner described them (intake form, then his written
 * descriptions of 27 September), with the professional photographs. Running
 * this is safe at any time: rows are matched by slug, so re-seeding restores
 * this wording without creating copies.
 *
 *   npm run db:seed
 */
import { scriptClient } from "./client";

const img = (file: string) => `/images/villa-elk/${file}`;

const AMENITIES = [
  {
    slug: "piscine",
    position: 1,
    nameFr: "Piscine privée & terrasse",
    nameEn: "Private pool & terrace",
    nameEs: "Piscina privada y terraza",
    nameAr: "مسبح خاص وتراس",
    imageUrl: img("piscine.jpg"),
    altFr: "La piscine privée sous sa pergola",
    altEn: "The private pool under its pergola",
    altEs: "La piscina privada bajo su pérgola",
    altAr: "المسبح الخاص تحت العريشة",
  },
  {
    slug: "sta7",
    position: 2,
    nameFr: "Rooftop marocain, le Sta7",
    nameEn: "Moroccan rooftop, the Sta7",
    nameEs: "Azotea marroquí, el Sta7",
    nameAr: "السطح المغربي",
    imageUrl: img("sta7.jpg"),
    altFr: "Le salon marocain en zellige du rooftop",
    altEn: "The zellige Moroccan lounge on the rooftop",
    altEs: "El salón marroquí de zellige de la azotea",
    altAr: "الصالون المغربي بالزليج فوق السطح",
  },
  {
    slug: "hammam",
    position: 3,
    nameFr: "Spa & hammam",
    nameEn: "Spa & hammam",
    nameEs: "Spa y hammam",
    nameAr: "سبا وحمّام مغربي",
    imageUrl: img("hammam.jpg"),
    altFr: "Le hammam du spa",
    altEn: "The spa hammam",
    altEs: "El hammam del spa",
    altAr: "حمّام السبا المغربي",
  },
  {
    slug: "cinema",
    position: 4,
    nameFr: "Salle de cinéma privée",
    nameEn: "Private cinema room",
    nameEs: "Sala de cine privada",
    nameAr: "قاعة سينما خاصة",
    imageUrl: img("cinema.jpg"),
    altFr: "La salle de cinéma privée",
    altEn: "The private cinema room",
    altEs: "La sala de cine privada",
    altAr: "قاعة السينما الخاصة",
  },
  {
    slug: "gym",
    position: 5,
    nameFr: "Salle de sport sur patio",
    nameEn: "Gym onto a patio",
    nameEs: "Gimnasio con patio",
    nameAr: "قاعة رياضة على فناء",
    imageUrl: img("salle-de-sport.jpg"),
    altFr: "La salle de sport ouverte sur le patio",
    altEn: "The gym opening onto the patio",
    altEs: "El gimnasio abierto al patio",
    altAr: "قاعة الرياضة المطلة على الفناء",
  },
  {
    slug: "cuisine-ete",
    position: 6,
    nameFr: "Cuisine d'été, four à pizza & barbecue",
    nameEn: "Summer kitchen, pizza oven & barbecue",
    nameEs: "Cocina de verano, horno de pizza y barbacoa",
    nameAr: "مطبخ صيفي وفرن بيتزا وشواء",
    imageUrl: img("sta7-four-a-pizza.jpg"),
    altFr: "Le four à pizza de la cuisine d'été",
    altEn: "The pizza oven in the summer kitchen",
    altEs: "El horno de pizza de la cocina de verano",
    altAr: "فرن البيتزا في المطبخ الصيفي",
  },
  {
    slug: "espace-de-vie",
    position: 7,
    nameFr: "Espace de vie",
    nameEn: "Living space",
    nameEs: "Espacio de estar",
    nameAr: "فضاء المعيشة",
    imageUrl: img("salon-cheminee.jpg"),
    altFr: "L'espace de vie, salon européen et cheminée",
    altEn: "The living space, European lounge and fireplace",
    altEs: "El espacio de estar, salón europeo y chimenea",
    altAr: "فضاء المعيشة، الصالون الأوروبي والمدفأة",
  },
  {
    slug: "coiffure",
    position: 8,
    nameFr: "Espace coiffure",
    nameEn: "Hair salon",
    nameEs: "Espacio de peluquería",
    nameAr: "ركن الحلاقة",
    imageUrl: img("coiffure.jpg"),
    altFr: "L'espace coiffure du sous-sol",
    altEn: "The hair salon on the lower level",
    altEs: "El espacio de peluquería del sótano",
    altAr: "ركن الحلاقة في الطابق السفلي",
  },
  {
    slug: "parking",
    position: 9,
    nameFr: "Garage intérieur sécurisé",
    nameEn: "Secure indoor garage",
    nameEs: "Garaje interior seguro",
    nameAr: "مرآب داخلي آمن",
    imageUrl: img("entree-garage.jpg"),
    altFr: "L'entrée et le garage couvert",
    altEn: "The entrance and covered garage",
    altEs: "La entrada y el garaje cubierto",
    altAr: "المدخل والمرآب المغطى",
  },
  {
    slug: "climatisation",
    position: 10,
    nameFr: "Climatisation intégrale",
    nameEn: "Full air conditioning",
    nameEs: "Aire acondicionado integral",
    nameAr: "تكييف هواء شامل",
    imageUrl: null,
    altFr: null,
    altEn: null,
    altEs: null,
    altAr: null,
  },
  // Added after the owner's call of 28 September 2026; the photographs are
  // gallery shots, so the files are shared with the gallery.
  {
    slug: "domotique",
    position: 11,
    nameFr: "Maison entièrement domotisée",
    nameEn: "Fully smart home",
    nameEs: "Casa totalmente domótica",
    nameAr: "منزل ذكي بالكامل",
    imageUrl: "https://cdn.villaelk.com/galerie/rdc-32-ad0d6495.jpg",
    altFr: "L'écran de contrôle de la maison",
    altEn: "The home's control screen",
    altEs: "La pantalla de control de la casa",
    altAr: "شاشة التحكم في المنزل",
  },
  {
    slug: "wifi",
    position: 12,
    nameFr: "Wi-Fi dans toute la villa",
    nameEn: "Wi-Fi throughout the villa",
    nameEs: "Wi-Fi en toda la villa",
    nameAr: "واي فاي في كامل الفيلا",
    imageUrl: "https://cdn.villaelk.com/galerie/rdc-12-1dde4fa4.jpg",
    altFr: "Le salon européen",
    altEn: "The European lounge",
    altEs: "El salón europeo",
    altAr: "الصالون الأوروبي",
  },
  {
    slug: "cameras",
    position: 13,
    nameFr: "Caméras de surveillance",
    nameEn: "Security cameras",
    nameEs: "Cámaras de vigilancia",
    nameAr: "كاميرات مراقبة",
    imageUrl: "https://cdn.villaelk.com/galerie/exterieur-01-71ad7165.jpg",
    altFr: "La façade de Villa Elk",
    altEn: "The façade of Villa Elk",
    altEs: "La fachada de Villa Elk",
    altAr: "واجهة فيلا إلك",
  },
  {
    slug: "securite",
    position: 14,
    nameFr: "Service de sécurité",
    nameEn: "Security service",
    nameEs: "Servicio de seguridad",
    nameAr: "خدمة الأمن والحراسة",
    imageUrl: "https://cdn.villaelk.com/galerie/entree-02-8194e585.jpg",
    altFr: "L'entrée de la villa",
    altEn: "The villa's entrance",
    altEs: "La entrada de la villa",
    altAr: "مدخل الفيلا",
  },
  {
    slug: "menage",
    position: 15,
    nameFr: "Femme de ménage",
    nameEn: "Housekeeping",
    nameEs: "Servicio de limpieza",
    nameAr: "عاملة نظافة",
    imageUrl: "https://cdn.villaelk.com/galerie/suite-2-02-ce44f00f.jpg",
    altFr: "Une suite préparée pour l'arrivée",
    altEn: "A suite made up for arrival",
    altEs: "Una suite preparada para la llegada",
    altAr: "جناح مُهيّأ لاستقبالكم",
  },
  {
    slug: "chef",
    position: 16,
    nameFr: "Chef sur demande",
    nameEn: "Private chef on request",
    nameEs: "Chef bajo petición",
    nameAr: "طاهٍ عند الطلب",
    imageUrl: "https://cdn.villaelk.com/galerie/rdc-19-e73dfa11.jpg",
    altFr: "La cuisine entièrement équipée",
    altEn: "The fully equipped kitchen",
    altEs: "La cocina totalmente equipada",
    altAr: "المطبخ المجهز بالكامل",
  },
];

/**
 * Rows the owner's new descriptions retired: the barbecue now belongs to the
 * summer kitchen line, and the planted terrace was a misreading of the phone
 * pictures that the professional set does not show. The fireplace became
 * "Espace de vie" at the owner's request.
 */
const RETIRED = ["barbecue", "jardin", "cheminee"];

async function main() {
  const db = scriptClient();

  for (const amenity of AMENITIES) {
    await db.amenity.upsert({
      where: { slug: amenity.slug },
      create: amenity,
      update: amenity,
    });
  }
  const { count: retired } = await db.amenity.deleteMany({ where: { slug: { in: RETIRED } } });

  const count = await db.amenity.count();
  console.log(`Seeded ${AMENITIES.length} amenities, retired ${retired} (${count} rows in total).`);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
