window.DU = window.DU || {};
(function () {
  const IMG = (f) => `assets/img/${f}`;
  const T = (EN, ES, FR) => ({ EN, ES: ES || '', FR: FR || '' });
  const today = new Date();
  const md = (off) => { const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + off); return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const year = today.getFullYear();

  const P = (id, no, first, last, group, pos, img, apps, goals, assists, nat, dobOff, dobYear, height, foot) => ({
    id, no, first, last, group, pos, img, nat, height: height || '', foot: foot || 'Right',
    dob: dobOff == null ? '' : `${dobYear}-${md(dobOff)}`,
    bio: T(`${first} joined Dallas United for the club’s founding season.`, `${first} llegó a Dallas United para la temporada fundacional del club.`, `${first} a rejoint Dallas United pour la saison fondatrice du club.`),
    apps, goals, assists, visible: true,
    birthCity: nat === 'USA' ? 'Dallas, Texas' : '', joined: group === 'Player' ? '2026-08-01' : '2025-11-01', instagram: group === 'Player' ? 'https://instagram.com/dallasunitedfc' : '', tiktok: ''
  });

  DU.DEFAULTS = {
    version: 25,
    settings: {
      clubName: 'Dallas United FC', shortName: 'DU', league: 'UPSL', leagueShort: 'UPSL', leagueDivision: 'Division 1', leagueFull: 'United Premier Soccer League', stadium: 'Home field (to be announced)', upslUrl: 'https://division1.upsl.com/standings/', upslConf: '',
      address: '1200 Main Street, Dallas, TX 75201', email: 'hello@dallasunitedfc.com', phone: '(214) 555-0199',
      instagram: 'https://instagram.com/dallasunitedfc', tiktok: 'https://tiktok.com/@dallasunitedfc', youtube: 'https://youtube.com/@dallasunitedfc', x: 'https://x.com/dallasunitedfc', facebook: 'https://facebook.com/dallasunitedfc',
      ticketsOn: false, ticketProvider: 'Eventbrite', ticketPage: 'https://www.eventbrite.com/', payments: 'Stripe', mailchimp: 'Dallas United fans',
      appName: 'Dallas United', countdownMatch: 'f2', founded: '2026'
    },
    posts: [
      { id: 'n1', title: T('Team news: Dallas United vs Plano FC', 'Noticias del equipo: Dallas United vs Plano FC', 'Infos d’équipe : Dallas United vs Plano FC'), cat: 'First Team', img: IMG('celebrate.jpg'), sum: T('Two changes to the starting XI as the captain returns from suspension.', 'Dos cambios en el once inicial con el regreso del capitán.', 'Deux changements dans le onze de départ avec le retour du capitaine.'), body: T('Head coach Michael Torres has named his squad for Saturday’s home game against Plano FC.\n\nThe captain returns after serving a one-match suspension, and Kenji Adams comes back into midfield after a strong week in training.\n\n“The group is hungry,” Torres said. “We know what a win at home means for this city.”\n\nKick-off is at 7:30 PM.'), status: 'Published', date: '2026-11-01', when: '', featured: true, social: { x: true, instagram: true, facebook: true, tiktok: true } },
      { id: 'n2', title: T('Open tryout dates announced for November', 'Fechas de pruebas abiertas en noviembre', 'Dates des détections ouvertes en novembre'), cat: 'Tryouts', img: IMG('training.jpg'), sum: T('Three sessions, players 18 and over, no fee.', 'Tres sesiones, jugadores mayores de 18, sin costo.', 'Trois séances, joueurs de 18 ans et plus, gratuit.'), body: T('Dallas United is building its first squad and wants to see you play. Three open sessions take place this November across Dallas.\n\nRegister online, show up with your boots, and play in front of the coaching staff.'), status: 'Published', date: '2026-10-31', when: '', featured: false, social: {} },
      { id: 'n3', title: T('Squad visits Dallas schools', 'El equipo visita escuelas de Dallas', 'L’équipe rend visite aux écoles de Dallas'), cat: 'Community', img: IMG('community.jpg'), sum: T('A morning of drills, selfies and big dreams.', 'Una mañana de ejercicios, selfies y grandes sueños.', 'Une matinée d’exercices, de selfies et de grands rêves.'), body: T('The players spent the morning with students across Oak Cliff, running drills and answering questions.'), status: 'Published', date: '2026-10-29', when: '', featured: false, social: {} },
      { id: 'n4', title: T('Fort Worth City 1–2 Dallas United: first away win', 'Fort Worth City 1–2 Dallas United: primera victoria fuera', 'Fort Worth City 1–2 Dallas United : première victoire à l’extérieur'), cat: 'First Team', img: IMG('matchday-stadium.jpg'), sum: T('Vargas and Okafor score as Dallas United come from behind.', 'Vargas y Okafor marcan en la remontada.', 'Vargas et Okafor marquent pour renverser le match.'), body: T('A first away win of the season. Mateo Vargas scored first, and Samuel Okafor curled in the winner from the edge of the box.'), status: 'Published', date: '2026-10-31', when: '', featured: false, social: {} },
      { id: 'n6', title: T('The new crest: the story behind it', 'El nuevo escudo: la historia', 'Le nouvel écusson : son histoire'), cat: 'Club', img: IMG('fans.jpg'), sum: T('The Lone Star, the DU and the Trinity River. What every part means.', 'La Estrella Solitaria, la DU y el río Trinity.', 'L’étoile solitaire, le DU et la rivière Trinity.'), body: T('The new Dallas United crest is built around our motto: together we rise.\n\nThe Lone Star stands for Texas. The DU letters are hand-drawn and belong to the club only. The three waves are the Trinity River, which runs through the city and connects every neighborhood.'), status: 'Published', date: '2026-10-28', when: '', featured: false, social: {} },
      { id: 'n5', title: T('Matchday preview: Dallas United vs Plano FC'), cat: 'First Team', img: IMG('stadium-night.jpg'), sum: T('Everything you need to know before Saturday.'), body: T(''), status: 'Scheduled', date: '', when: `${year}-11-07T09:00`, featured: false, social: { x: true, instagram: true, facebook: true } },
      { id: 'n7', title: T('Inside the new training ground'), cat: 'Club', img: IMG('tactics.jpg'), sum: T(''), body: T(''), status: 'Draft', date: '', when: '', featured: false, social: {} }
    ],
    fixtures: [
      { id: 'f0', date: '2026-10-17', time: '18:00', opp: 'Arlington Town', oppShort: 'ART', oppColor: '#6D4C41', ha: 'Home', comp: 'League', venue: 'Home field (TBA)', status: 'Full time', du: '3', op: '1', tickets: '', highlights: 'v1', scorers: 'Vargas 12’, King 40’, Okafor 77’' },
      { id: 'f1', date: '2026-10-31', time: '18:00', opp: 'Fort Worth City', oppShort: 'FWC', oppColor: '#7B1FA2', ha: 'Away', comp: 'League', venue: 'Fort Worth City Stadium', status: 'Full time', du: '2', op: '1', tickets: '', highlights: 'v1', scorers: 'Vargas 23’, Okafor 58’' },
      { id: 'f2', date: '2026-11-07', time: '19:30', opp: 'Plano FC', oppShort: 'PFC', oppColor: '#2E7D32', ha: 'Home', comp: 'League', venue: 'Home field (TBA)', status: 'Upcoming', du: '', op: '', tickets: 'https://www.eventbrite.com/', highlights: '', scorers: '' },
      { id: 'f3', date: '2026-11-14', time: '18:00', opp: 'Houston Athletic', oppShort: 'HOU', oppColor: '#E65100', ha: 'Away', comp: 'League', venue: 'Houston Athletic Park', status: 'Upcoming', du: '', op: '', tickets: '', highlights: '', scorers: '' },
      { id: 'f4', date: '2026-11-18', time: '19:00', opp: 'El Paso SC', oppShort: 'EPS', oppColor: '#00838F', ha: 'Home', comp: 'Texas Cup', venue: 'Home field (TBA)', status: 'Upcoming', du: '', op: '', tickets: 'https://www.eventbrite.com/', highlights: '', scorers: '' },
      { id: 'f5', date: '2026-11-28', time: '19:30', opp: 'San Antonio Rovers', oppShort: 'SAR', oppColor: '#455A64', ha: 'Home', comp: 'League', venue: 'Home field (TBA)', status: 'Upcoming', du: '', op: '', tickets: 'https://www.eventbrite.com/', highlights: '', scorers: '' },
      { id: 'f6', date: '2026-12-05', time: '18:00', opp: 'Waco United', oppShort: 'WAC', oppColor: '#AD1457', ha: 'Away', comp: 'League', venue: 'Waco Field', status: 'Upcoming', du: '', op: '', tickets: '', highlights: '', scorers: '' }
    ],
    table: {
      league: { title: 'UPSL Division 1 · 2026/27', rows: [['Fort Worth City', 5, 4, 0, 1, 10, 4, 12, 'WWWL'], ['Dallas United', 5, 4, 1, 0, 10, 4, 13, 'WDWW', true], ['Houston Athletic', 5, 3, 2, 0, 8, 4, 11, 'DWDW'], ['Plano FC', 5, 2, 1, 2, 6, 6, 7, 'WLDL'], ['San Antonio Rovers', 5, 2, 0, 3, 6, 7, 6, 'LWLW'], ['Arlington Town', 5, 1, 1, 3, 4, 8, 4, 'DLWL'], ['Waco United', 5, 1, 0, 4, 3, 9, 3, 'LLWL'], ['El Paso SC', 5, 0, 2, 3, 3, 11, 2, 'LDLD']].map((r, i) => ({ id: `t${i}`, name: r[0], p: r[1], w: r[2], d: r[3], l: r[4], gf: r[5], ga: r[6], pts: r[7], form: r[8], us: !!r[9] })) },
      cup: { title: 'Texas Cup · Group A', rows: [['Dallas United', 2, 2, 0, 0, 5, 1, 6, 'WW', true], ['Austin Lakes FC', 2, 1, 0, 1, 3, 2, 3, 'WL'], ['El Paso SC', 2, 1, 0, 1, 4, 4, 3, 'LW'], ['Lubbock Town', 2, 0, 0, 2, 0, 5, 0, 'LL']].map((r, i) => ({ id: `c${i}`, name: r[0], p: r[1], w: r[2], d: r[3], l: r[4], gf: r[5], ga: r[6], pts: r[7], form: r[8], us: !!r[9] })) }
    },
    people: [
      P('m1', '1', 'Diego', 'Morales', 'Player', 'Goalkeeper', IMG('p4.jpg'), 6, 0, 0, 'Mexico', 9, 1996, '1.88 m'),
      P('m13', '13', 'Ethan', 'Brooks', 'Player', 'Goalkeeper', IMG('p2.jpg'), 0, 0, 0, 'USA', null, 0, '1.90 m'),
      P('m2', '2', 'Jamal', 'Carter', 'Player', 'Defender', IMG('p1.jpg'), 6, 0, 1, 'USA', 60, 1998, '1.83 m'),
      P('m9', '3', 'Luis', 'Herrera', 'Player', 'Defender', IMG('p5.jpg'), 6, 1, 0, 'Mexico', null, 0, '1.80 m', 'Left'),
      P('m3', '4', 'Kofi', 'Mensah', 'Player', 'Defender', IMG('p3.jpg'), 5, 1, 0, 'Ghana', 40, 2000, '1.86 m'),
      P('m10', '5', 'Tyler', 'Grant', 'Player', 'Defender', IMG('p2.jpg'), 4, 0, 0, 'USA', null, 0, '1.84 m'),
      P('m14', '15', 'Andre', 'Silva', 'Player', 'Defender', IMG('p6.jpg'), 2, 0, 0, 'Brazil', null, 0, '1.79 m'),
      P('m4', '6', 'Marcus', 'Reyes', 'Player', 'Midfielder', IMG('p1.jpg'), 6, 1, 2, 'USA', null, 0, '1.77 m'),
      P('m11', '8', 'Kenji', 'Adams', 'Player', 'Midfielder', IMG('p5.jpg'), 6, 2, 1, 'USA', null, 0, '1.75 m'),
      P('m5', '10', 'Samuel', 'Okafor', 'Player', 'Midfielder', IMG('p3.jpg'), 6, 4, 1, 'Nigeria', 17, 2001, '1.78 m'),
      P('m15', '16', 'Noah', 'Bennett', 'Player', 'Midfielder', IMG('p2.jpg'), 3, 0, 0, 'USA', null, 0, '1.81 m'),
      P('m16', '20', 'Rafael', 'Ortiz', 'Player', 'Midfielder', IMG('p4.jpg'), 2, 0, 0, 'Colombia', null, 0, '1.74 m', 'Left'),
      P('m7', '7', 'Darius', 'King', 'Player', 'Forward', IMG('p6.jpg'), 6, 3, 2, 'USA', null, 0, '1.80 m'),
      P('m6', '9', 'Mateo', 'Vargas', 'Player', 'Forward', IMG('p5.jpg'), 6, 4, 1, 'Colombia', 0, 1999, '1.82 m'),
      P('m12', '11', 'Isaiah', 'Thompson', 'Player', 'Forward', IMG('p1.jpg'), 5, 1, 1, 'USA', null, 0, '1.76 m'),
      P('m8', '19', 'Leo', 'Fischer', 'Player', 'Forward', IMG('p2.jpg'), 2, 1, 0, 'USA', null, 0, '1.85 m'),
      P('st1', '', 'Michael', 'Torres', 'Staff', 'Head Coach', IMG('s1.jpg'), 0, 0, 0, 'USA', 4, 1981),
      P('st2', '', 'Andre', 'Washington', 'Staff', 'Assistant Coach', IMG('s2.jpg'), 0, 0, 0, 'USA', 23, 1985),
      P('st4', '', 'Pablo', 'Ruiz', 'Staff', 'Goalkeeper Coach', IMG('s1.jpg'), 0, 0, 0, 'Mexico', null, 0),
      P('st5', '', 'Chris', 'Doyle', 'Staff', 'Fitness Coach', IMG('s2.jpg'), 0, 0, 0, 'USA', null, 0),
      P('st7', '', '[Owner', 'name]', 'Staff', 'Owner', IMG('s1.jpg'), 0, 0, 0, '', null, 0),
      P('st8', '', '[Co-founder', 'name]', 'Staff', 'Co-Founder', IMG('s2.jpg'), 0, 0, 0, '', null, 0),
      P('st9', '', '[Co-founder', 'name]', 'Staff', 'Co-Founder', IMG('s1.jpg'), 0, 0, 0, '', null, 0),
      P('st10', '', '[Club manager', 'name]', 'Staff', 'Club Manager', IMG('s2.jpg'), 0, 0, 0, '', null, 0)
    ],
    slides: [
      { id: 'h1', img: IMG('stadium-night.jpg'), kicker: T('Season 1 · Matchday 6', 'Temporada 1 · Jornada 6', 'Saison 1 · Journée 6'), title: T('Dallas United is here', 'Dallas United ya llegó', 'Dallas United est là'), cta: T('See fixtures', 'Ver partidos', 'Voir le calendrier'), link: 'matches.html' },
      { id: 'h2', img: IMG('training.jpg'), kicker: T('Open tryouts', 'Pruebas abiertas', 'Détections ouvertes'), title: T('Think you can play?', '¿Crees que puedes jugar?', 'Tu penses pouvoir jouer ?'), cta: T('Sign up for tryouts', 'Inscríbete', 'S’inscrire'), link: 'tryouts.html' },
      { id: 'h3', img: IMG('shop-hero.jpg'), kicker: T('Kit launch', 'Nueva equipación', 'Nouveau maillot'), title: T('The first home kit', 'La primera equipación', 'Le premier maillot domicile'), cta: T('Order now', 'Comprar', 'Commander'), link: 'shop.html' },
      { id: 'h4', img: IMG('fans.jpg'), kicker: T('Founders wall', 'Muro de fundadores', 'Mur des fondateurs'), title: T('Become a founder', 'Hazte fundador', 'Deviens fondateur'), cta: T('Claim your number', 'Reclama tu número', 'Réserve ton numéro'), link: 'founders.html' }
    ],
    homeTexts: { countdownOn: true, tvPrice: '', bgWords: 'DU / DALLAS / UNITED', videoOn: true, videoUrl: 'assets/video/club-loop.mp4', videoTitle: T('Inside Dallas United'), videoText: T('The squad heads back to school: a morning of drills, selfies and big dreams with Dallas kids.'), videoImg: 'assets/video/club-loop-poster.jpg', motto: T('We are Dallas and together we rise', 'Somos Dallas y juntos nos levantamos', 'Nous sommes Dallas et ensemble nous nous élevons') },
    products: [
      { id: 'home', img: IMG('home-jersey.jpg'), imgBack: IMG('home-jersey-back.jpg'), name: T('DU Home Jersey 26/27', 'Camiseta local DU 26/27', 'Maillot domicile DU 26/27'), cat: 'Kit', price: 90, sale: '', stock: 120, isNew: true, visible: true, gift: 'superfan', preorder: true, custom: true, sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 } },
      { id: 'away', img: IMG('away-jersey.jpg'), imgBack: IMG('away-jersey-back.jpg'), name: T('DU Away Jersey 26/27', 'Camiseta visitante DU 26/27', 'Maillot extérieur DU 26/27'), cat: 'Kit', price: 90, sale: '', stock: 85, isNew: true, visible: true, gift: '', preorder: true, custom: true, sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 } },
      { id: 'third', img: IMG('third-jersey.jpg'), imgBack: IMG('third-jersey-back.jpg'), name: T('DU Third Jersey 26/27', 'Tercera camiseta DU 26/27', 'Troisième maillot DU 26/27'), cat: 'Kit', price: 90, sale: '', stock: 60, isNew: true, visible: true, gift: '', preorder: true, custom: true, sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 } },
      { id: 'gk', img: IMG('gk-jersey.jpg'), imgBack: IMG('gk-jersey-back.jpg'), name: T('Goalkeeper Jersey 26/27', 'Camiseta de portero 26/27', 'Maillot gardien 26/27'), cat: 'Kit', price: 90, sale: '', stock: 24, isNew: false, visible: true, gift: '', custom: true },
      { id: 'kids', img: IMG('kids-home.jpg'), imgBack: IMG('kids-home-back.jpg'), name: T('Kids Home Jersey 26/27', 'Camiseta local niños 26/27', 'Maillot domicile enfant 26/27'), cat: 'Youth', price: 65, sale: '', stock: 70, isNew: false, visible: true, gift: 'kids', custom: true },
      { id: 'qzip', img: IMG('training-top.jpg'), name: T('Training Quarter-Zip', 'Sudadera de entrenamiento', 'Haut d’entraînement zippé'), cat: 'Kit', price: 70, sale: '', stock: 40, isNew: true, visible: true, gift: '' },
      { id: 'tee', img: IMG('training-tee.jpg'), name: T('Training Tee', 'Camiseta de entrenamiento', 'T-shirt d’entraînement'), cat: 'Kit', price: 45, sale: '', stock: 60, isNew: false, visible: true, gift: '' },
      { id: 'hoodie', img: IMG('hoodie.jpg'), name: T('Crest Hoodie', 'Sudadera con escudo', 'Sweat à capuche écusson'), cat: 'Lifestyle', price: 65, sale: '', stock: 50, isNew: false, visible: true, gift: '' },
      { id: 'scarf', img: IMG('scarf.jpg'), name: T('Founders Scarf', 'Bufanda fundadores', 'Écharpe des fondateurs'), cat: 'Accessories', price: 25, sale: '', stock: 300, isNew: true, visible: true, gift: 'under30' },
      { id: 'cap', img: IMG('cap.jpg'), name: T('DU Cap', 'Gorra DU', 'Casquette DU'), cat: 'Hats', price: 30, sale: '', stock: 90, isNew: false, visible: true, gift: 'under30' },
      { id: 'beanie', img: IMG('beanie.jpg'), name: T('DU Beanie', 'Gorro DU', 'Bonnet DU'), cat: 'Hats', price: 28, sale: '', stock: 80, isNew: true, visible: true, gift: 'under30' },
      { id: 'mug', img: IMG('mug.jpg'), name: T('Crest Mug', 'Taza con escudo', 'Mug écusson'), cat: 'Accessories', price: 18, sale: '', stock: 120, isNew: false, visible: true, gift: 'under30' },
      { id: 'tote', img: IMG('tote.jpg'), name: T('DU Tote Bag', 'Bolsa DU', 'Tote bag DU'), cat: 'Accessories', price: 22, sale: '', stock: 70, isNew: false, visible: true, gift: '' },
      { id: 'bottle', img: IMG('bottle.jpg'), name: T('Water Bottle', 'Botella de agua', 'Gourde'), cat: 'Accessories', price: 24, sale: '', stock: 100, isNew: false, visible: true, gift: 'under30' },
      { id: 'flag', img: IMG('flag.jpg'), name: T('Matchday Flag', 'Bandera', 'Drapeau'), cat: 'Accessories', price: 35, sale: '', stock: 40, isNew: false, visible: true, gift: '' },
      { id: 'phone', img: IMG('phone-case.jpg'), name: T('DU Phone Case', 'Funda DU', 'Coque DU'), cat: 'Accessories', price: 26, sale: '', stock: 60, isNew: false, visible: true, gift: '' },
      { id: 'pin', img: IMG('pin-sticker.jpg'), name: T('Crest Pin & Sticker', 'Pin y pegatina', 'Pin’s et sticker'), cat: 'Accessories', price: 12, sale: '', stock: 200, isNew: false, visible: true, gift: 'under30' },
      { id: 'f-tee-cream', img: IMG('f-tee-cream-front.jpg'), imgBack: IMG('f-tee-cream-back.jpg'), name: T('Founders Tee · Cream', 'Camiseta fundadores · Crema', 'T-shirt fondateurs · Crème'), cat: 'Lifestyle', price: 40, sale: '', stock: 300, isNew: true, visible: true, gift: '', founders: true, numbered: true },
      { id: 'f-tee-black', img: IMG('f-tee-black-front.jpg'), imgBack: IMG('f-tee-black-back.jpg'), name: T('Founders Tee · Black', 'Camiseta fundadores · Negra', 'T-shirt fondateurs · Noir'), cat: 'Lifestyle', price: 40, sale: '', stock: 300, isNew: true, visible: true, gift: '', founders: true, numbered: true },
      { id: 'f-polo', img: IMG('f-polo-navy.jpg'), name: T('Founders Polo · Navy', 'Polo fundadores · Marino', 'Polo fondateurs · Marine'), cat: 'Lifestyle', price: 55, sale: '', stock: 150, isNew: true, visible: true, gift: '', founders: true },
      { id: 'f-cap', img: IMG('f-cap-black.jpg'), name: T('Founders Cap · Black', 'Gorra fundadores · Negra', 'Casquette fondateurs · Noire'), cat: 'Hats', price: 32, sale: '', stock: 200, isNew: true, visible: true, gift: '', founders: true },
      { id: 'f-scarf', img: IMG('f-scarf-cream.jpg'), name: T('Founders Scarf · Cream', 'Bufanda fundadores · Crema', 'Écharpe fondateurs · Crème'), cat: 'Accessories', price: 28, sale: '', stock: 300, isNew: true, visible: true, gift: '', founders: true }
    ],
    shopTexts: { peekOn: true, peekMain: IMG('kit-home-full.jpg'), peekLeft: IMG('scarf.jpg'), peekRight: IMG('hoodie.jpg'), peekKicker: T('Home kit 26/27', 'Equipación local 26/27', 'Maillot domicile 26/27'), peekTitle: T('Wear the crest', 'Viste el escudo', 'Porte l’écusson'), peekLine: T('Navy, gold and the Trinity. Made for Saturday nights in Dallas.', 'Azul marino, oro y el Trinity. Hecha para los sábados en Dallas.', 'Marine, or et la Trinity. Faite pour les samedis soir à Dallas.'),
      collectionOn: true, collectionTitle: T('Founders collection', 'Colección fundadores', 'Collection des fondateurs'), shopUrl: '', newTab: true, preorderEnds: '2026-12-15', preorderShip: T('Ships in February 2027', 'Se envía en febrero de 2027', 'Expédié en février 2027'), customMax: 12, extraPct: 10, pickupPlace: T('Pick up free at training or at a home match', 'Recógelo gratis en el entrenamiento o en un partido en casa', 'Retrait gratuit à l’entraînement ou à un match à domicile'), 
      heroImg: IMG('shop-hero.jpg'), heroKicker: T('New collection · 26/27', 'Nueva colección · 26/27', 'Nouvelle collection · 26/27'), heroTitle: T('Home kit 26/27', 'Equipación local 26/27', 'Maillot domicile 26/27'), personalisePrice: 15, personaliseOn: false, collectionImg: IMG('f-tee-cream-back.jpg'), freeShipOver: 100, holidayOn: false, holidayText: T('Order by December 18 for delivery before Christmas.'), holidayCutoff: `${year}-12-18`, giftWrap: true },
    sessions: [
      { id: 'ss1', date: '2026-11-14', time: '09:00', place: 'Fair Park Fields, Dallas', cap: 60, signed: 42 },
      { id: 'ss2', date: '2026-11-15', time: '09:00', place: 'Fair Park Fields, Dallas', cap: 60, signed: 34 },
      { id: 'ss3', date: '2026-11-21', time: '10:00', place: 'Kiest Park, Dallas', cap: 48, signed: 8 }
    ],
    tryTexts: { open: true, minAge: 18, fee: 0, feeNote: T('Payment details follow by email.'), venue: 'Fair Park Fields, Dallas', ageText: T('18 and older'), waiverOn: true, heroImg: IMG('training.jpg'), intro: T('Dallas United is building its first squad. Three sessions this November. Players 18 and over. No agent, no fee, just your boots.', 'Dallas United está formando su primer equipo. Tres sesiones en noviembre. Jugadores mayores de 18. Sin agente, sin costo, solo tus botas.', 'Dallas United construit sa première équipe. Trois séances en novembre. Joueurs de 18 ans et plus. Pas d’agent, pas de frais, juste tes crampons.') },
    steps: [
      { id: 'st1', n: '01', title: T('Register online', 'Regístrate en línea', 'Inscris-toi en ligne'), text: T('Pick a session and fill in a two-minute form.', 'Elige una sesión y llena un formulario de dos minutos.', 'Choisis une séance et remplis un formulaire de deux minutes.') },
      { id: 'st2', n: '02', title: T('Show up and play', 'Ven y juega', 'Viens et joue'), text: T('Warm-up, drills, then games in front of the coaches.', 'Calentamiento, ejercicios y partidos frente a los entrenadores.', 'Échauffement, exercices, puis matchs devant les coachs.') },
      { id: 'st3', n: '03', title: T('Get the call', 'Recibe la llamada', 'Reçois l’appel'), text: T('Standouts are invited back to train with the squad.', 'Los mejores vuelven a entrenar con el equipo.', 'Les meilleurs sont invités à s’entraîner avec l’équipe.') }
    ],
    bring: [{ id: 'b1', text: T('Cleats and shin guards', 'Tacos y espinilleras', 'Crampons et protège-tibias') }, { id: 'b2', text: T('Water bottle', 'Botella de agua', 'Bouteille d’eau') }, { id: 'b3', text: T('Photo ID', 'Identificación con foto', 'Pièce d’identité') },
      { id: 'b4', text: T('Training clothes (shorts, socks, a light top)', 'Ropa de entrenamiento (short, medias, camiseta ligera)', 'Tenue d’entraînement (short, chaussettes, haut léger)') },
      { id: 'b5', text: T('Goalkeepers: your own gloves', 'Porteros: sus propios guantes', 'Gardiens : vos propres gants') },
      { id: 'b6', text: T('Turf shoes too, in case we move to the turf field', 'También zapatillas de pasto sintético, por si vamos a la cancha sintética', 'Aussi des chaussures pour synthétique, au cas où') },
      { id: 'b7', text: T('A snack or a banana for after', 'Un snack o una banana para después', 'Une collation ou une banane pour après') },
      { id: 'b8', text: T('Sunscreen and a light jacket', 'Protector solar y una chaqueta ligera', 'Crème solaire et une veste légère') },
      { id: 'b9', text: T('Your confirmation email (on your phone is fine)', 'Tu correo de confirmación (en el teléfono está bien)', 'Ton e-mail de confirmation (sur ton téléphone, c’est bon)') }],
    waivers: [
      { id: 'w1', title: T('Waiver of liability and assumption of risk'), body: T('Soccer is a contact sport. Taking part in Dallas United FC tryouts, training and related activities carries risks that cannot be removed, however careful everyone is. These range from minor injuries such as scratches, bruises and sprains, to major injuries such as joint, back and head injuries (including concussions), and in rare cases catastrophic injury, paralysis or death.\n\nI confirm that I am physically fit to take part, that my participation is voluntary, and that I knowingly assume all of these risks.\n\nIn exchange for being allowed to take part, I, for myself and my heirs and representatives, release, waive and agree not to sue Dallas United FC, its owners, co-founders, officers, coaches, staff, volunteers, sponsors, and the owners and operators of the fields it uses (the “Released Parties”) for any injury, illness, death, or loss of or damage to property arising from my participation, including claims arising from the negligence of the Released Parties, to the fullest extent permitted by Texas law.\n\nI agree to indemnify and hold harmless the Released Parties from any claims, costs and attorney’s fees arising from my participation.\n\nIf any part of this agreement is held invalid, the rest stays in full force. This agreement is governed by the laws of the State of Texas, and any legal action must be brought in Dallas County, Texas.') },
      { id: 'w2', title: T('Health and communicable illness'), body: T('I will not attend if I have symptoms of a contagious illness (such as fever, flu or COVID-19), and I will tell a staff member right away if I feel unwell during the session. I understand that taking part in group sport carries a risk of exposure to illness, and I accept that risk. Dallas United FC may ask anyone who appears unwell to stop taking part.') },
      { id: 'w3', title: T('Code of conduct'), body: T('I will respect coaches, staff, referees, other players, the venue and its neighbors. No alcohol, drugs, weapons or tobacco at any session. Fighting, abuse or discrimination of any kind means I will be asked to leave and may not be invited back.') },
      { id: 'w4', title: T('Photo and video release'), body: T('I allow Dallas United FC to photograph and film me at tryouts and club activities, and to use those photos and videos on its website, DU TV, social media and promotional material, without payment and without limit of time.') }
    ],
    faq: [
      { id: 'q1', q: T('Is there a fee to try out?', '¿Hay que pagar?', 'Faut-il payer ?'), a: T('No. Tryouts are free.', 'No. Las pruebas son gratis.', 'Non. Les détections sont gratuites.') },
      { id: 'q2', q: T('When will I hear back?', '¿Cuándo tendré respuesta?', 'Quand aurai-je une réponse ?'), a: T('Within a week of your session.', 'Dentro de una semana.', 'Dans la semaine qui suit ta séance.') },
      { id: 'q3', q: T('Can I come to more than one session?', '¿Puedo ir a más de una sesión?', 'Puis-je venir à plusieurs séances ?'), a: T('Yes, but register for each one so we have enough spots.', 'Sí, pero inscríbete en cada una.', 'Oui, mais inscris-toi à chacune.') },
      { id: 'q4', q: T('What should I wear?', '¿Qué me pongo?', 'Que dois-je porter ?'), a: T('Normal training clothes and cleats. We hand out colored bibs on the day.', 'Ropa normal de entrenamiento y tacos. Damos petos de colores ese día.', 'Une tenue d’entraînement normale et des crampons. On distribue des chasubles sur place.') },
      { id: 'q5', q: T('What time should I arrive?', '¿A qué hora debo llegar?', 'À quelle heure arriver ?'), a: T('30 minutes before the start, to check in and warm up.', '30 minutos antes, para registrarte y calentar.', '30 minutes avant le début, pour l’accueil et l’échauffement.') },
      { id: 'q6', q: T('Is there parking?', '¿Hay estacionamiento?', 'Y a-t-il un parking ?'), a: T('Yes, free parking at the field. Arrive early, it fills up.', 'Sí, estacionamiento gratis en la cancha. Llega temprano.', 'Oui, parking gratuit au terrain. Arrive tôt, il se remplit vite.') },
      { id: 'q7', q: T('What happens if it rains?', '¿Qué pasa si llueve?', 'Que se passe-t-il s’il pleut ?'), a: T('We play in light rain. If a session is moved because of storms, we email and text everyone who signed up.', 'Jugamos con lluvia ligera. Si hay tormenta y se cambia la sesión, avisamos por correo y mensaje.', 'On joue sous une pluie légère. En cas d’orage, on prévient tous les inscrits par e-mail et SMS.') },
      { id: 'q8', q: T('Can friends or family come to watch?', '¿Pueden venir amigos o familia a mirar?', 'Mes proches peuvent-ils venir regarder ?'), a: T('Yes, from the sideline. Players only on the field.', 'Sí, desde la banda. Solo jugadores en la cancha.', 'Oui, depuis le bord du terrain. Seuls les joueurs sur le terrain.') },
      { id: 'q9', q: T('Do I need a club, a coach or an agent?', '¿Necesito club, entrenador o agente?', 'Faut-il un club, un coach ou un agent ?'), a: T('No. Anyone 18 or over can sign up.', 'No. Cualquiera mayor de 18 puede inscribirse.', 'Non. Tout le monde à partir de 18 ans peut s’inscrire.') },
      { id: 'q10', q: T('I’m a goalkeeper. Is it different?', 'Soy portero. ¿Es diferente?', 'Je suis gardien. C’est différent ?'), a: T('You get a goalkeeper coach for part of the session. Bring your gloves.', 'Tendrás un entrenador de porteros parte de la sesión. Trae tus guantes.', 'Tu auras un entraîneur des gardiens pendant une partie de la séance. Apporte tes gants.') },
      { id: 'q11', q: T('I got hurt or I can’t come anymore. What do I do?', 'Me lesioné o ya no puedo ir. ¿Qué hago?', 'Je suis blessé ou je ne peux plus venir. Que faire ?'), a: T('Email us and we’ll move you to another session.', 'Escríbenos y te pasamos a otra sesión.', 'Écris-nous et on te place sur une autre séance.') },
      { id: 'q12', q: T('If I make the team, does it cost anything?', 'Si quedo en el equipo, ¿cuesta algo?', 'Si je suis retenu, est-ce payant ?'), a: T('No. Selected players do not pay to play.', 'No. Los jugadores seleccionados no pagan por jugar.', 'Non. Les joueurs retenus ne paient pas pour jouer.') }
    ],
    videos: [
      { id: 'v1', thumb: IMG('celebrate.jpg'), title: T('Fort Worth City 1–2 Dallas United'), cat: 'Highlights', len: '4:12', pass: false, link: '', tag: 'Full video', slide: true },
      { id: 'v2', thumb: IMG('matchday-stadium.jpg'), title: T('Full replay: Fort Worth City vs Dallas United'), cat: 'Full match', len: '1:52:10', pass: true, link: '', tag: 'Full video', slide: true },
      { id: 'v3', thumb: IMG('community.jpg'), title: T('Inside Dallas United: back to school'), cat: 'Behind the scenes', len: '2:40', pass: false, link: '', tag: 'Essential', slide: true },
      { id: 'v4', thumb: IMG('tactics.jpg'), title: T('Coach Torres: how we play'), cat: 'Behind the scenes', len: '7:10', pass: false, link: '' },
      { id: 'v5', thumb: IMG('stadium-night.jpg'), title: T('Dallas United 3–1 Arlington Town'), cat: 'Highlights', len: '3:58', pass: false, link: '' },
      { id: 'v6', thumb: IMG('training.jpg'), title: T('Ask the Squad: Mateo Vargas'), cat: 'Behind the scenes', len: '6:24', pass: true, link: '' }
    ],
    tvTexts: { audioPrice: '$1.99 / month', videoPrice: '$4.99 / month', featured: 'v1', upcomingOn: true, upCount: 3, upcomingImg: '' },
    partners: [
      { id: 'pa1', name: 'Lone Star Energy', tier: 'Main partner', link: '', footer: true },
      { id: 'pa2', name: 'Volta', tier: 'Kit supplier', link: '', footer: true },
      { id: 'pa3', name: 'Trinity Bank', tier: 'Main partner', link: '', footer: true },
      { id: 'pa4', name: 'Big D Motors', tier: 'Official', link: '', footer: true },
      { id: 'pa5', name: 'Prairie Air', tier: 'Official', link: '', footer: true },
      { id: 'pa6', name: 'Redbird Coffee', tier: 'Official', link: '', footer: true },
      { id: 'pa7', name: 'Cedar Health', tier: 'Community', link: '', footer: true },
      { id: 'pa8', name: 'Kinetic Water', tier: 'Official', link: '', footer: true },
      { id: 'pa9', name: 'Texas Premier League', tier: 'League', link: '', footer: true }
    ],
    packages: [
      { id: 'k1', name: T('Main shirt partner'), badge: T('Founding · 1 available'), perks: T('Your logo on the front of every match shirt\nYour name on DU TV videos and match posts\nYour logo on the website and partner wall'), featured: true },
      { id: 'k2', name: T('Sleeve partner'), badge: T('Kit'), perks: T('Your logo on the shirt sleeve\nTwo social posts a month\nYour logo on the partner wall'), featured: false },
      { id: 'k3', name: T('Matchday partner'), badge: T('Matchday'), perks: T('Your name on one home match\nA banner at the field on match day\nShout-outs on our match-day posts'), featured: false },
      { id: 'k4', name: T('Community partner'), badge: T('Community'), perks: T('School visits and youth clinics\nVolunteer days with the squad\nYour logo on the Community page'), featured: false },
      { id: 'k5', name: T('Official supplier'), badge: T('Supplier'), perks: T('“Official supplier” title\nYour logo on the partner wall\nUse of the club crest in your marketing'), featured: false }    ],
    users: [
      { id: 'u1', name: 'Alcino E.', email: 'alcino@dallasunitedfc.com', role: 'Owner', code: '482913', perms: ['live', 'news', 'matches', 'table', 'players', 'home', 'shop', 'tryouts', 'dutv', 'partners', 'media', 'settings', 'fans'] },
      { id: 'u2', name: 'Club founder', email: 'founder@dallasunitedfc.com', role: 'Owner', code: '730264', perms: ['live', 'news', 'matches', 'table', 'players', 'home', 'shop', 'tryouts', 'dutv', 'partners', 'media', 'settings', 'fans'] },
      { id: 'u3', name: 'Media volunteer', email: 'media@dallasunitedfc.com', role: 'Match reporter', code: '195837', perms: ['live', 'news', 'matches'] },
      { id: 'u4', name: 'Shop manager', email: 'shop@dallasunitedfc.com', role: 'Shop manager', code: '664021', perms: ['shop', 'media'] }
    ],
    features: { launch: false, autoStandings: false, stats: true, liveStream: true, league: true, hero: true, news: true, matches: true, team: true, matchCentre: true, contact: true, standings: true, matchday: true, countdown: true, strip: true, dutv: true, tvPass: false, founders: true, club214: true, shop: true, video: true, tryouts: true, story: true, ask: false, support: true, volunteer: true, partners: true, partnersWall: true, newsletter: true, accounts: true, walletCards: true },
    theme: { xmas: false, xmasBanner: 'Merry Christmas from Dallas United! 🎄', xmasMotto: 'Merry Christmas, Dallas · Happy holidays from your club', navy: '', gold: '', blue: '', cream: '', deep: '' },
    texts: {}, uiText: {}, pics: {},
    fans: [],
    lineups: {},
    clubTexts: { on: true, follow: true, fotmOn: true, fotmName: 'Maria Gonzalez', fotmNo: 1, fotmHood: 'Oak Cliff', fotmMonth: T('November', 'Noviembre', 'Novembre'), fotmImg: IMG('fans.jpg'), fotmText: T('At every open training with a flag and a thermos of coffee for the volunteers.', 'En cada entrenamiento abierto con una bandera y café para los voluntarios.', 'À chaque entraînement ouvert avec un drapeau et du café pour les bénévoles.'), name: T('The 214 Club', 'El Club 214', 'Le Club 214'), kicker: T('Official supporters club', 'Club oficial de aficionados', 'Club officiel des supporters'), intro: T('Named after Dallas’s area code. Free to join and open to everyone.', 'Lleva el código de área de Dallas. Gratis y abierto a todos.', 'Nommé d’après l’indicatif de Dallas. Gratuit et ouvert à tous.'), perks: T('First dibs on new merch drops\nNews on tryouts and match days, first\nA birthday message from the club', 'Primero en los nuevos lanzamientos de la tienda\nNoticias de pruebas y partidos, primero\nUn mensaje de cumpleaños del club', 'Priorité sur les nouveautés de la boutique\nLes infos sur les détections et les matchs en premier\nUn message d’anniversaire du club') },
    fanclub: [],
    countdownTexts: { on: true, date: '2027-03-06', time: '19:30', title: T('Countdown to kickoff', 'Cuenta atrás para el inicio', 'Compte à rebours du coup d’envoi'), sub: T('Our first-ever match', 'Nuestro primer partido', 'Notre tout premier match'), button: T('Join the 214 Club', 'Únete al Club 214', 'Rejoins le Club 214') },
    quote: { on: true, img: IMG('fans.jpg'), text: T('We built this club for the people of Dallas: for the kids in the parks, the fans in the stands and everyone who ever wanted a team to call their own.', 'Creamos este club para la gente de Dallas: para los niños en los parques, los aficionados en las gradas y todos los que alguna vez quisieron un equipo propio.', 'Nous avons créé ce club pour les gens de Dallas : les enfants dans les parcs, les fans dans les tribunes et tous ceux qui ont toujours voulu une équipe à eux.'), name: '[Founder name]', role: T('Founder & President, Dallas United FC', 'Fundador y presidente, Dallas United FC', 'Fondateur et président, Dallas United FC') },
    popup: { on: false, where: 'Home page', often: 'Once', delay: 1.5, until: '', color: '#1452D9', kicker: T('To the best fans in Dallas…', 'A la mejor afición de Dallas…', 'Aux meilleurs fans de Dallas…'), title: T('Thank you.', 'Gracias.', 'Merci.'), text: T('This season we’re saying thank you to the people who make this club so special.', 'Esta temporada damos las gracias a quienes hacen este club tan especial.', 'Cette saison, nous remercions ceux qui rendent ce club si spécial.'), btn: T('Find out more', 'Saber más', 'En savoir plus'), link: 'news.html', img: IMG('celebrate.jpg') },
    venue: { on: true, kicker: T('Match day', 'Día de partido', 'Jour de match'), title: T('Where we play', 'Dónde jugamos', 'Où on joue'), tag: T('Home ground', 'Nuestra casa', 'À domicile'), name: 'Home field (TBA)', address: T('Dallas, TX'), mapUrl: '', pin: '', img: '', mapOn: true, mapImg: '', gatesMins: 60, guideText: T('Match-day guide'), guideLink: '',
      parkingOn: true, parkingH: T('Parking', 'Estacionamiento', 'Parking'), parkingT: T('Free parking next to the field. Arrive early on match day.', 'Estacionamiento gratis junto al campo. Llega temprano.', 'Parking gratuit à côté du terrain. Arrive tôt.'),
      bagsOn: true, bagsH: T('Bags', 'Bolsas', 'Sacs'), bagsT: T('Small bags only. No glass and no outside alcohol.', 'Solo bolsas pequeñas. Sin vidrio ni alcohol de fuera.', 'Petits sacs uniquement. Pas de verre ni d’alcool.'),
      accessOn: true, accessH: T('Accessible', 'Accesible', 'Accessible'), accessT: T('Step-free seating and parking close to the gate.', 'Asientos sin escalones y estacionamiento junto a la entrada.', 'Places sans marches et parking près de l’entrée.'),
      transitOn: true, transitH: T('Bus & rail', 'Autobús y tren', 'Bus et train'), transitT: T('DART buses stop close to the field. Plan your trip at dart.org.', 'Los autobuses DART paran cerca del campo. Planea tu viaje en dart.org.', 'Les bus DART s’arrêtent près du terrain. Prépare ton trajet sur dart.org.') },
    walletPhone: { c_img: 'assets/img/phone-hand.png', c_bg: '#E5E5E5', c_x: 36.1, c_y: 13.9, c_w: 27.1, c_h: 75.3, c_r: 14, f_img: 'assets/img/phone-hand.png', f_bg: '#E5E5E5', f_x: 36.1, f_y: 13.9, f_w: 27.1, f_h: 75.3, f_r: 14 },
    club214Collage: Array.from({ length: 6 }, (_, i) => ({ id: `cc${i + 1}`, img: '', caption: T('') })),
    club214Slides: ['fans.jpg', 'celebrate.jpg', 'community.jpg', 'flag.jpg', 'stadium-night.jpg', 'matchday-stadium.jpg'].map((f, i) => ({ id: `cs${i + 1}`, img: IMG(f), caption: T('') })),
    foundersCollage: Array.from({ length: 6 }, (_, i) => ({ id: `fc${i + 1}`, img: '', caption: T('') })),
    foundersSlides: [['f-tee-cream-front.jpg', 'Founders Tee · Cream'], ['f-tee-black-front.jpg', 'Founders Tee · Black'], ['f-polo-navy.jpg', 'Founders Polo'], ['f-cap-black.jpg', 'Founders Cap'], ['f-scarf-cream.jpg', 'Founders Scarf']].map(([f, k], i) => ({ id: `fs${i + 1}`, img: IMG(f), kicker: T(k), title: T('Your number on the back', 'Tu número en la espalda', 'Ton numéro au dos'), link: 'founders-shop.html' })),
    authCfg: { google: true, apple: true, country: 'USA' },
    fixturesMore: (() => {
      const opp = [['Austin Bold', 'AUS', '#6A1B9A'], ['Lubbock Legends', 'LUB', '#B71C1C'], ['Denton Diablos', 'DEN', '#C62828'], ['Tyler Rose', 'TYL', '#AD1457'], ['Frisco Flyers', 'FRI', '#1565C0'], ['McKinney United', 'MCK', '#2E7D32'], ['Garland Athletic', 'GAR', '#EF6C00'], ['Irving Inter', 'IRV', '#00695C'], ['Midland Riders', 'MID', '#4E342E'], ['Corpus Christi FC', 'CCF', '#0277BD']];
      const out = []; const base = new Date(); base.setHours(12, 0, 0, 0);
      for (let i = 0; i < 20; i++) {
        const [name, short, col] = opp[i % opp.length];
        const dd = new Date(base); dd.setDate(base.getDate() + (i < 6 ? -(70 - i * 7) : 21 + (i - 6) * 7));
        const past = i < 6; const ha = i % 2 ? 'Away' : 'Home';
        out.push({ id: `fx${i + 1}`, date: dd.toISOString().slice(0, 10), time: i % 3 ? '19:30' : '18:00', opp: name, oppShort: short, oppColor: col, ha, comp: i % 5 === 4 ? 'Texas Cup' : 'League', venue: ha === 'Home' ? 'Home field (TBA)' : `${name} Stadium`, status: past ? 'Full time' : 'Upcoming', du: past ? String((i * 7) % 4) : '', op: past ? String((i * 3) % 3) : '', tickets: !past && ha === 'Home' ? 'https://www.eventbrite.com/' : '', highlights: past ? 'v8' : '', scorers: past && (i * 7) % 4 ? 'Vargas 33’' : '' });
      }
      return out;
    })(),
    videosMore: [
      ['v7', 'celebrate.jpg', 'Every goal from October', 'Highlights', '5:30', '2026-11-02'],
      ['v8', 'matchday-stadium.jpg', 'Dallas United 2–0 Waco United', 'Highlights', '4:05', '2026-10-24'],
      ['v9', 'stadium-night.jpg', 'Plano FC 1–1 Dallas United', 'Highlights', '3:47', '2026-10-10'],
      ['v10', 'fans.jpg', 'The best saves of the season so far', 'Highlights', '3:12', '2026-10-05'],
      ['v11', 'celebrate.jpg', 'Okafor’s free kick from every angle', 'Highlights', '1:58', '2026-09-28'],
      ['v12', 'stadium-night.jpg', 'Full replay: Dallas United vs Arlington Town', 'Full match', '1:50:02', '2026-10-17'],
      ['v13', 'matchday-stadium.jpg', 'Full replay: Dallas United vs Waco United', 'Full match', '1:49:40', '2026-10-24'],
      ['v14', 'fans.jpg', 'Full replay: Plano FC vs Dallas United', 'Full match', '1:51:15', '2026-10-10'],
      ['v15', 'training.jpg', 'Tuesday training: rondos and finishing', 'Behind the scenes', '4:20', '2026-11-04'],
      ['v16', 'community.jpg', 'Matchday diary: Fort Worth away', 'Behind the scenes', '8:15', '2026-11-01'],
      ['v17', 'kit-home-full.jpg', 'Making the 26/27 kit with Jersey Bird', 'Behind the scenes', '5:02', '2026-10-20'],
      ['v18', 'tactics.jpg', 'In the dressing room before kick-off', 'Behind the scenes', '3:44', '2026-10-17'],
      ['v19', 'p3.jpg', 'Meet us: Samuel Okafor', 'Meet us', '4:10', '2026-11-06'],
      ['v20', 'p5.jpg', 'Meet us: Mateo Vargas', 'Meet us', '3:55', '2026-10-30'],
      ['v21', 'p4.jpg', 'Meet us: Diego Morales', 'Meet us', '4:30', '2026-10-23'],
      ['v22', 'p1.jpg', 'Meet us: Jamal Carter', 'Meet us', '3:20', '2026-10-16'],
      ['v23', 's1.jpg', 'Meet us: Coach Michael Torres', 'Meet us', '6:05', '2026-10-09'],
      ['v24', 'p6.jpg', 'Meet us: Darius King', 'Meet us', '3:40', '2026-10-02']
    ].map(([id, img, ti, cat, len, date]) => ({ id, thumb: IMG(img), title: T(ti), cat, len, date, pass: false, link: '', tag: cat === 'Full match' ? 'Full video' : '', slide: id === 'v15' || id === 'v19' })),
    newsMore: [
      ['n8', 'Club', 'stadium-night.jpg', 'Our first night under the lights', 'What the first home match at night will look like, from the gates to the final whistle.', '2026-10-27'],
      ['n9', 'First Team', 'tactics.jpg', 'How Coach Torres wants us to play', 'High press, quick passing and a back four that builds from the keeper.', '2026-10-25'],
      ['n10', 'Community', 'fans.jpg', 'The 214 Club passes its first members', 'Fans from every part of Dallas have joined the free supporters club.', '2026-10-23'],
      ['n11', 'Club', 'kit-home-full.jpg', 'The 26/27 kit, made by Jersey Bird', 'Navy stripes, a bronze trim and the Lone Star on the chest.', '2026-10-20'],
      ['n12', 'Tryouts', 'training.jpg', 'What to bring to open tryouts', 'Boots, shin guards, water and a form of ID. Here is the full list.', '2026-10-18'],
      ['n13', 'First Team', 'matchday-stadium.jpg', 'Five things we learned in preseason', 'Speed on the wings, a calm goalkeeper and a captain who never stops talking.', '2026-10-15'],
      ['n14', 'Community', 'community.jpg', 'Free clinics for kids this winter', 'Our players will run free Saturday clinics in parks across the city.', '2026-10-12']
    ].map(([id, cat, img, ti, sum, date]) => ({ id, title: T(ti), cat, img: IMG(img), sum: T(sum), body: T(`${sum}\n\nMore details will follow on our website and social media.`), status: 'Published', date, when: '', featured: false, social: {} })),
    home2: {
      heroCount: 4, heroSecs: 6,
      igOn: true, igHandle: 'dallasunitedfc', igName: 'Dallas United FC', igFeed: '',
      tvText: T('Highlights, full matches and life behind the scenes.', 'Resúmenes, partidos completos y la vida detrás de cámaras.', 'Résumés, matchs complets et coulisses.'), tvImg: IMG('fans.jpg'),
      gamesOn: true, gamesTitle: T('Games', 'Partidos', 'Matchs'), gamesText: T('Every fixture, home and away. Get your tickets early.', 'Todos los partidos, en casa y fuera. Consigue tus entradas pronto.', 'Tous les matchs, à domicile et à l’extérieur.'), gamesImg: IMG('stadium-night.jpg'),
      storeKick: T('Official store', 'Tienda oficial', 'Boutique officielle'), storeText: T('Kits, scarves, hoodies and caps. Made for Dallas.', 'Equipaciones, bufandas, sudaderas y gorras. Hechas para Dallas.', 'Maillots, écharpes, sweats et casquettes.'), storeBtn: T('Buy now', 'Comprar', 'Acheter'), storeAll: T('Go to online store', 'Ir a la tienda', 'Aller à la boutique'),
      c214On: true, c214Kick: T('Free for every fan', 'Gratis para cada aficionado', 'Gratuit pour chaque fan'), c214Title: T('Join the 214 Club', 'Únete al Club 214', 'Rejoins le Club 214'), c214Text: T('The official supporters club of Dallas United. Get your card and stand with us.', 'El club oficial de aficionados de Dallas United. Consigue tu tarjeta.', 'Le club officiel des supporters de Dallas United.'), c214Btn: T('Join now', 'Únete', 'Rejoindre'), c214Link: '214-club.html', c214Img: IMG('card-214-front.jpg'), c214Bg: IMG('fans.jpg'), c214Label: T('214 Club', 'Club 214', 'Club 214'), c214Small: T('Official supporters', 'Aficionados oficiales', 'Supporters officiels'),
      fdOn: true, fdKick: T('Only 500 numbers', 'Solo 500 números', 'Seulement 500 numéros'), fdTitle: T('Become a Founder', 'Hazte fundador', 'Deviens fondateur'), fdText: T('Claim your number, get the gold card and put your name on the Founders Wall.', 'Reserva tu número, recibe la tarjeta dorada y pon tu nombre en el muro.', 'Réserve ton numéro et mets ton nom sur le mur.'), fdBtn: T('Claim your number', 'Reserva tu número', 'Réserve ton numéro'), fdLink: 'founders.html', fdImg: IMG('card-founder-front.jpg'), fdBg: IMG('story-star.jpg'), fdLabel: T('Founders 500', 'Fundadores 500', 'Fondateurs 500'), fdSmall: T('One of the first', 'Uno de los primeros', 'Un des premiers'),
      nlTitle: T('Stay in the loop', 'No te pierdas nada', 'Reste informé'), nlText: T('Join the Dallas United mailing list for news, tickets and offers.', 'Únete a la lista de Dallas United para noticias, entradas y ofertas.', 'Inscris-toi pour les news, billets et offres.'), nlNote: T('By signing up you agree to get emails from Dallas United. You can stop any time.', 'Al registrarte aceptas recibir correos de Dallas United.', 'En t’inscrivant tu acceptes de recevoir nos emails.')
    },
    igPosts: [['celebrate.jpg', 'Three goals, three points. What a night at home.'], ['club-loop.mp4', 'Back to school with the squad.'], ['fans.jpg', 'The best fans in Dallas.'], ['training.jpg', 'Tuesday training. Work first.'], ['story-star.jpg', 'Lone Star. Our city, our club.'], ['home-jersey.jpg', 'The 26/27 home kit is here.'], ['community.jpg', 'A morning with Dallas kids.'], ['stadium-night.jpg', 'Match day under the lights.'], ['story-river.jpg', 'Trinity River mornings.'], ['tactics.jpg', 'How we set up for Saturday.']].map(([f, c], i) => ({ id: `ig${i + 1}`, img: /\.mp4$/.test(f) ? `assets/video/${f}` : IMG(f), caption: T(c), link: '' })),
    storeSlides: [['home-jersey.jpg', 'Home kit 26/27', 'shop.html?p=home'], ['away-jersey.jpg', 'Away kit 26/27', 'shop.html?p=away'], ['third-jersey.jpg', 'Third kit 26/27', 'shop.html?p=third'], ['f-tee-cream-front.jpg', 'Founders collection', 'founders-shop.html'], ['scarf.jpg', 'Club scarf', 'shop.html'], ['hoodie.jpg', 'Hoodies', 'shop.html']].map(([f, n, l], i) => ({ id: `ss${i + 1}`, img: IMG(f), title: T(n), link: l })),
    c214Cards: [['community.jpg', 'Member events'], ['stadium-night.jpg', 'Wallet card'], ['story-river.jpg', 'Your pin on the fan map'], ['celebrate.jpg', 'Club news first']].map(([f, n], i) => ({ id: `mc${i + 1}`, img: IMG(f), label: T(n) })),
    fdCards: [['fans.jpg', 'Founders shop'], ['story-star.jpg', 'Your number, 1 of 500'], ['stadium-night.jpg', 'Name on the wall'], ['story-river.jpg', 'Gold card']].map(([f, n], i) => ({ id: `fd${i + 1}`, img: IMG(f), label: T(n) })),
    kitBand: { on: true, brand: 'Jersey Bird', logo: 'assets/brand/jerseybird.webp', title: T('26/27 Kit', 'Equipación 26/27', 'Maillots 26/27'), btn: T('Shop kit', 'Comprar equipación', 'Voir les maillots'), link: 'shop.html?cat=Kit',
      img1: IMG('home-jersey.jpg'), label1: T('Home kit', 'Local', 'Domicile'), link1: 'shop.html?p=home',
      img2: IMG('away-jersey.jpg'), label2: T('Away kit', 'Visitante', 'Extérieur'), link2: 'shop.html?p=away',
      img3: IMG('third-jersey.jpg'), label3: T('Third kit', 'Tercera', 'Third'), link3: 'shop.html?p=third' },
    shopSlides: [
      { id: 'sl1', img: IMG('kit-home-full.jpg'), kicker: T('Home kit 26/27', 'Equipación local 26/27', 'Maillot domicile 26/27'), title: T('Wear the crest', 'Viste el escudo', 'Porte l’écusson'), btn: T('Shop kit', 'Comprar equipación', 'Voir le maillot'), link: 'shop.html?cat=Kit' },
      { id: 'sl2', img: IMG('f-tee-cream-back.jpg'), kicker: T('Founders collection', 'Colección fundadores', 'Collection des fondateurs'), title: T('Made for the first 500', 'Hecha para los primeros 500', 'Pour les 500 premiers'), btn: T('Shop founders', 'Comprar fundadores', 'Boutique fondateurs'), link: 'founders-shop.html' },
      { id: 'sl3', img: IMG('hoodie.jpg'), kicker: T('Lifestyle', 'Estilo', 'Lifestyle'), title: T('Dallas, every day', 'Dallas, todos los días', 'Dallas, tous les jours'), btn: T('Shop lifestyle', 'Comprar estilo', 'Voir le lifestyle'), link: 'shop.html?cat=Lifestyle' }
    ],
    shopCats: [
      { id: 'Kit', name: T('Kit', 'Equipación', 'Maillots'), img: IMG('home-jersey.jpg'), visible: true },
      { id: 'Lifestyle', name: T('Lifestyle', 'Estilo', 'Lifestyle'), img: IMG('hoodie.jpg'), visible: true },
      { id: 'Youth', name: T('Youth', 'Niños', 'Enfants'), img: IMG('kids-home.jpg'), visible: true },
      { id: 'Hats', name: T('Hats', 'Gorras', 'Casquettes'), img: IMG('cap.jpg'), visible: true },
      { id: 'Accessories', name: T('Accessories', 'Accesorios', 'Accessoires'), img: IMG('scarf.jpg'), visible: true }
    ],
    collectionPics: [{ id: 'cp1', img: IMG('f-tee-cream-back.jpg') }, { id: 'cp2', img: IMG('f-polo-navy.jpg') }, { id: 'cp3', img: IMG('f-scarf-cream.jpg') }],
    story: {
      intro: T('Dallas has always been a city of people who build something out of nothing. A crossing on the Trinity River became a city. A prairie became a skyline.\n\nDallas United was started the same way: by people from every corner of this city who wanted a club of their own. Not a franchise from somewhere else. Ours.\n\nEvery part of our crest tells a piece of that story.'),
      on: true,
      teamOn: true, teamTitle: T('Our story', 'Nuestra historia', 'Notre histoire'), teamText: T(''), teamImg: '', teamVideo: '',
      heroImg: IMG('stadium-night.jpg'), heroKick: T('Dallas United FC', 'Dallas United FC', 'Dallas United FC'), heroTitle: T('Our story', 'Nuestra historia', 'Notre histoire'),
      crestOn: true, crestImg: '', crestKick: T('Dallas United FC'), crestTitle: T('Behind the crest', 'Detrás del escudo', 'Derrière l’écusson'), crestText: T('One circle, one star, one river. Every line of the crest says where we come from: Texas, Dallas and the Trinity River that runs through it.', 'Un círculo, una estrella, un río. Cada línea del escudo dice de dónde venimos.', 'Un cercle, une étoile, une rivière. Chaque trait de l’écusson dit d’où nous venons.'),
      beyondOn: true, beyondTitle: T('Piece by piece', 'Pieza por pieza', 'Pièce par pièce'),
      colorsOn: true, colorsTitle: T('Our colors', 'Nuestros colores', 'Nos couleurs'),
      galleryOn: true, galleryTitle: T('Gallery', 'Galería', 'Galerie')
    },
    storyParts: [
        { id: 'star', step: 'star', img: IMG('story-star.jpg'), name: T('The Lone Star', 'La Estrella Solitaria', 'L’étoile solitaire'), tag: T('Texas', 'Texas', 'Texas'), text: T('The single star of the Texas flag, right in the heart of the crest. Its points reach all the way out to touch the circle: one club reaching every corner of Dallas.', 'La estrella de la bandera de Texas, en el corazón del escudo. Sus puntas llegan hasta el círculo: un club que llega a cada rincón de Dallas.', 'L’étoile du drapeau texan, au cœur de l’écusson. Ses pointes touchent le cercle : un club qui atteint chaque coin de Dallas.') },
        { id: 'river', step: 'river', img: IMG('story-river.jpg'), name: T('The Trinity River', 'El río Trinity', 'La rivière Trinity'), tag: T('Dallas', 'Dallas', 'Dallas'), text: T('The river that runs through our city. It flows around the ring, from the D of Dallas down to 2026 and back up to the B of Club, carrying the club’s name.', 'El río que cruza nuestra ciudad. Rodea el anillo, de la D de Dallas hasta 2026 y de vuelta a la B de Club.', 'La rivière qui traverse notre ville. Elle fait le tour de l’anneau, du D de Dallas jusqu’à 2026 et retour.') },
        { id: 'name', step: 'name', img: IMG('fans.jpg'), name: T('Dallas United Football Club', 'Dallas United Football Club', 'Dallas United Football Club'), tag: T('Our name', 'Nuestro nombre', 'Notre nom'), text: T('Our full name around the ring, like the great clubs. United: every neighborhood, every language, one club.', 'Nuestro nombre completo en el anillo, como los grandes clubes. United: cada barrio, cada idioma, un club.', 'Notre nom complet autour de l’anneau, comme les grands clubs. United : chaque quartier, chaque langue, un club.') },
        { id: 'year', step: 'year', img: IMG('training.jpg'), name: T('2026', '2026', '2026'), tag: T('Where it starts', 'Donde empieza', 'Là où tout commence'), text: T('The year it all began, in white at the bottom of the ring, right where the river meets.', 'El año en que todo empezó, en blanco abajo del anillo, donde se junta el río.', 'L’année où tout a commencé, en blanc en bas de l’anneau, là où la rivière se rejoint.') },
        { id: 'circle', step: 'circle', img: IMG('stadium-night.jpg'), name: T('The circle', 'El círculo', 'Le cercle'), tag: T('Together', 'Juntos', 'Ensemble'), text: T('A round crest: no corners and no sides, everyone on the same line. Gold rings for a club that aims high.', 'Un escudo redondo: sin esquinas ni lados, todos en la misma línea. Anillos dorados para un club que apunta alto.', 'Un écusson rond : pas de coins, pas de côtés, tout le monde sur la même ligne.') },
        { id: 'colors', step: 'all', img: '', name: T('Ink, blue and bronze', 'Tinta, azul y bronce', 'Encre, bleu et bronze'), tag: T('Our colors', 'Nuestros colores', 'Nos couleurs'), text: T('Midnight ink for Dallas nights, Trinity blue for the river, bronze for the Lone Star and limestone for the ground we stand on. All of it together is Dallas United.', 'Tinta para las noches de Dallas, azul Trinity para el río, bronce para la estrella y piedra caliza para nuestra tierra. Todo junto es Dallas United.', 'Marine pour les nuits de Dallas, or pour l’étoile, bleu Trinity pour la rivière. Ensemble, c’est Dallas United.') }
      ],
    contact: {
      title: T('Contact us', 'Contáctanos', 'Nous contacter'), help: T('Hello, how can we help you?', 'Hola, ¿cómo podemos ayudarte?', 'Bonjour, comment pouvons-nous vous aider ?'),
      emailTitle: T('Email us', 'Escríbenos', 'Écrivez-nous'), emailText: T('Write to the club and we usually get back to you within 48 hours on weekdays.', 'Escribe al club y normalmente respondemos en 48 horas entre semana.', 'Écrivez au club, nous répondons en général sous 48 heures en semaine.'), emailBtn: T('Send an email', 'Enviar un correo', 'Envoyer un e-mail'),
      igTitle: T('DM us on Instagram', 'Escríbenos en Instagram', 'Écrivez-nous sur Instagram'), igText: T('Quick question? Send us a message on Instagram. It’s the fastest way to reach the team.', '¿Una pregunta rápida? Envíanos un mensaje en Instagram.', 'Une question rapide ? Envoyez-nous un message sur Instagram.'), igBtn: T('Message us', 'Enviar mensaje', 'Nous écrire'),
      faqTitle: T('FAQ', 'Preguntas', 'FAQ'), faqText: T('Maybe another fan or player had the same question and we already answered it.', 'Quizás otro aficionado ya hizo la misma pregunta.', 'Un autre fan a peut-être déjà posé la même question.'), faqBtn: T('Find answers', 'Ver respuestas', 'Voir les réponses'),
      faqHead: T('The most frequently asked questions', 'Las preguntas más frecuentes', 'Les questions les plus fréquentes'), faqMore: T('Can’t find your question? Email us', '¿No encuentras tu pregunta? Escríbenos', 'Vous ne trouvez pas ? Écrivez-nous')
    },
    contactFaq: [
      ['When is the next tryout?', 'Tryout dates are posted on the Tryouts page as soon as they are set. Sign up there and we email you the details.'],
      ['How do I join the team?', 'Come to an open tryout. Every player who signs up gets a fair look from the coaching staff, whatever club they play for now.'],
      ['Is there a cost to try out?', 'No. Open tryouts are free. Bring boots, shin guards, water and a valid ID.'],
      ['How old do I need to be?', 'First team tryouts are for players 18 and over. Youth news is posted on the website when it starts.'],
      ['Where do you play your home games?', 'Our home stadium and every fixture are on the Matches page, with directions and an add-to-calendar button.'],
      ['How do I become a Founder or join the 214 Club?', 'Both are on the website: the Founders page to claim one of the first 500 numbers, and the 214 Club page to join the supporters club.'],
      ['Can my business partner with the club?', 'Yes. Email us and tell us about your business, and we will send you our partner packages.']
    ].map(([q, a], i) => ({ id: `cf${i + 1}`, q: T(q), a: T(a) })),
    storyGallery: [['celebrate.jpg', 'First win'], ['fans.jpg', 'Our fans'], ['stadium-night.jpg', 'Under the lights'], ['training.jpg', 'Training'], ['community.jpg', 'In the community'], ['story-river.jpg', 'The Trinity River']].map(([f, c], i) => ({ id: `sg${i + 1}`, img: IMG(f), cap: T(c) })),
    storyColors: [
        { id: 'navy', name: T('Midnight Ink'), hex: '#121A2B', img: IMG('stadium-night.jpg'), text: T('The color of a night match under the lights. Our home shirt and the base of the crest.') },
        { id: 'gold', name: T('Bronze'), hex: '#B8773F', img: IMG('celebrate.jpg'), text: T('For the Lone Star and the ambition of a city that always aims higher. The color we celebrate in.') },
        { id: 'blue', name: T('Trinity Blue'), hex: '#2A5F8F', img: IMG('community.jpg'), text: T('The river that started it all. Bright, moving and always running through the city.') },
        { id: 'stone', name: T('Limestone'), hex: '#EEE8DC', img: '', text: T('The pale stone of North Texas. The calm background that lets the ink and bronze stand out.') }
      ],
    live: { fixtureId: 'f2', du: 0, op: 0, period: 'Pre-match', running: false, base: 0, startedAt: 0, events: [] },
    avail: { m8: ['Injured', 'Hamstring. Light training only.', `${year}-11-20`], m14: ['Suspended', 'Red card vs Fort Worth City. Misses 1 match.', `${year}-11-14`], m15: ['Not available', 'Family reasons', ''] },
    check: {},
    calEvents: [],
    social: { x: true, instagram: true, facebook: true, tiktok: true, threads: false, snapchat: false, youtube: false },
    socialRules: { news: true, xi: true, goals: true, ft: true, founders: false },
    gfxAuto: { xi: true, ht: false, ft: true },
    cardCfg: { main: '#0A1628', accent: '#F5B700', label: T('Player card', 'Tarjeta de jugador', 'Carte joueur'), season: T('26/27', '26/27', '26/27'), fade: 'DU', logo: 'crest' },
    cardP: {},
    founderCfg: { goal: 500, open: true, base: 0, follow: false, price: 25, closesAt: '', youthPct: 20 },
    founders: [['Maria', 'Gonzalez', 'Oak Cliff', 0], ['James', 'Thompson', 'Lakewood', 2], ['Aisha', 'Bello', 'Deep Ellum', null], ['Luis', 'Hernández', 'Pleasant Grove', 6], ['Emily', 'Nguyen', 'Uptown', 11], ['Kwame', 'Asante', 'Bishop Arts', null], ['Sofia', 'Ramirez', 'Irving', 19], ['Tyler', 'Brooks', 'Garland', 27], ['Camille', 'Dubois', 'Las Colinas', null], ['Andre', 'Jackson', 'South Dallas', 33], ['Hannah', 'Kim', 'Richardson', null], ['Diego', 'Flores', 'Grand Prairie', 45]]
      .map((f, i) => ({ id: `fd${i}`, no: 12 - i, first: f[0], last: f[1], city: ['Irving', 'Garland', 'Las Colinas', 'Richardson', 'Grand Prairie'].includes(f[2]) ? (f[2] === 'Las Colinas' ? 'Irving' : f[2]) : 'Dallas', state: 'TX', hood: `${['Irving', 'Garland', 'Las Colinas', 'Richardson', 'Grand Prairie'].includes(f[2]) ? (f[2] === 'Las Colinas' ? 'Irving' : f[2]) : 'Dallas'}, TX`, joined: `2026-10-${String(31 - Math.floor(i / 2)).padStart(2, '0')}`, wall: i !== 4, news: i % 3 !== 2, bday: f[3] == null ? '' : md(f[3]), email: '' })),
    fanSeed: { on: true, states: { TX: 1064, OK: 42, LA: 31, CA: 27, AR: 18, FL: 19, NY: 16, IL: 14, GA: 13, NM: 12, CO: 11, AZ: 10 } },
    hoods: [['Oak Cliff', 44, 66, 182], ['Uptown', 50, 42, 96], ['Downtown', 52, 52, 64], ['Deep Ellum', 58, 51, 88], ['Bishop Arts', 40, 60, 74], ['Lakewood', 64, 42, 71], ['Pleasant Grove', 67, 68, 104], ['South Dallas', 56, 63, 58], ['Lake Highlands', 64, 28, 49], ['Irving', 26, 40, 95], ['Garland', 78, 25, 67], ['Richardson', 58, 14, 52], ['Mesquite', 84, 54, 46], ['Grand Prairie', 18, 62, 61], ['Arlington', 8, 70, 44], ['Carrollton', 36, 12, 38]],
    roles: [
      { id: 'r1', icon: '🎟️', name: T('Matchday crew', 'Equipo de día de partido', 'Équipe jour de match'), text: T('Gates, fan zone and helping fans find their seats.'), when: 'Home matchdays · 4 hours', open: true },
      { id: 'r2', icon: '📸', name: T('Photo & video', 'Foto y video', 'Photo et vidéo'), text: T('Shoot the match and the fans for the website and DU TV.'), when: 'Home and away', open: true },
      { id: 'r3', icon: '📱', name: T('Social media', 'Redes sociales', 'Réseaux sociaux'), text: T('Post live updates, goals and the starting XI.'), when: 'Matchdays, from anywhere', open: true },
      { id: 'r4', icon: '🧣', name: T('Merch stand', 'Tienda', 'Stand boutique'), text: T('Help sell scarves and kits at home matches.'), when: 'Home matchdays · 3 hours', open: true },
      { id: 'r5', icon: '⚽', name: T('Youth clinics', 'Clínicas juveniles', 'Stages jeunes'), text: T('Help the players run free sessions for Dallas kids.'), when: 'Weekday evenings', open: true },
      { id: 'r6', icon: '🚩', name: T('Set-up & pack-down', 'Montaje y desmontaje', 'Installation et rangement'), text: T('Flags, banners and the partner boards.'), when: 'Before and after home matches', open: true }
    ],
    volunteers: [
      { id: 'vo1', name: 'Grace Owusu', email: '', roles: 'Matchday crew, Merch stand', when: 'Home matchdays', status: 'On the crew' },
      { id: 'vo2', name: 'Ricardo Silva', email: '', roles: 'Photo & video', when: 'Home and away', status: 'Contacted' },
      { id: 'vo3', name: 'Megan Price', email: '', roles: 'Social media', when: 'Matchdays', status: 'New' }
    ],
    signups: [
      { id: 'su1', name: 'Jordan Lee', email: '', pos: 'Midfielder', session: 'ss1', when: '2026-10-30' },
      { id: 'su2', name: 'Carlos Medina', email: '', pos: 'Forward', session: 'ss2', when: '2026-10-30' },
      { id: 'su3', name: 'Tobi Ade', email: '', pos: 'Defender', session: 'ss1', when: '2026-10-29' }
    ],
    enquiries: [{ id: 'e1', company: 'Mesquite Motors', pkg: 'Sleeve partner', name: '', email: '', msg: '', when: '2026-10-30' }],
    questions: [],
    donations: [
      { id: 'd1', name: 'Maria G.', kind: 'Monthly', amount: 25, when: '2026-09-12', show: true },
      { id: 'd2', name: 'James T.', kind: 'Monthly', amount: 10, when: '2026-10-02', show: true },
      { id: 'd3', name: 'Aisha B.', kind: 'One-time', amount: 50, when: '2026-10-31', show: true },
      { id: 'd4', name: 'Luis H.', kind: 'Monthly', amount: 25, when: '2026-09-15', show: true },
      { id: 'd5', name: 'Tyler B.', kind: 'One-time', amount: 100, when: '2026-10-28', show: true }
    ],
    donationCfg: { goal: 10000, raisedBase: 3220, supportersBase: 209, monthlyBase: 93 },
    orders: [
      { id: 'DU-1045', name: 'Ana R.', email: 'ana@example.com', phone: '(214) 555-0142', items: 'DU Home Jersey 26/27 · MAMA 10 (M)', lines: [{ id: 'home', name: 'DU Home Jersey 26/27 · MAMA 10', size: 'M', qty: 1, pre: true, custom: { name: 'MAMA', num: '10', check: 'waiting' } }], ship: 'Pick up', total: 105, status: 'Name check', when: '2026-11-03', pre: true },
      { id: 'DU-1044', name: 'Diego F.', email: 'diego@example.com', phone: '(469) 555-0187', items: 'DU Home Jersey 26/27 · D. FLORES 7 (L), DU Away Jersey 26/27 (XL)', lines: [{ id: 'home', name: 'DU Home Jersey 26/27 · D. FLORES 7', size: 'L', qty: 1, pre: true, custom: { name: 'D. FLORES', num: '7', check: 'waiting' } }, { id: 'away', name: 'DU Away Jersey 26/27', size: 'XL', qty: 1, pre: true }], ship: 'Ship', total: 195, status: 'Name check', when: '2026-11-02', pre: true },
      { id: 'DU-1043', name: 'Chris W.', email: 'chris@example.com', phone: '(214) 555-0110', items: 'Founders Scarf · Cream, DU Cap', lines: [{ id: 'f-scarf', name: 'Founders Scarf · Cream', size: '', qty: 1 }, { id: 'cap', name: 'DU Cap', size: '', qty: 1 }], ship: 'Pick up', total: 58, status: 'Paid', when: '2026-11-01' },
      { id: 'DU-1042', name: 'Maria G.', items: 'Home jersey (REYES 6), Scarf', ship: 'Ship', total: 130, status: 'Paid' },
      { id: 'DU-1041', name: 'James T.', items: 'Away jersey', ship: 'Pick up', total: 90, status: 'Picked up' },
      { id: 'DU-1040', name: 'Ana P.', items: 'Kids home jersey ×2', ship: 'Ship', total: 136, status: 'Packed' }
    ],
    subscribers: 1248,
    history: [
      { y: 2025, md: md(0), text: 'Dallas United FC is officially registered with the Texas Premier League.' },
      { y: 2026, md: '09-05', text: 'Dallas United play their first ever match, a 1–1 draw with Arlington Town.' },
      { y: 2026, md: '10-31', text: 'Dallas United win 2–1 away at Fort Worth City.' }
    ],
    bdayCfg: {
      founder: { on: true, email: true, social: false, banner: false, subject: T('Happy birthday, {first}! 🎂'), msg: T('Happy birthday, {first}! As Founder #{number}, you’ve been part of Dallas United from the very first day. Thank you for being part of our family.\n\nEveryone at Dallas United') },
      player: { on: true, email: true, social: true, banner: true, subject: T('Happy birthday from the club, {first}!'), msg: T('Happy birthday to our #{number}, {first} {last}! 🎉 Have a great day, {first}. #WeAreDallas') },
      coach: { on: true, email: true, social: true, banner: false, subject: T('Happy birthday, Coach!'), msg: T('Happy birthday, Coach {last}! 🎂 Thank you for leading Dallas United every day as our {position}. #WeAreDallas') },
      staff: { on: true, email: true, social: false, banner: false, subject: T('Happy birthday, {first}!'), msg: T('Happy birthday, {first}! Thank you for everything you do behind the scenes as our {position}. 💛') },
      club214: { on: true, email: true, social: false, banner: false, subject: T('Happy birthday from the 214, {first}! 🎂'), msg: T('Happy birthday, {first}! As member #{number} of the 214 Club, you’re part of what makes Dallas United special. Have a great day, and see you at the next match. 💛') },
    },
    autos: {
      welcome: { on: true, steps: [
        { when: 'Right after they join', subject: T('Welcome to the family, Founder #{number}'), msg: T('Hi {first},\n\nYou’re officially Founder #{number} of Dallas United, and your name is on the Founders Wall. That number is yours forever.') },
        { when: '3 days later', subject: T('Meet your squad, {first}'), msg: T('Hi {first},\n\nMeet the players you’ll be cheering for. Tap through the Team page to read their stories.') },
        { when: '10 days later', subject: T('Your first match as a founder'), msg: T('Hi {first},\n\nNext up: Dallas United vs {next_opponent} on {next_date}. Founders get first access to kit drops. See you there, Founder #{number}.') }] },
      anniv: { on: true, steps: [{ when: 'Every year on the day they joined', subject: T('Happy founder anniversary, {first}! 💛'), msg: T('{years} year ago today, you became Founder #{number} of Dallas United. Thank you, {first}.') }] },
      milestone: { on: true, steps: [{ when: 'The moment it happens', subject: T('Milestone'), msg: T('{milestone} for {first} {last}! 👏 #WeAreDallas') }] },
      volunteer: { on: true, steps: [{ when: 'At 9:00 PM after each match', subject: T('Thank you for today, {first}!'), msg: T('Thank you for helping at Dallas United vs {match} today, {first}. Final score: {score}. See you at the next one!') }] },
      otd: { on: true, steps: [{ when: 'Every morning on the homepage', subject: T('On this day'), msg: T('On this day in {year}: {event}') }] },
      club214: { on: true, steps: [
        { when: 'Right after they join', subject: T('Welcome to the 214 Club, {first}!'), msg: T('Hi {first},\n\nYou’re member #{number} of the 214 Club. Your member card is ready on your account page. Our next match is against {next_opponent} on {next_date}. Come say hi!') },
        { when: 'Every year on the day they joined', subject: T('Happy 214 anniversary, {first}! 💛'), msg: T('{years} year ago today you joined the 214 Club as member #{number}. Thank you for being with us, {first}.') }] },
      players: { on: true, steps: [
        { when: 'When you press Send', subject: T('Schedule'), msg: T('Hi {first}, here is the Dallas United schedule:\n{schedule}\nTell the coach if you can’t make it.') },
        { when: 'When a match changes', subject: T('Schedule change'), msg: T('Hi {first}, schedule change:\n{changes}\nSee you there!') }] }
    },
    media: []
  };
  DU.DEFAULTS.posts = DU.DEFAULTS.posts.concat(DU.DEFAULTS.newsMore);
  DU.DEFAULTS.videos = DU.DEFAULTS.videos.concat(DU.DEFAULTS.videosMore);
  DU.DEFAULTS.fixtures = DU.DEFAULTS.fixtures.concat(DU.DEFAULTS.fixturesMore);
})();
