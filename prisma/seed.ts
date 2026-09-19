/**
 * The content the owner confirmed in the intake form, as it stood before the
 * dashboard existed. Running this is safe at any time: rows are matched by
 * slug, so re-seeding restores the original wording without creating copies.
 *
 *   npm run db:seed
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const AMENITIES = [
  {
    slug: "piscine",
    position: 1,
    nameFr: "Piscine privée & terrasse",
    nameEn: "Private pool & terrace",
    nameEs: "Piscina privada y terraza",
    nameAr: "مسبح خاص وتراس",
    imageUrl: "/images/villa-elk/pool-terrace-day.jpg",
    altFr: "La piscine privée et sa terrasse en bois",
    altEn: "The private pool and its wooden terrace",
    altEs: "La piscina privada y su terraza de madera",
    altAr: "المسبح الخاص وتراسه الخشبي",
  },
  {
    slug: "hammam",
    position: 2,
    nameFr: "Hammam & spa",
    nameEn: "Hammam & spa",
    nameEs: "Hammam y spa",
    nameAr: "حمام مغربي وسبا",
    imageUrl: "/images/villa-elk/hammam.jpg",
    altFr: "Le hammam en pierre et laiton",
    altEn: "The hammam in stone and brass",
    altEs: "El hammam en piedra y latón",
    altAr: "الحمّام المغربي بالحجر والنحاس",
  },
  {
    slug: "gym",
    position: 3,
    nameFr: "Salle de sport",
    nameEn: "Gym",
    nameEs: "Gimnasio",
    nameAr: "قاعة رياضية",
    imageUrl: "/images/villa-elk/gym.jpg",
    altFr: "La salle de sport ouverte sur le patio de bambous",
    altEn: "The gym opening onto the bamboo patio",
    altEs: "El gimnasio abierto al patio de bambú",
    altAr: "قاعة الرياضة المطلة على فناء الخيزران",
  },
  {
    slug: "jardin",
    position: 4,
    nameFr: "Jardin & terrasse plantée",
    nameEn: "Garden & planted terrace",
    nameEs: "Jardín y terraza ajardinada",
    nameAr: "حديقة وتراس مشجّر",
    imageUrl: "/images/villa-elk/terrace-garden.jpg",
    altFr: "La terrasse plantée surplombant le patio",
    altEn: "The planted terrace above the patio",
    altEs: "La terraza ajardinada sobre el patio",
    altAr: "التراس المشجّر المطل على الفناء",
  },
  {
    slug: "cinema",
    position: 5,
    nameFr: "Salle de cinéma privée",
    nameEn: "Private cinema room",
    nameEs: "Sala de cine privada",
    nameAr: "قاعة سينما خاصة",
    imageUrl: "/images/villa-elk/cinema-lounge-red.jpg",
    altFr: "La salle de cinéma et sa banquette de velours",
    altEn: "The cinema room and its velvet daybed",
    altEs: "La sala de cine y su diván de terciopelo",
    altAr: "قاعة السينما وأريكتها المخملية",
  },
  {
    slug: "parking",
    position: 6,
    nameFr: "Garage intérieur sécurisé",
    nameEn: "Secure indoor garage",
    nameEs: "Garaje interior seguro",
    nameAr: "مرآب داخلي آمن",
    imageUrl: "/images/villa-elk/garage.jpg",
    altFr: "Le garage couvert à l'entrée de la villa",
    altEn: "The covered garage at the villa entrance",
    altEs: "El garaje cubierto en la entrada de la villa",
    altAr: "المرآب المغطى عند مدخل الفيلا",
  },
  // No photograph yet — these show as type until the shoot lands.
  {
    slug: "barbecue",
    position: 7,
    nameFr: "Coin barbecue sur la terrasse",
    nameEn: "Terrace barbecue corner",
    nameEs: "Rincón de barbacoa en la terraza",
    nameAr: "ركن للشواء على التراس",
    imageUrl: null,
    altFr: null,
    altEn: null,
    altEs: null,
    altAr: null,
  },
  {
    slug: "climatisation",
    position: 8,
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
];

async function main() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  for (const amenity of AMENITIES) {
    await db.amenity.upsert({
      where: { slug: amenity.slug },
      create: amenity,
      update: amenity,
    });
  }

  const count = await db.amenity.count();
  console.log(`Seeded ${AMENITIES.length} amenities (${count} rows in total).`);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
