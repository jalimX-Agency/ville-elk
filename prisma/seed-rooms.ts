/**
 * The four suites, as the owner described them on 27 September: three upstairs,
 * each with a private balcony, and one on the ground floor. The master suite is
 * about 60 m² with a marble bathtub, dressing room and study.
 *
 * The gallery is no longer seeded from here: its photographs live on R2 and the
 * owner manages them from the dashboard.
 *
 *   npx tsx prisma/seed-rooms.ts
 */
import { scriptClient } from "./client";

const img = (file: string) => `/images/villa-elk/${file}`;

const SUITES = [
  {
    slug: "suite-parentale",
    featuresFr: ["Lit King Size", "Dressing", "Bureau avec télévision", "Baignoire en marbre", "Grande douche à l'italienne", "Balcon privé", "Cheminée", "Machine Nespresso", "Télévision", "Literie haut de gamme"],
    featuresEn: ["King-size bed", "Dressing room", "Study with television", "Marble bathtub", "Large walk-in shower", "Private balcony", "Fireplace", "Nespresso machine", "Television", "Premium bedding"],
    featuresEs: ["Cama king size", "Vestidor", "Despacho con televisión", "Bañera de mármol", "Gran ducha a ras de suelo", "Balcón privado", "Chimenea", "Máquina Nespresso", "Televisión", "Ropa de cama de alta gama"],
    featuresAr: ["سرير كبير", "غرفة ملابس", "مكتب بتلفاز", "حوض استحمام من الرخام", "دوش إيطالي واسع", "شرفة خاصة", "مدفأة", "آلة نسبريسو", "تلفاز", "أفرشة فاخرة"],
    position: 1,
    level: "+1",
    areaSqm: 60,
    nameFr: "Suite parentale",
    nameEn: "Master suite",
    nameEs: "Suite principal",
    nameAr: "الجناح الرئيسي",
    descriptionFr:
      "Un véritable appartement privé : lit King Size, dressing, bureau avec sa propre télévision, et une salle de bain avec baignoire en marbre et grande douche à l'italienne. Balcon privé et machine Nespresso.",
    descriptionEn:
      "A private apartment in its own right: king-size bed, dressing room, a study with its own television, and a bathroom with a marble bathtub and large walk-in shower. Private balcony and a Nespresso machine.",
    descriptionEs:
      "Un verdadero apartamento privado: cama king size, vestidor, despacho con su propia televisión y un baño con bañera de mármol y gran ducha a ras de suelo. Balcón privado y máquina Nespresso.",
    descriptionAr:
      "شقة خاصة قائمة بذاتها: سرير كبير، غرفة ملابس، مكتب بتلفازه الخاص، وحمّام بحوض من الرخام ودوش إيطالي واسع. شرفة خاصة وآلة نسبريسو.",
    imageUrl: img("suite-parentale.jpg"),
    altFr: "La suite parentale et son lit King Size",
    altEn: "The master suite and its king-size bed",
    altEs: "La suite principal y su cama king size",
    altAr: "الجناح الرئيسي وسريره الكبير",
  },
  {
    slug: "suite-deux",
    featuresFr: ["Salle d'eau privée", "Douche à l'italienne", "Balcon privé avec petite table", "Rangements", "Télévision", "Literie haut de gamme"],
    featuresEn: ["Private shower room", "Walk-in shower", "Private balcony with a small table", "Storage", "Television", "Premium bedding"],
    featuresEs: ["Baño privado", "Ducha a ras de suelo", "Balcón privado con mesita", "Almacenaje", "Televisión", "Ropa de cama de alta gama"],
    featuresAr: ["حمّام خاص", "دوش إيطالي", "شرفة خاصة بطاولة صغيرة", "مساحات للتخزين", "تلفاز", "أفرشة فاخرة"],
    position: 2,
    level: "+1",
    areaSqm: null,
    nameFr: "Deuxième suite",
    nameEn: "Second suite",
    nameEs: "Segunda suite",
    nameAr: "الجناح الثاني",
    descriptionFr:
      "À l'étage, avec sa salle d'eau et sa douche à l'italienne, des rangements, et un balcon privé meublé d'une petite table.",
    descriptionEn:
      "Upstairs, with its own shower room and walk-in shower, storage, and a private balcony with a small table.",
    descriptionEs:
      "En la planta alta, con su baño y ducha a ras de suelo, almacenaje y un balcón privado con una mesita.",
    descriptionAr: "في الطابق العلوي، بحمّامها ودوشها الإيطالي، ومساحات للتخزين، وشرفة خاصة بطاولة صغيرة.",
    imageUrl: img("suite-2.jpg"),
    altFr: "La deuxième suite",
    altEn: "The second suite",
    altEs: "La segunda suite",
    altAr: "الجناح الثاني",
  },
  {
    slug: "suite-trois",
    featuresFr: ["Salle d'eau privée", "Douche à l'italienne", "Balcon privé", "Rangements", "Télévision", "Literie haut de gamme"],
    featuresEn: ["Private shower room", "Walk-in shower", "Private balcony", "Storage", "Television", "Premium bedding"],
    featuresEs: ["Baño privado", "Ducha a ras de suelo", "Balcón privado", "Almacenaje", "Televisión", "Ropa de cama de alta gama"],
    featuresAr: ["حمّام خاص", "دوش إيطالي", "شرفة خاصة", "مساحات للتخزين", "تلفاز", "أفرشة فاخرة"],
    position: 3,
    level: "+1",
    areaSqm: null,
    nameFr: "Troisième suite",
    nameEn: "Third suite",
    nameEs: "Tercera suite",
    nameAr: "الجناح الثالث",
    descriptionFr:
      "À l'étage elle aussi, avec sa salle d'eau et sa douche à l'italienne, des rangements et un balcon privé.",
    descriptionEn: "Also upstairs, with its own shower room and walk-in shower, storage and a private balcony.",
    descriptionEs: "También en la planta alta, con su baño y ducha a ras de suelo, almacenaje y un balcón privado.",
    descriptionAr: "في الطابق العلوي أيضاً، بحمّامها ودوشها الإيطالي، ومساحات للتخزين وشرفة خاصة.",
    imageUrl: img("suite-3.jpg"),
    altFr: "La troisième suite",
    altEn: "The third suite",
    altEs: "La tercera suite",
    altAr: "الجناح الثالث",
  },
  {
    slug: "suite-rez-de-chaussee",
    featuresFr: ["Salle d'eau à l'italienne", "Au niveau du séjour", "À deux pas de la piscine", "Armoire", "Télévision", "Literie haut de gamme"],
    featuresEn: ["Walk-in shower room", "On the living-room level", "A few steps from the pool", "Wardrobe", "Television", "Premium bedding"],
    featuresEs: ["Baño con ducha a ras de suelo", "Al nivel del salón", "A pocos pasos de la piscina", "Armario", "Televisión", "Ropa de cama de alta gama"],
    featuresAr: ["حمّام بدوش إيطالي", "في مستوى الصالون", "على بعد خطوات من المسبح", "خزانة ملابس", "تلفاز", "أفرشة فاخرة"],
    position: 4,
    level: "0",
    areaSqm: null,
    nameFr: "Suite du rez-de-chaussée",
    nameEn: "Ground-floor suite",
    nameEs: "Suite de la planta baja",
    nameAr: "جناح الطابق الأرضي",
    descriptionFr:
      "De plain-pied, avec sa salle d'eau à l'italienne, à deux pas du séjour et de la piscine — pratique pour qui préfère éviter les escaliers.",
    descriptionEn:
      "On the ground floor, with its own walk-in shower room, a step from the living rooms and the pool — useful for anyone who would rather avoid the stairs.",
    descriptionEs:
      "En la planta baja, con su baño con ducha a ras de suelo, a dos pasos de los salones y de la piscina — práctico para quien prefiera evitar las escaleras.",
    descriptionAr:
      "في الطابق الأرضي، بحمّامها ودوشها الإيطالي، على بعد خطوات من الصالونات والمسبح — مناسبة لمن يفضّل تجنّب الدرج.",
    imageUrl: img("suite-rdc.jpg"),
    altFr: "La suite du rez-de-chaussée",
    altEn: "The ground-floor suite",
    altEs: "La suite de la planta baja",
    altAr: "جناح الطابق الأرضي",
  },
];

async function main() {
  const db = scriptClient();

  // The ground-floor room turned out to be a suite: carry the row over to its
  // new slug instead of leaving the old one behind.
  await db.suite.updateMany({
    where: { slug: "chambre-rez-de-chaussee" },
    data: { slug: "suite-rez-de-chaussee" },
  });

  for (const suite of SUITES) {
    await db.suite.upsert({ where: { slug: suite.slug }, create: suite, update: suite });
  }

  // Gallery photographs are filed by the room they were shot in; attach each
  // to its suite so the suite's page can show them. Only unassigned photos are
  // touched, so a choice made in the dashboard is never overridden.
  const PREFIX: Record<string, string> = {
    "suite-parentale-": "suite-parentale",
    "suite-2-": "suite-deux",
    "suite-3-": "suite-trois",
    "suite-rdc-": "suite-rez-de-chaussee",
  };
  let linked = 0;
  for (const [prefix, slug] of Object.entries(PREFIX)) {
    const suite = await db.suite.findUnique({ where: { slug }, select: { id: true } });
    if (!suite) continue;
    const { count } = await db.galleryImage.updateMany({
      where: { suiteId: null, imageUrl: { contains: `/galerie/${prefix}` } },
      data: { suiteId: suite.id },
    });
    linked += count;
  }

  console.log(`Seeded ${SUITES.length} suites (${await db.suite.count()} rows in total), linked ${linked} photographs.`);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
