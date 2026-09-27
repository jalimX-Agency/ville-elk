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

  console.log(`Seeded ${SUITES.length} suites (${await db.suite.count()} rows in total).`);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
