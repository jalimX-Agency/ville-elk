import type { Locale } from "@/lib/i18n/locales";

/**
 * The legal notice and the privacy policy, in the four languages. They live in
 * the code rather than in the dashboard: they change rarely, and a change is a
 * decision to take with care, not a wording tweak.
 *
 * {email}, {phone} and {address} are filled in from the owner's settings when
 * the page is rendered, so a new number never leaves an old one here.
 */
export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalDoc = {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalCopy = {
  eyebrow: string;
  updated: string;
  contents: string;
  seeAlso: string;
  legal: LegalDoc;
  privacy: LegalDoc;
};

/** The day the texts below were last changed. */
export const LEGAL_UPDATED = "2026-09-29";

export const LEGAL: Record<Locale, LegalCopy> = {
  fr: {
    eyebrow: "Informations légales",
    updated: "Dernière mise à jour",
    contents: "Sommaire",
    seeAlso: "À lire aussi",
    legal: {
      title: "Mentions légales",
      description:
        "Mentions légales du site villaelk.com : éditeur, hébergement, propriété intellectuelle et droit applicable pour Villa Elk, villa privée à Marrakech.",
      intro:
        "Qui publie ce site, qui l'héberge, et les règles qui s'appliquent à son utilisation.",
      sections: [
        {
          heading: "Éditeur du site",
          paragraphs: [
            "Le site villaelk.com est édité par Villa Elk, villa privée de location saisonnière située {address}.",
            "Email : {email} — Téléphone et WhatsApp : {phone}.",
            "Directeur de la publication : le propriétaire de Villa Elk.",
          ],
        },
        {
          heading: "Hébergement",
          paragraphs: [
            "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).",
            "Les photographies sont stockées chez Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (cloudflare.com).",
          ],
        },
        {
          heading: "Propriété intellectuelle",
          paragraphs: [
            "Les textes, photographies, le logo et la mise en page de ce site appartiennent à Villa Elk, sauf mention contraire. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.",
            "Les noms et marques des lieux présentés sur la page Activités appartiennent à leurs propriétaires respectifs.",
          ],
        },
        {
          heading: "Informations et réservations",
          paragraphs: [
            "Les tarifs, disponibilités et services présentés sur le site sont donnés à titre indicatif et peuvent évoluer.",
            "Une demande envoyée depuis le site ne vaut pas réservation : le séjour n'est réservé qu'après notre confirmation écrite, accompagnée d'une fiche de réservation qui en précise les dates, le prix et les conditions.",
          ],
        },
        {
          heading: "Liens vers d'autres sites",
          paragraphs: [
            "Le site renvoie vers des sites que nous ne contrôlons pas (lieux d'activités, Google Maps, WhatsApp, Instagram). Villa Elk n'est pas responsable de leur contenu ni de leurs pratiques.",
          ],
        },
        {
          heading: "Données personnelles",
          paragraphs: [
            "La façon dont nous traitons les informations que vous nous confiez est décrite dans notre politique de confidentialité.",
          ],
        },
        {
          heading: "Droit applicable",
          paragraphs: [
            "Le présent site et ces mentions sont soumis au droit marocain. En cas de litige, et à défaut d'accord amiable, les tribunaux de Marrakech sont compétents.",
          ],
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Comment Villa Elk utilise et protège les informations de votre demande de réservation : données collectées, durée de conservation, vos droits (loi 09-08, RGPD).",
      intro:
        "Nous ne demandons que ce qu'il faut pour répondre à votre demande et préparer votre séjour. Rien n'est vendu, rien ne sert à la publicité.",
      sections: [
        {
          heading: "Responsable du traitement",
          paragraphs: [
            "Villa Elk, {address}. Pour toute question sur vos données : {email}.",
          ],
        },
        {
          heading: "Les informations que nous recevons",
          paragraphs: [
            "Par le formulaire de réservation : votre nom, votre email, votre téléphone (facultatif), vos dates d'arrivée et de départ, le nombre d'invités et votre message.",
            "Par WhatsApp, email ou Instagram : ce que vous choisissez de nous écrire.",
            "Pour votre séjour, et seulement s'il est confirmé : les informations que la loi marocaine impose de recueillir auprès des voyageurs hébergés.",
          ],
        },
        {
          heading: "Ce que nous en faisons",
          paragraphs: [
            "Répondre à votre demande, vérifier les disponibilités, vous envoyer un accusé de réception puis votre fiche de réservation, et organiser votre séjour et les services de conciergerie que vous demandez.",
            "Ces traitements reposent sur votre demande (mesures précontractuelles et exécution du séjour) et, pour les informations sur les voyageurs, sur nos obligations légales.",
            "Nous n'envoyons pas de newsletter, ne vendons aucune donnée et n'utilisons aucun outil publicitaire.",
          ],
        },
        {
          heading: "Qui y a accès",
          paragraphs: [
            "Seule l'équipe de Villa Elk lit vos demandes. Pour fonctionner, le site s'appuie sur des prestataires techniques qui ne les utilisent pour rien d'autre : Vercel (hébergement du site), Neon (base de données), Resend (envoi des emails) et Cloudflare (stockage des photographies).",
            "Ces prestataires sont situés aux États-Unis. Ils s'engagent contractuellement à protéger les données qui leur sont confiées, notamment par les clauses contractuelles types de la Commission européenne.",
          ],
        },
        {
          heading: "Combien de temps nous les gardons",
          paragraphs: [
            "Une demande qui n'aboutit pas à un séjour est conservée au plus 3 ans après notre dernier échange, puis supprimée.",
            "Les informations d'un séjour confirmé sont conservées le temps imposé par nos obligations légales et comptables.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "Le site n'utilise ni cookie publicitaire ni outil de mesure d'audience. Votre choix de thème clair ou sombre est simplement enregistré dans votre navigateur.",
            "La carte de la page Contact est fournie par Google Maps : en l'affichant, Google peut déposer ses propres cookies, selon sa politique de confidentialité (policies.google.com).",
          ],
        },
        {
          heading: "Vos droits",
          paragraphs: [
            "Conformément à la loi marocaine n° 09-08 et, si vous résidez dans l'Union européenne, au Règlement général sur la protection des données (RGPD), vous pouvez accéder à vos données, les faire corriger ou supprimer, et vous opposer à leur utilisation.",
            "Écrivez-nous à {email} : nous répondons dans un délai d'un mois au plus.",
            "Vous pouvez aussi saisir la Commission nationale de contrôle de la protection des données à caractère personnel (CNDP, www.cndp.ma) ou, dans l'Union européenne, l'autorité de protection des données de votre pays.",
          ],
        },
        {
          heading: "Sécurité",
          paragraphs: [
            "Le site est servi exclusivement en HTTPS, et l'espace où sont lues les demandes n'est accessible qu'à l'équipe de Villa Elk, par mot de passe.",
          ],
        },
      ],
    },
  },

  en: {
    eyebrow: "Legal information",
    updated: "Last updated",
    contents: "Contents",
    seeAlso: "See also",
    legal: {
      title: "Legal notice",
      description:
        "Legal notice for villaelk.com: publisher, hosting, intellectual property and governing law for Villa Elk, a private villa in Marrakech.",
      intro: "Who publishes this site, who hosts it, and the rules that apply to its use.",
      sections: [
        {
          heading: "Publisher",
          paragraphs: [
            "villaelk.com is published by Villa Elk, a private holiday rental villa located at {address}.",
            "Email: {email} — Phone and WhatsApp: {phone}.",
            "Publication director: the owner of Villa Elk.",
          ],
        },
        {
          heading: "Hosting",
          paragraphs: [
            "The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com).",
            "Photographs are stored by Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, United States (cloudflare.com).",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "The texts, photographs, logo and layout of this site belong to Villa Elk unless stated otherwise. Any reproduction, in whole or in part, without prior written permission is prohibited.",
            "The names and trademarks of the places shown on the Activities page belong to their respective owners.",
          ],
        },
        {
          heading: "Information and bookings",
          paragraphs: [
            "Rates, availability and services shown on the site are indicative and may change.",
            "A request sent from the site is not a booking: your stay is booked only once we confirm it in writing, with a booking form setting out its dates, price and terms.",
          ],
        },
        {
          heading: "Links to other sites",
          paragraphs: [
            "The site links to sites we do not control (activity venues, Google Maps, WhatsApp, Instagram). Villa Elk is not responsible for their content or practices.",
          ],
        },
        {
          heading: "Personal data",
          paragraphs: [
            "How we handle the information you share with us is set out in our privacy policy.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "This site and this notice are governed by Moroccan law. In the event of a dispute not settled amicably, the courts of Marrakech have jurisdiction.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy policy",
      description:
        "How Villa Elk uses and protects the details of your booking request: data collected, retention, and your rights (Moroccan law 09-08, GDPR).",
      intro:
        "We only ask for what we need to answer your request and prepare your stay. Nothing is sold, nothing is used for advertising.",
      sections: [
        {
          heading: "Data controller",
          paragraphs: ["Villa Elk, {address}. For any question about your data: {email}."],
        },
        {
          heading: "What we receive",
          paragraphs: [
            "Through the booking form: your name, email, phone number (optional), arrival and departure dates, number of guests and your message.",
            "Through WhatsApp, email or Instagram: whatever you choose to write to us.",
            "For your stay, and only once it is confirmed: the guest details Moroccan law requires accommodation providers to collect.",
          ],
        },
        {
          heading: "What we use it for",
          paragraphs: [
            "To answer your request, check availability, send you an acknowledgement and then your booking form, and organise your stay and any concierge services you ask for.",
            "This rests on your request (pre-contractual steps and performing the stay) and, for guest details, on our legal obligations.",
            "We send no newsletter, sell no data and use no advertising tools.",
          ],
        },
        {
          heading: "Who can see it",
          paragraphs: [
            "Only the Villa Elk team reads your requests. To run, the site relies on technical providers that use them for nothing else: Vercel (hosting), Neon (database), Resend (sending emails) and Cloudflare (photo storage).",
            "These providers are based in the United States. They are contractually bound to protect the data entrusted to them, notably through the European Commission's standard contractual clauses.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "A request that does not lead to a stay is kept for at most 3 years after our last exchange, then deleted.",
            "Details of a confirmed stay are kept for as long as our legal and accounting obligations require.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "The site uses no advertising cookies and no audience measurement. Your choice of light or dark theme is simply saved in your browser.",
            "The map on the Contact page is provided by Google Maps: when it is displayed, Google may set its own cookies under its privacy policy (policies.google.com).",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "Under Moroccan law no. 09-08 and, if you live in the European Union, the General Data Protection Regulation (GDPR), you can access your data, have it corrected or deleted, and object to its use.",
            "Write to us at {email}: we reply within one month at most.",
            "You may also contact Morocco's data protection authority (CNDP, www.cndp.ma) or, in the European Union, the data protection authority of your country.",
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "The site is served over HTTPS only, and the area where requests are read is open to the Villa Elk team alone, behind a password.",
          ],
        },
      ],
    },
  },

  es: {
    eyebrow: "Información legal",
    updated: "Última actualización",
    contents: "Índice",
    seeAlso: "Lea también",
    legal: {
      title: "Aviso legal",
      description:
        "Aviso legal de villaelk.com: editor, alojamiento, propiedad intelectual y ley aplicable de Villa Elk, villa privada en Marrakech.",
      intro: "Quién publica este sitio, quién lo aloja y las normas que se aplican a su uso.",
      sections: [
        {
          heading: "Editor del sitio",
          paragraphs: [
            "El sitio villaelk.com es editado por Villa Elk, villa privada de alquiler vacacional situada en {address}.",
            "Email: {email} — Teléfono y WhatsApp: {phone}.",
            "Director de la publicación: el propietario de Villa Elk.",
          ],
        },
        {
          heading: "Alojamiento",
          paragraphs: [
            "El sitio está alojado por Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos (vercel.com).",
            "Las fotografías se almacenan en Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, Estados Unidos (cloudflare.com).",
          ],
        },
        {
          heading: "Propiedad intelectual",
          paragraphs: [
            "Los textos, fotografías, el logotipo y el diseño de este sitio pertenecen a Villa Elk, salvo indicación contraria. Queda prohibida su reproducción, total o parcial, sin autorización previa por escrito.",
            "Los nombres y marcas de los lugares presentados en la página Actividades pertenecen a sus respectivos propietarios.",
          ],
        },
        {
          heading: "Información y reservas",
          paragraphs: [
            "Las tarifas, la disponibilidad y los servicios presentados en el sitio son orientativos y pueden cambiar.",
            "Una solicitud enviada desde el sitio no constituye una reserva: la estancia solo queda reservada tras nuestra confirmación por escrito, acompañada de una ficha de reserva que precisa las fechas, el precio y las condiciones.",
          ],
        },
        {
          heading: "Enlaces a otros sitios",
          paragraphs: [
            "El sitio enlaza con sitios que no controlamos (lugares de actividades, Google Maps, WhatsApp, Instagram). Villa Elk no es responsable de su contenido ni de sus prácticas.",
          ],
        },
        {
          heading: "Datos personales",
          paragraphs: [
            "La forma en que tratamos la información que nos confía se describe en nuestra política de privacidad.",
          ],
        },
        {
          heading: "Ley aplicable",
          paragraphs: [
            "Este sitio y este aviso se rigen por la ley marroquí. En caso de litigio, y a falta de acuerdo amistoso, son competentes los tribunales de Marrakech.",
          ],
        },
      ],
    },
    privacy: {
      title: "Política de privacidad",
      description:
        "Cómo Villa Elk utiliza y protege los datos de su solicitud de reserva: datos recogidos, conservación y sus derechos (ley marroquí 09-08, RGPD).",
      intro:
        "Solo pedimos lo necesario para responder a su solicitud y preparar su estancia. No vendemos nada ni usamos nada con fines publicitarios.",
      sections: [
        {
          heading: "Responsable del tratamiento",
          paragraphs: ["Villa Elk, {address}. Para cualquier pregunta sobre sus datos: {email}."],
        },
        {
          heading: "La información que recibimos",
          paragraphs: [
            "Mediante el formulario de reserva: su nombre, email, teléfono (opcional), fechas de llegada y salida, número de huéspedes y su mensaje.",
            "Por WhatsApp, email o Instagram: lo que usted decida escribirnos.",
            "Para su estancia, y solo si se confirma: los datos que la ley marroquí obliga a recoger de los viajeros alojados.",
          ],
        },
        {
          heading: "Para qué la usamos",
          paragraphs: [
            "Para responder a su solicitud, comprobar la disponibilidad, enviarle un acuse de recibo y después su ficha de reserva, y organizar su estancia y los servicios de conserjería que solicite.",
            "Estos tratamientos se basan en su solicitud (medidas precontractuales y ejecución de la estancia) y, para los datos de los viajeros, en nuestras obligaciones legales.",
            "No enviamos boletines, no vendemos datos y no usamos herramientas publicitarias.",
          ],
        },
        {
          heading: "Quién tiene acceso",
          paragraphs: [
            "Solo el equipo de Villa Elk lee sus solicitudes. Para funcionar, el sitio se apoya en proveedores técnicos que no las usan para nada más: Vercel (alojamiento), Neon (base de datos), Resend (envío de emails) y Cloudflare (almacenamiento de fotografías).",
            "Estos proveedores están en Estados Unidos. Se comprometen contractualmente a proteger los datos que se les confían, en particular mediante las cláusulas contractuales tipo de la Comisión Europea.",
          ],
        },
        {
          heading: "Cuánto tiempo la conservamos",
          paragraphs: [
            "Una solicitud que no da lugar a una estancia se conserva como máximo 3 años después de nuestro último intercambio y luego se elimina.",
            "Los datos de una estancia confirmada se conservan el tiempo que exigen nuestras obligaciones legales y contables.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "El sitio no usa cookies publicitarias ni herramientas de medición de audiencia. Su elección de tema claro u oscuro simplemente se guarda en su navegador.",
            "El mapa de la página Contacto lo proporciona Google Maps: al mostrarse, Google puede instalar sus propias cookies según su política de privacidad (policies.google.com).",
          ],
        },
        {
          heading: "Sus derechos",
          paragraphs: [
            "Conforme a la ley marroquí n.º 09-08 y, si reside en la Unión Europea, al Reglamento General de Protección de Datos (RGPD), puede acceder a sus datos, rectificarlos o suprimirlos, y oponerse a su uso.",
            "Escríbanos a {email}: respondemos en un plazo máximo de un mes.",
            "También puede acudir a la autoridad marroquí de protección de datos (CNDP, www.cndp.ma) o, en la Unión Europea, a la autoridad de protección de datos de su país.",
          ],
        },
        {
          heading: "Seguridad",
          paragraphs: [
            "El sitio se sirve exclusivamente en HTTPS, y el espacio donde se leen las solicitudes solo es accesible al equipo de Villa Elk, con contraseña.",
          ],
        },
      ],
    },
  },

  ar: {
    eyebrow: "معلومات قانونية",
    updated: "آخر تحديث",
    contents: "المحتويات",
    seeAlso: "اقرأ أيضاً",
    legal: {
      title: "الإشعار القانوني",
      description:
        "الإشعار القانوني لموقع villaelk.com: الناشر، الاستضافة، الملكية الفكرية والقانون المطبق على فيلا إلك، فيلا خاصة بمراكش.",
      intro: "من ينشر هذا الموقع، ومن يستضيفه، والقواعد التي تسري على استعماله.",
      sections: [
        {
          heading: "ناشر الموقع",
          paragraphs: [
            "ينشر موقع villaelk.com من طرف فيلا إلك، فيلا خاصة للكراء السياحي توجد في {address}.",
            "البريد الإلكتروني: {email} — الهاتف وواتساب: {phone}.",
            "مدير النشر: مالك فيلا إلك.",
          ],
        },
        {
          heading: "الاستضافة",
          paragraphs: [
            "يستضيف الموقع Vercel Inc.، 440 N Barranca Ave #4133، Covina، CA 91723، الولايات المتحدة (vercel.com).",
            "تُخزَّن الصور لدى Cloudflare, Inc.، 101 Townsend St، San Francisco، CA 94107، الولايات المتحدة (cloudflare.com).",
          ],
        },
        {
          heading: "الملكية الفكرية",
          paragraphs: [
            "النصوص والصور والشعار وتصميم هذا الموقع ملك لفيلا إلك ما لم يُذكر خلاف ذلك. يُمنع أي نسخ كلي أو جزئي دون إذن كتابي مسبق.",
            "أسماء وعلامات الأماكن المعروضة في صفحة الأنشطة ملك لأصحابها.",
          ],
        },
        {
          heading: "المعلومات والحجوزات",
          paragraphs: [
            "الأسعار والتوفر والخدمات المعروضة في الموقع إرشادية وقابلة للتغيير.",
            "الطلب المرسل من الموقع لا يُعدّ حجزاً: لا تُحجز الإقامة إلا بعد تأكيدنا الكتابي، مرفقاً ببطاقة حجز تحدد التواريخ والسعر والشروط.",
          ],
        },
        {
          heading: "روابط نحو مواقع أخرى",
          paragraphs: [
            "يحيل الموقع إلى مواقع لا نتحكم فيها (أماكن الأنشطة، خرائط Google، واتساب، إنستغرام). فيلا إلك غير مسؤولة عن محتواها أو ممارساتها.",
          ],
        },
        {
          heading: "المعطيات الشخصية",
          paragraphs: ["طريقة معالجتنا للمعلومات التي تأتمنوننا عليها مبيّنة في سياسة الخصوصية."],
        },
        {
          heading: "القانون المطبق",
          paragraphs: [
            "يخضع هذا الموقع وهذا الإشعار للقانون المغربي. وفي حال نزاع يتعذر حله ودياً، تختص محاكم مراكش.",
          ],
        },
      ],
    },
    privacy: {
      title: "سياسة الخصوصية",
      description:
        "كيف تستعمل فيلا إلك معلومات طلب الحجز وتحميها: المعطيات المجمّعة، مدة الحفظ، وحقوقكم (القانون المغربي 09-08، اللائحة الأوروبية RGPD).",
      intro:
        "لا نطلب إلا ما نحتاجه للرد على طلبكم وتحضير إقامتكم. لا نبيع شيئاً ولا نستعمل شيئاً لأغراض إشهارية.",
      sections: [
        {
          heading: "المسؤول عن المعالجة",
          paragraphs: ["فيلا إلك، {address}. لأي سؤال حول معطياتكم: {email}."],
        },
        {
          heading: "المعلومات التي نتلقاها",
          paragraphs: [
            "عبر استمارة الحجز: الاسم، البريد الإلكتروني، الهاتف (اختياري)، تاريخا الوصول والمغادرة، عدد الضيوف ورسالتكم.",
            "عبر واتساب أو البريد الإلكتروني أو إنستغرام: ما تختارون كتابته لنا.",
            "من أجل إقامتكم، وفقط إذا تأكدت: المعلومات التي يفرض القانون المغربي جمعها عن النزلاء.",
          ],
        },
        {
          heading: "ما نستعملها من أجله",
          paragraphs: [
            "الرد على طلبكم، التحقق من التوفر، إرسال إشعار بالاستلام ثم بطاقة الحجز، وتنظيم إقامتكم وخدمات الكونسيرج التي تطلبونها.",
            "تستند هذه المعالجة إلى طلبكم (إجراءات ما قبل التعاقد وتنفيذ الإقامة)، وبالنسبة لمعلومات النزلاء إلى التزاماتنا القانونية.",
            "لا نرسل نشرات إخبارية، ولا نبيع أي معطيات، ولا نستعمل أي أداة إشهارية.",
          ],
        },
        {
          heading: "من يطّلع عليها",
          paragraphs: [
            "فريق فيلا إلك وحده يقرأ طلباتكم. ولكي يعمل الموقع، يعتمد على مزودين تقنيين لا يستعملونها لأي غرض آخر: Vercel (الاستضافة)، Neon (قاعدة البيانات)، Resend (إرسال الرسائل الإلكترونية) وCloudflare (تخزين الصور).",
            "يوجد هؤلاء المزودون في الولايات المتحدة، ويلتزمون تعاقدياً بحماية المعطيات المسلّمة إليهم، لا سيما عبر البنود التعاقدية النموذجية للمفوضية الأوروبية.",
          ],
        },
        {
          heading: "مدة الحفظ",
          paragraphs: [
            "الطلب الذي لا يفضي إلى إقامة يُحفظ 3 سنوات على الأكثر بعد آخر تواصل بيننا، ثم يُحذف.",
            "معلومات الإقامة المؤكدة تُحفظ طوال المدة التي تفرضها التزاماتنا القانونية والمحاسبية.",
          ],
        },
        {
          heading: "ملفات تعريف الارتباط (الكوكيز)",
          paragraphs: [
            "لا يستعمل الموقع أي كوكيز إشهارية ولا أدوات لقياس الزيارات. اختياركم للوضع الفاتح أو الداكن يُحفظ ببساطة في متصفحكم.",
            "الخريطة في صفحة التواصل مقدمة من خرائط Google: عند عرضها، قد تضع Google ملفات الكوكيز الخاصة بها وفق سياسة خصوصيتها (policies.google.com).",
          ],
        },
        {
          heading: "حقوقكم",
          paragraphs: [
            "طبقاً للقانون المغربي رقم 09-08، وللائحة العامة لحماية البيانات (RGPD) إن كنتم مقيمين في الاتحاد الأوروبي، يحق لكم الاطلاع على معطياتكم وتصحيحها أو حذفها والاعتراض على استعمالها.",
            "راسلونا على {email}: نجيب في أجل أقصاه شهر واحد.",
            "يمكنكم أيضاً اللجوء إلى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP، www.cndp.ma) أو، داخل الاتحاد الأوروبي، إلى هيئة حماية البيانات في بلدكم.",
          ],
        },
        {
          heading: "الأمان",
          paragraphs: [
            "يُقدَّم الموقع حصرياً عبر HTTPS، والفضاء الذي تُقرأ فيه الطلبات لا يدخله إلا فريق فيلا إلك بكلمة مرور.",
          ],
        },
      ],
    },
  },
};
