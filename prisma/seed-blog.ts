import { scriptClient } from "./client";

/**
 * The blog's first three articles, in four languages. Only the missing ones
 * are created, so running it again never overwrites what the owner has edited.
 * Every number comes from the site itself: the rate and tourist tax from the
 * concierge page, the minutes from the activities page and Google Maps.
 */
type Lang = { title: string; excerpt: string; alt: string; body: string[] };
type Post = { slug: string; image: string; date: string; fr: Lang; en: Lang; es: Lang; ar: Lang };

const POSTS: Post[] = [
  {
    slug: "que-faire-a-marrakech-en-3-jours",
    image: "/images/activites/golf-noria.jpg",
    date: "2026-10-28",
    fr: {
      title: "Que faire à Marrakech en 3 jours quand on loge à Golf Argan",
      excerpt:
        "Un programme en trois journées : une pour la villa, une pour la médina, une pour les loisirs à moins de dix minutes de Golf Argan.",
      alt: "Un golf près de Golf Argan, à Marrakech",
      body: [
        "Trois nuits, c'est le séjour minimum chez Villa Elk, et c'est aussi la bonne durée pour voir Marrakech sans courir. Voici comment nous conseillons de les répartir quand on loge à Golf Argan, dans le quartier d'Agdal.",
        "## Jour 1 : arriver et ne rien faire",
        "L'aéroport est à 12 à 15 minutes de la villa. Installez-vous à partir de 15 h, puis profitez de la piscine privée, du hammam et du rooftop. Si vous le souhaitez, un chef peut préparer le dîner sur demande : pas besoin de ressortir le premier soir.",
        "## Jour 2 : la médina et la place Jemaa el-Fna",
        "La place Jemaa el-Fna est à environ 15 à 20 minutes en voiture. Partez le matin, avant la chaleur : souks, ruelles, jardins. Rentrez en début d'après-midi pour la piscine, et gardez le hammam pour la fin de journée. Notre [conciergerie](page:concierge) peut organiser un chauffeur ou un guide.",
        "## Jour 3 : les loisirs à côté de la villa",
        "Tout ce qui suit est à moins de dix minutes en voiture :",
        "- **Golf** : le Golf Noria et le Golf Montgomerie.",
        "- **Aquatique** : Oasiria et Eden Aquapark, pour les journées chaudes avec des enfants.",
        "- **Sport et loisirs** : karting, padel, laser game et Urban Parc.",
        "- **Se restaurer** : Frikis, à trois minutes de la villa, pour un repas sans cérémonie.",
        "Les temps de trajet, depuis la villa, sont détaillés sur la page [Activités](page:activities), avec un itinéraire Google Maps pour chaque lieu.",
        "## En résumé",
        "Un jour pour se poser, un jour pour la ville, un jour pour jouer : trois nuits suffisent. Si vous restez plus longtemps, ajoutez une excursion à la journée avec la conciergerie.",
        "Pour réserver, choisissez vos dates sur la [page de réservation](page:booking) : nous répondons sous 24 heures.",
      ],
    },
    en: {
      title: "What to do in Marrakech in 3 days when you stay at Golf Argan",
      excerpt:
        "A three-day plan: one day for the villa, one for the medina, one for the leisure spots less than ten minutes from Golf Argan.",
      alt: "A golf course near Golf Argan, in Marrakech",
      body: [
        "Three nights is the minimum stay at Villa Elk, and it is also the right length to see Marrakech without rushing. Here is how we suggest spending them when you stay at Golf Argan, in the Agdal district.",
        "## Day 1: arrive and do nothing",
        "The airport is 12 to 15 minutes from the villa. Settle in from 3 pm, then enjoy the private pool, the hammam and the rooftop. If you like, a chef can prepare dinner on request: no need to go out on the first evening.",
        "## Day 2: the medina and Jemaa el-Fna square",
        "Jemaa el-Fna square is about 15 to 20 minutes away by car. Leave in the morning, before the heat: souks, alleys, gardens. Be back early in the afternoon for the pool, and keep the hammam for the end of the day. Our [concierge](page:concierge) can arrange a driver or a guide.",
        "## Day 3: leisure next to the villa",
        "Everything below is less than ten minutes away by car:",
        "- **Golf**: Golf Noria and Golf Montgomerie.",
        "- **Water parks**: Oasiria and Eden Aquapark, for hot days with children.",
        "- **Sport and leisure**: karting, padel, laser game and Urban Parc.",
        "- **Eating out**: Frikis, three minutes from the villa, for an informal meal.",
        "Drive times from the villa are listed on the [Activities](page:activities) page, with a Google Maps route for each place.",
        "## In short",
        "One day to settle in, one for the city, one to play: three nights are enough. If you stay longer, add a day excursion with the concierge.",
        "To book, pick your dates on the [booking page](page:booking): we reply within 24 hours.",
      ],
    },
    es: {
      title: "Qué hacer en Marrakech en 3 días alojándose en Golf Argan",
      excerpt:
        "Un plan de tres días: uno para la villa, otro para la medina y otro para el ocio a menos de diez minutos de Golf Argan.",
      alt: "Un campo de golf cerca de Golf Argan, en Marrakech",
      body: [
        "Tres noches es la estancia mínima en Villa Elk, y también la duración justa para ver Marrakech sin prisas. Así le recomendamos repartirlas si se aloja en Golf Argan, en el barrio de Agdal.",
        "## Día 1: llegar y no hacer nada",
        "El aeropuerto está a 12-15 minutos de la villa. Instálese a partir de las 15 h y disfrute de la piscina privada, el hammam y la azotea. Si lo desea, un chef puede preparar la cena bajo petición: no hace falta salir la primera noche.",
        "## Día 2: la medina y la plaza Jemaa el-Fna",
        "La plaza Jemaa el-Fna está a unos 15-20 minutos en coche. Salga por la mañana, antes del calor: zocos, callejones, jardines. Vuelva a primera hora de la tarde para la piscina y reserve el hammam para el final del día. Nuestra [conserjería](page:concierge) puede organizar un chófer o un guía.",
        "## Día 3: ocio junto a la villa",
        "Todo lo siguiente está a menos de diez minutos en coche:",
        "- **Golf**: Golf Noria y Golf Montgomerie.",
        "- **Parques acuáticos**: Oasiria y Eden Aquapark, para los días de calor con niños.",
        "- **Deporte y ocio**: karting, pádel, laser game y Urban Parc.",
        "- **Comer fuera**: Frikis, a tres minutos de la villa, para una comida informal.",
        "Los tiempos de trayecto desde la villa figuran en la página [Actividades](page:activities), con una ruta de Google Maps para cada lugar.",
        "## En resumen",
        "Un día para instalarse, uno para la ciudad, uno para jugar: tres noches bastan. Si se queda más tiempo, añada una excursión de un día con la conserjería.",
        "Para reservar, elija sus fechas en la [página de reserva](page:booking): respondemos en 24 horas.",
      ],
    },
    ar: {
      title: "ماذا تفعلون في مراكش خلال 3 أيام وأنتم تقيمون في غولف أرغان",
      excerpt:
        "برنامج من ثلاثة أيام: يوم للفيلا، ويوم للمدينة العتيقة، ويوم للترفيه على بعد أقل من عشر دقائق من غولف أرغان.",
      alt: "ملعب غولف قرب غولف أرغان في مراكش",
      body: [
        "ثلاث ليالٍ هي أقل مدة إقامة في فيلا إلك، وهي أيضاً المدة المناسبة لاكتشاف مراكش دون استعجال. هكذا ننصح بتوزيعها وأنتم تقيمون في غولف أرغان بحي أكدال.",
        "## اليوم الأول: الوصول وعدم فعل أي شيء",
        "المطار يبعد عن الفيلا من 12 إلى 15 دقيقة. استقروا ابتداءً من الساعة 15:00، ثم استمتعوا بالمسبح الخاص والحمّام المغربي والسطح. وإن أردتم، يمكن لطاهٍ أن يحضّر العشاء عند الطلب، فلا حاجة للخروج في المساء الأول.",
        "## اليوم الثاني: المدينة العتيقة وساحة جامع الفنا",
        "تبعد ساحة جامع الفنا حوالي 15 إلى 20 دقيقة بالسيارة. انطلقوا في الصباح قبل الحر: أسواق وأزقة وحدائق. عودوا مطلع العصر للمسبح، واتركوا الحمّام لآخر اليوم. يمكن لـ[خدمة الكونسيرج](page:concierge) أن تنظم لكم سائقاً أو مرشداً.",
        "## اليوم الثالث: الترفيه قرب الفيلا",
        "كل ما يلي على بعد أقل من عشر دقائق بالسيارة:",
        "- **الغولف**: ملعب غولف النورية وملعب غولف مونتغمري.",
        "- **الحدائق المائية**: أواسيريا وإيدن أكوابارك، لأيام الحر مع الأطفال.",
        "- **الرياضة والترفيه**: الكارتينغ والبادل والليزر غيم وأوربان بارك.",
        "- **للأكل**: فريكيس، على بعد ثلاث دقائق من الفيلا، لوجبة بسيطة.",
        "أزمنة الوصول انطلاقاً من الفيلا مبيّنة في صفحة [الأنشطة](page:activities)، مع مسار خرائط جوجل لكل مكان.",
        "## خلاصة",
        "يوم للاستقرار، ويوم للمدينة، ويوم للّعب: ثلاث ليالٍ تكفي. وإن طالت إقامتكم، أضيفوا رحلة ليوم كامل مع الكونسيرج.",
        "للحجز، اختاروا تواريخكم في [صفحة الحجز](page:booking): نردّ خلال 24 ساعة.",
      ],
    },
  },

  {
    slug: "de-l-aeroport-marrakech-menara-a-villa-elk",
    image: "/images/villa-elk/entree-garage.jpg",
    date: "2026-10-28",
    fr: {
      title: "De l'aéroport Marrakech-Ménara à Villa Elk : 12 à 15 minutes",
      excerpt:
        "Distance, durée, transfert privé et ce qu'il faut nous envoyer avant l'arrivée : tout pour arriver à la villa sans stress.",
      alt: "L'entrée de Villa Elk à Golf Argan, Marrakech",
      body: [
        "Villa Elk est à Golf Argan Resort, dans le quartier d'Agdal. C'est l'un des avantages du lieu : l'aéroport Marrakech-Ménara est tout proche.",
        "## Distance et durée",
        "Comptez environ 6 kilomètres, soit 12 à 15 minutes en voiture selon la circulation (14 minutes d'après Google Maps pour le trajet le plus rapide). La place Jemaa el-Fna, elle, est à environ 15 à 20 minutes.",
        "## Le transfert privé",
        "Notre [conciergerie](page:concierge) organise des transferts privés depuis et vers l'aéroport, sur simple demande. Un chauffeur vous attend à l'arrivée et vous dépose à la porte de la villa. C'est la solution la plus simple après un vol, surtout à plusieurs avec des bagages.",
        "## Ce qu'il faut nous envoyer avant de partir",
        "- **Votre heure d'arrivée** à la villa, pour que l'équipe soit là.",
        "- **Votre numéro de vol**, si vous souhaitez un transfert.",
        "- **Le nombre de personnes et de valises**.",
        "Un message sur WhatsApp suffit : notre équipe parle arabe, français et anglais.",
        "## Horaires de la villa",
        "L'arrivée se fait à partir de 15 h et le départ avant 11 h. Si votre vol est plus tôt ou plus tard, précisez-le dans votre demande de réservation.",
        "## Retrouver la villa sur la carte",
        "L'adresse est Golf Argan Resort, extension, villa 2. Le Plus Code est HXFX+F99 Marrakech. Vous trouverez la carte et l'itinéraire sur la page [Contact](page:contact).",
        "Prêt à choisir vos dates ? Rendez-vous sur la [page de réservation](page:booking).",
      ],
    },
    en: {
      title: "From Marrakech-Menara Airport to Villa Elk: 12 to 15 minutes",
      excerpt:
        "Distance, travel time, private transfer and what to send us before you arrive: everything for a stress-free arrival at the villa.",
      alt: "The entrance of Villa Elk at Golf Argan, Marrakech",
      body: [
        "Villa Elk is at Golf Argan Resort, in the Agdal district. One of the advantages of the location is that Marrakech-Menara Airport is very close.",
        "## Distance and travel time",
        "Allow about 6 kilometres, or 12 to 15 minutes by car depending on traffic (14 minutes according to Google Maps for the fastest route). Jemaa el-Fna square is about 15 to 20 minutes away.",
        "## The private transfer",
        "Our [concierge](page:concierge) arranges private transfers to and from the airport, on request. A driver meets you on arrival and drops you at the villa's door. It is the simplest option after a flight, especially as a group with luggage.",
        "## What to send us before you leave",
        "- **Your arrival time** at the villa, so the team is there.",
        "- **Your flight number**, if you would like a transfer.",
        "- **The number of people and bags**.",
        "A WhatsApp message is enough: our team speaks Arabic, French and English.",
        "## The villa's times",
        "Check-in is from 3 pm and check-out is before 11 am. If your flight is earlier or later, mention it in your booking request.",
        "## Finding the villa on the map",
        "The address is Golf Argan Resort, extension, villa 2. The Plus Code is HXFX+F99 Marrakech. You will find the map and directions on the [Contact](page:contact) page.",
        "Ready to pick your dates? Go to the [booking page](page:booking).",
      ],
    },
    es: {
      title: "Del aeropuerto Marrakech-Menara a Villa Elk: de 12 a 15 minutos",
      excerpt:
        "Distancia, duración, traslado privado y qué enviarnos antes de llegar: todo para llegar a la villa sin estrés.",
      alt: "La entrada de Villa Elk en Golf Argan, Marrakech",
      body: [
        "Villa Elk está en Golf Argan Resort, en el barrio de Agdal. Una de las ventajas del lugar es que el aeropuerto Marrakech-Menara queda muy cerca.",
        "## Distancia y duración",
        "Cuente unos 6 kilómetros, es decir, de 12 a 15 minutos en coche según el tráfico (14 minutos según Google Maps por la ruta más rápida). La plaza Jemaa el-Fna está a unos 15-20 minutos.",
        "## El traslado privado",
        "Nuestra [conserjería](page:concierge) organiza traslados privados desde y hacia el aeropuerto, bajo petición. Un chófer le espera a la llegada y le deja en la puerta de la villa. Es la opción más sencilla después de un vuelo, sobre todo en grupo y con equipaje.",
        "## Qué enviarnos antes de salir",
        "- **Su hora de llegada** a la villa, para que el equipo esté allí.",
        "- **Su número de vuelo**, si desea un traslado.",
        "- **El número de personas y de maletas**.",
        "Basta un mensaje por WhatsApp: nuestro equipo habla árabe, francés e inglés.",
        "## Horarios de la villa",
        "La llegada es a partir de las 15 h y la salida antes de las 11 h. Si su vuelo es más temprano o más tarde, indíquelo en su solicitud de reserva.",
        "## Encontrar la villa en el mapa",
        "La dirección es Golf Argan Resort, extensión, villa 2. El Plus Code es HXFX+F99 Marrakech. Encontrará el mapa y la ruta en la página [Contacto](page:contact).",
        "¿Listo para elegir sus fechas? Vaya a la [página de reserva](page:booking).",
      ],
    },
    ar: {
      title: "من مطار مراكش المنارة إلى فيلا إلك: من 12 إلى 15 دقيقة",
      excerpt:
        "المسافة والمدة والنقل الخاص وما يجب إرساله إلينا قبل الوصول: كل ما تحتاجونه لوصول مريح إلى الفيلا.",
      alt: "مدخل فيلا إلك في غولف أرغان بمراكش",
      body: [
        "توجد فيلا إلك في منتجع غولف أرغان بحي أكدال. ومن مزايا المكان أن مطار مراكش المنارة قريب جداً.",
        "## المسافة والمدة",
        "احسبوا حوالي 6 كيلومترات، أي من 12 إلى 15 دقيقة بالسيارة حسب حركة السير (14 دقيقة حسب خرائط جوجل للمسار الأسرع). أما ساحة جامع الفنا فتبعد حوالي 15 إلى 20 دقيقة.",
        "## النقل الخاص",
        "تنظم [خدمة الكونسيرج](page:concierge) نقلاً خاصاً من المطار وإليه عند الطلب. يستقبلكم سائق عند الوصول ويوصلكم إلى باب الفيلا. وهو الحل الأبسط بعد الرحلة الجوية، خاصة للمجموعات التي تحمل أمتعة.",
        "## ما يجب إرساله إلينا قبل السفر",
        "- **وقت وصولكم** إلى الفيلا، ليكون الفريق في انتظاركم.",
        "- **رقم رحلتكم**، إن رغبتم في خدمة النقل.",
        "- **عدد الأشخاص والحقائب**.",
        "تكفي رسالة واتساب: فريقنا يتحدث العربية والفرنسية والإنجليزية.",
        "## مواعيد الفيلا",
        "الوصول ابتداءً من الساعة 15:00 والمغادرة قبل الساعة 11:00. وإذا كانت رحلتكم أبكر أو أبعد من ذلك، اذكروا هذا في طلب الحجز.",
        "## الفيلا على الخريطة",
        "العنوان: منتجع غولف أرغان، التوسعة، فيلا 2. والـ Plus Code هو HXFX+F99 Marrakech. ستجدون الخريطة والمسار في صفحة [التواصل](page:contact).",
        "هل أنتم مستعدون لاختيار تواريخكم؟ تفضلوا إلى [صفحة الحجز](page:booking).",
      ],
    },
  },

  {
    slug: "louer-une-villa-a-marrakech-pour-10-personnes",
    image: "/images/villa-elk/piscine-terrasse.jpg",
    date: "2026-10-28",
    fr: {
      title: "Louer une villa à Marrakech pour 10 personnes : le calcul",
      excerpt:
        "3 700 DH la nuit pour toute la villa, 4 suites, jusqu'à 10 invités : voici ce que cela représente par personne, et ce qui est inclus.",
      alt: "La piscine privée et la terrasse de Villa Elk",
      body: [
        "Partir à dix, en famille ou entre amis, change le calcul : une villa entière coûte souvent moins cher par personne que plusieurs chambres d'hôtel, et vous avez la maison pour vous seuls. Voici les chiffres de Villa Elk, sans surprise.",
        "## Le prix, nuit par nuit",
        "Le tarif part de **3 700 DH la nuit** (environ 350 €) pour toute la villa. À cela s'ajoute la taxe de séjour : **31 DH par personne et par nuit** (environ 3 €). Le séjour minimum est de 3 nuits.",
        "## Un exemple : 10 personnes, 3 nuits",
        "- Location : 3 × 3 700 = **11 100 DH**.",
        "- Taxe de séjour : 31 × 10 × 3 = **930 DH**.",
        "- Total : **12 030 DH**, soit environ **1 203 DH par personne** pour les trois nuits (environ 115 €).",
        "Plus vous restez de nuits, plus le prix par personne et par nuit baisse, puisque le tarif de la villa ne change pas avec le nombre d'invités. Avec 6 personnes, la même villa revient à environ 648 DH par personne et par nuit, taxe comprise.",
        "## Ce que comprend la villa",
        "- **4 suites** réparties sur plusieurs niveaux, dont une suite parentale d'environ 60 m².",
        "- **Une piscine privée**, un hammam, une salle de cinéma et une salle de sport.",
        "- **Un rooftop marocain** avec four à pizza et barbecue.",
        "- Wifi, climatisation, maison domotisée, caméras de sécurité et femme de ménage.",
        "- **Un chef privé sur demande**, ainsi que les transferts et excursions via la [conciergerie](page:concierge).",
        "## Arrivée et départ",
        "Arrivée à partir de 15 h, départ avant 11 h. Notre équipe parle arabe, français et anglais.",
        "## Comment réserver",
        "Choisissez vos dates sur la [page de réservation](page:booking) : le calendrier montre les nuits déjà prises. Nous répondons sous 24 heures avec le tarif et les disponibilités. Vous voulez voir les chambres avant ? Découvrez les [suites](page:suites).",
      ],
    },
    en: {
      title: "Renting a villa in Marrakech for 10 people: the maths",
      excerpt:
        "3,700 MAD a night for the whole villa, 4 suites, up to 10 guests: here is what that means per person, and what is included.",
      alt: "The private pool and terrace of Villa Elk",
      body: [
        "Travelling as ten, with family or friends, changes the maths: a whole villa often costs less per person than several hotel rooms, and the house is yours alone. Here are Villa Elk's figures, with no surprises.",
        "## The price, night by night",
        "The rate starts at **3,700 MAD a night** (about €350) for the whole villa. Tourist tax is added: **31 MAD per person per night** (about €3). The minimum stay is 3 nights.",
        "## An example: 10 people, 3 nights",
        "- Rental: 3 × 3,700 = **11,100 MAD**.",
        "- Tourist tax: 31 × 10 × 3 = **930 MAD**.",
        "- Total: **12,030 MAD**, or about **1,203 MAD per person** for the three nights (about €115).",
        "The longer you stay, the lower the price per person per night, since the villa's rate does not change with the number of guests. With 6 people, the same villa comes to about 648 MAD per person per night, tax included.",
        "## What the villa includes",
        "- **4 suites** over several levels, including a master suite of about 60 m².",
        "- **A private pool**, a hammam, a cinema room and a gym.",
        "- **A Moroccan rooftop** with a pizza oven and barbecue.",
        "- Wifi, air conditioning, home automation, security cameras and housekeeping.",
        "- **A private chef on request**, plus transfers and excursions through the [concierge](page:concierge).",
        "## Arrival and departure",
        "Check-in from 3 pm, check-out before 11 am. Our team speaks Arabic, French and English.",
        "## How to book",
        "Pick your dates on the [booking page](page:booking): the calendar shows the nights already taken. We reply within 24 hours with the rate and availability. Want to see the rooms first? Discover the [suites](page:suites).",
      ],
    },
    es: {
      title: "Alquilar una villa en Marrakech para 10 personas: las cuentas",
      excerpt:
        "3.700 DH la noche por toda la villa, 4 suites, hasta 10 huéspedes: esto es lo que supone por persona y lo que incluye.",
      alt: "La piscina privada y la terraza de Villa Elk",
      body: [
        "Viajar en grupo de diez, en familia o con amigos, cambia las cuentas: una villa entera suele costar menos por persona que varias habitaciones de hotel, y la casa es solo suya. Estas son las cifras de Villa Elk, sin sorpresas.",
        "## El precio, noche a noche",
        "La tarifa parte de **3.700 DH la noche** (unos 350 €) por toda la villa. Se añade la tasa turística: **31 DH por persona y noche** (unos 3 €). La estancia mínima es de 3 noches.",
        "## Un ejemplo: 10 personas, 3 noches",
        "- Alquiler: 3 × 3.700 = **11.100 DH**.",
        "- Tasa turística: 31 × 10 × 3 = **930 DH**.",
        "- Total: **12.030 DH**, es decir, unos **1.203 DH por persona** por las tres noches (unos 115 €).",
        "Cuantas más noches se quede, menor es el precio por persona y noche, porque la tarifa de la villa no cambia con el número de huéspedes. Con 6 personas, la misma villa sale a unos 648 DH por persona y noche, tasa incluida.",
        "## Qué incluye la villa",
        "- **4 suites** repartidas en varios niveles, entre ellas una suite principal de unos 60 m².",
        "- **Una piscina privada**, un hammam, una sala de cine y un gimnasio.",
        "- **Una azotea marroquí** con horno de pizza y barbacoa.",
        "- Wifi, aire acondicionado, domótica, cámaras de seguridad y servicio de limpieza.",
        "- **Un chef privado bajo petición**, además de traslados y excursiones a través de la [conserjería](page:concierge).",
        "## Llegada y salida",
        "Llegada a partir de las 15 h, salida antes de las 11 h. Nuestro equipo habla árabe, francés e inglés.",
        "## Cómo reservar",
        "Elija sus fechas en la [página de reserva](page:booking): el calendario muestra las noches ya ocupadas. Respondemos en 24 horas con la tarifa y la disponibilidad. ¿Quiere ver las habitaciones antes? Descubra las [suites](page:suites).",
      ],
    },
    ar: {
      title: "كراء فيلا في مراكش لعشرة أشخاص: الحساب بالأرقام",
      excerpt:
        "3700 درهم لليلة للفيلا كاملة، أربعة أجنحة، حتى 10 ضيوف: هذا ما يعنيه ذلك للشخص الواحد، وهذا ما يشمله الكراء.",
      alt: "المسبح الخاص والشرفة في فيلا إلك",
      body: [
        "السفر في مجموعة من عشرة أشخاص، مع العائلة أو الأصدقاء، يغيّر الحساب: فيلا كاملة تكلّف غالباً أقل للشخص من عدة غرف في فندق، والبيت لكم وحدكم. هذه أرقام فيلا إلك بلا مفاجآت.",
        "## الثمن ليلة بليلة",
        "يبدأ السعر من **3700 درهم لليلة** (حوالي 350 يورو) للفيلا كاملة. وتضاف ضريبة الإقامة: **31 درهماً للشخص في الليلة** (حوالي 3 يورو). وأقل مدة إقامة هي 3 ليالٍ.",
        "## مثال: 10 أشخاص، 3 ليالٍ",
        "- الكراء: 3 × 3700 = **11100 درهم**.",
        "- ضريبة الإقامة: 31 × 10 × 3 = **930 درهماً**.",
        "- المجموع: **12030 درهماً**، أي حوالي **1203 دراهم للشخص** عن الليالي الثلاث (حوالي 115 يورو).",
        "كلما طالت الإقامة انخفض ثمن الليلة للشخص، لأن سعر الفيلا لا يتغير بعدد الضيوف. ومع 6 أشخاص، تكلّف الفيلا نفسها حوالي 648 درهماً للشخص في الليلة، مع الضريبة.",
        "## ماذا تشمل الفيلا",
        "- **4 أجنحة** موزعة على عدة مستويات، منها جناح رئيسي مساحته حوالي 60 متراً مربعاً.",
        "- **مسبح خاص** وحمّام مغربي وقاعة سينما وقاعة رياضة.",
        "- **سطح مغربي** بفرن بيتزا وشواء.",
        "- واي فاي وتكييف ومنزل ذكي وكاميرات مراقبة وعاملة نظافة.",
        "- **طاهٍ خاص عند الطلب**، إضافة إلى النقل والرحلات عبر [خدمة الكونسيرج](page:concierge).",
        "## الوصول والمغادرة",
        "الوصول ابتداءً من الساعة 15:00 والمغادرة قبل الساعة 11:00. ويتحدث فريقنا العربية والفرنسية والإنجليزية.",
        "## كيف تحجزون",
        "اختاروا تواريخكم في [صفحة الحجز](page:booking): يبيّن التقويم الليالي المحجوزة. نردّ خلال 24 ساعة بالسعر والتوفر. هل تودون رؤية الغرف أولاً؟ اكتشفوا [الأجنحة](page:suites).",
      ],
    },
  },
];

async function main() {
  const prisma = scriptClient();
  for (const post of POSTS) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug }, select: { id: true } });
    if (exists) {
      console.log(`  skip   ${post.slug}`);
      continue;
    }
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        published: true,
        publishedAt: new Date(`${post.date}T09:00:00Z`),
        imageUrl: post.image,
        titleFr: post.fr.title,
        titleEn: post.en.title,
        titleEs: post.es.title,
        titleAr: post.ar.title,
        excerptFr: post.fr.excerpt,
        excerptEn: post.en.excerpt,
        excerptEs: post.es.excerpt,
        excerptAr: post.ar.excerpt,
        bodyFr: post.fr.body.join("\n\n"),
        bodyEn: post.en.body.join("\n\n"),
        bodyEs: post.es.body.join("\n\n"),
        bodyAr: post.ar.body.join("\n\n"),
        altFr: post.fr.alt,
        altEn: post.en.alt,
        altEs: post.es.alt,
        altAr: post.ar.alt,
      },
    });
    console.log(`  create ${post.slug}`);
  }
}

main().then(() => process.exit(0));
