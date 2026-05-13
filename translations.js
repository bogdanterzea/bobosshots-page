/**
 * Bobosshots — Romanian/English language switcher
 * Self-contained: injects a flag button, swaps text via dictionary, persists in localStorage.
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'bs_lang';
    const DEFAULT_LANG = 'ro';

    // Romanian → English translation dictionary.
    // Keys are exact, trimmed Romanian strings as they appear on the site.
    const RO_TO_EN = {
        // ---------- Navigation ----------
        'Acasă': 'Home',
        'Portofoliu': 'Portfolio',
        'Galerie': 'Gallery',
        'Servicii': 'Services',
        'Testimoniale': 'Testimonials',
        'Prețuri': 'Pricing',
        'Despre': 'About',
        'Contact': 'Contact',
        'Înapoi': 'Back',

        // ---------- Hero (index) ----------
        'Sibiu, Romania': 'Sibiu, Romania',
        'Fotograf': 'Photographer',
        '✨ Transform momentele tale în amintiri': '✨ Turning your moments into memories',
        'Vezi Portofoliul': 'View Portfolio',
        'Contactează-mă': 'Get in Touch',

        // ---------- Portfolio (index) ----------
        'Lucrările Mele': 'My Work',
        'O selecție din cele mai bune fotografii realizate de-a lungul timpului.': 'A selection of my best photographs taken over the years.',
        'Toate': 'All',
        'Portrete': 'Portraits',
        'Evenimente': 'Events',
        'Auto': 'Cars',
        'Travel': 'Travel',
        'Portret în Natură': 'Portrait in Nature',
        'Concert Live': 'Live Concert',
        'Lac Montan': 'Mountain Lake',
        'Siluetă Artistică': 'Artistic Silhouette',
        'Artist pe Scenă': 'Artist on Stage',
        'Sat Transilvănean': 'Transylvanian Village',
        'Portret de Iarnă': 'Winter Portrait',
        'Eveniment Canin': 'Dog Event',
        'Portret Urban': 'Urban Portrait',
        'Mașini Sport': 'Sports Cars',

        // ---------- Services (index) ----------
        'Ce Ofer': 'What I Offer',
        'Servicii profesionale de fotografie adaptate nevoilor tale.': 'Professional photography services tailored to your needs.',
        'Surprind esența ta autentică în fiecare cadru. Portrete care spun povești.': 'I capture your authentic essence in every frame. Portraits that tell stories.',
        'Explorează': 'Explore',
        'Fiecare moment contează. Imortalizez energia și emoția evenimentelor tale.': 'Every moment matters. I capture the energy and emotion of your events.',
        'Descoperă': 'Discover',
        'Produse & Imobiliare': 'Products & Real Estate',
        'Imagini care vând. Prezint produsele și spațiile tale în cea mai bună lumină.': 'Images that sell. I showcase your products and spaces in the best light.',
        'Vezi proiecte': 'See projects',
        'Peisaje care te transportă. Aventuri vizuale din locuri extraordinare.': 'Landscapes that transport you. Visual adventures from extraordinary places.',
        'Călătorește': 'Travel along',

        // ---------- Testimonials (index) ----------
        'Ce Spun Clienții': 'What Clients Say',
        'Feedback-ul celor cu care am colaborat înseamnă cel mai mult pentru mine.': 'Feedback from those I have worked with means the most to me.',
        'A fost extraordinar. La prima ședință împreună, am căutat zăpadă, nu am găsit zăpadă, am pivotat și mulțumită abilităților tale a ieșit un material extraordinar pe care nici nu mi l-am imaginat până să-l văd... Calitate, adaptabilitate și profesionalism. Recomand 100%':
            'It was amazing. On our first session together we went looking for snow, found none, pivoted, and thanks to your skills we ended up with extraordinary material I hadn\'t even imagined until I saw it... Quality, adaptability and professionalism. 100% recommend.',
        'Am avut marea plăcere să te avem fotograf la concursul canin unde a participat și Akita-ul meu Akimitsu. Modul în care ai interacționat cu el dar și cu ceilalți câini, faptul că ai fost mereu spontan, dornic să prinzi cele mai bune și frumoase unghiuri ne-a făcut experiența extraordinară. S-a văzut și s-a simțit profesionalismul, câinele nu s-a simțit stingher și am apreciat că ai avut atâta răbdare. Mulțumim și abia așteptăm colaborările viitoare!':
            'It was such a pleasure having you as the photographer at the dog show where my Akita Akimitsu competed. The way you interacted with him and the other dogs, your spontaneity, your eagerness to catch the best angles — it made the experience extraordinary. Your professionalism was visible, the dog felt at ease, and we appreciated your patience. Thank you, and we can\'t wait for future collaborations!',
        'Îmi plac tare pozele și clipurile care ies din mânuța ta. E veche amintirea din Portugalia dar știu că dădeai indicații despre cum să stăm ca să iasă pozele cât mai bine și asta mi se pare o chestie mișto că practic îl ajuți pe client și te ajuți și pe tine.':
            'I really love the photos and clips that come out of your hands. The Portugal memory is old, but I remember you guiding us on how to pose so the shots came out great — that\'s a really cool thing because you help both the client and yourself.',
        'A fost o experiență fantastică să te avem ca fotograf în vacanța noastră din Elveția! Pozele au ieșit superbe, iar pentru mine a fost de mare ajutor faptul că m-ai ghidat și îmi spuneai cum să stau în poze. Rezultatul a fost foarte fain: ai reușit să surprinzi momente magice și memorabile. Ești un fotograf foarte talentat și sper să mai colaborăm și în vacanțele viitoare (și nu numai)!':
            'Having you as our photographer on our Switzerland holiday was a fantastic experience! The photos came out gorgeous, and it was a huge help that you guided me and told me how to pose. The result was beautiful — you managed to capture magical, memorable moments. You\'re a very talented photographer and I hope we work together again on future holidays (and beyond)!',
        'Sesiuni lungi, multe cadre și mai multe poze deci în concluzie am avut din ce alege, am râs bine și m-am distrat and I\'ll do it again!':
            'Long sessions, lots of frames and even more photos — so plenty to pick from, lots of laughs, lots of fun, and I\'ll do it again!',
        'Am făcut deja o grămadă de colaborări împreună, de la shooting-uri de model și evenimente, până la poze și shorts prin vacanțe. Ce-mi place cel mai mult la tine e viziunea aia aparte: ai răbdare să cauți cadrul perfect, dar în același timp totul se simte super natural, nimic forțat. Se vede experiența în momentele alea când te oprești brusc și zici: „stai, aici o să iasă ceva fain!". Știi exact cum să ghidezi lucrurile ca să meargă smooth și să scoți ce e mai bun din orice context. Ești un mix fain de profesionalism și vibe relaxat, cu siguranță o să mai colaborăm!':
            'We\'ve already done a ton of collaborations — from model shoots and events to vacation photos and shorts. What I love most is your unique vision: you have the patience to find the perfect frame, yet everything still feels super natural, nothing forced. The experience shows in those moments when you suddenly stop and say "wait, something cool is going to come out of this!". You know exactly how to guide things so they run smoothly and you bring out the best in any context. You\'re a great mix of professionalism and relaxed vibe — we\'ll definitely keep working together!',
        'Am avut ocazia să lucrez de minim 3 ori la proiecte individuale cu Bobo. Rezultatele finale își spun cuvântul profesionalismului, atât din punct de vedere fotografic, dar și calitatea photoshoot-urilor, momente amuzante, zâmbete generate pe moment. Timpul de livrare a fost foarte rapid, deci, încă un plus pentru profesionalismul menționat mai sus. Looking forward to be working again!':
            'I\'ve worked with Bobo on individual projects at least 3 times. The final results speak for themselves in terms of professionalism — the photography, the quality of the shoots, the fun moments, the smiles in the moment. Delivery time was very fast, another plus on top of the professionalism mentioned above. Looking forward to working together again!',
        'Mă simt norocoasă că am avut ocazia să lucrez cu Bobosshots, și cu siguranță colaborarea noastră nu se oprește aici! Pe lângă că îmi dă o stare bună mereu când lucrez cu el, pentru că se simte pasiunea și devotamentul lui, vine și cu idei faine pentru materiale pe care le oferă, deci e super. Să mai zic și faptul că nu am așteptat mult până să primesc materialele făcute de el? E top!':
            'I feel lucky to have had the chance to work with Bobosshots — and our collaboration definitely doesn\'t stop here! Beyond the fact that I always feel great working with him because you can feel his passion and dedication, he also comes with great ideas for the content he delivers, so it\'s amazing. And did I mention I didn\'t wait long to get the materials? Top notch!',

        // ---------- About (index) ----------
        'Despre Mine': 'About Me',
        'Fotograf profesionist cu baza în Sibiu. Pasiunea mea este să capturez emoția autentică din fiecare moment, transformând clipele trecătoare în amintiri de neuitat.':
            'Professional photographer based in Sibiu. My passion is capturing the authentic emotion in every moment, turning fleeting instants into unforgettable memories.',
        'Cu experiență în domeniul fotografiei de portret, evenimente și travel, ofer servicii personalizate care se adaptează perfect viziunii tale.':
            'With experience in portrait, event and travel photography, I offer personalized services that adapt perfectly to your vision.',
        'Proiecte': 'Projects',
        'Clienți Mulțumiți': 'Happy Clients',
        'Ani Experiență': 'Years of Experience',
        'Hai să Colaborăm': 'Let\'s Collaborate',

        // ---------- Contact (index) ----------
        'Hai să Vorbim': 'Let\'s Talk',
        '📩 DM pentru colaborări sau întrebări despre serviciile mele.': '📩 DM me for collaborations or questions about my services.',
        'Disponibil pentru proiecte în Sibiu și împrejurimi.': 'Available for projects in Sibiu and surrounding areas.',
        'Deplasări în toată România pentru evenimente speciale.': 'Travel across Romania for special events.',

        // ---------- Footer ----------
        '© 2026 Terzea Bogdan. Toate drepturile rezervate.': '© 2026 Terzea Bogdan. All rights reserved.',
        '© 2026 Bobosshots. Toate drepturile rezervate.': '© 2026 Bobosshots. All rights reserved.',

        // ---------- Preturi page ----------
        'Servicii & Prețuri': 'Services & Pricing',
        'Pachete flexibile adaptate nevoilor tale. Fiecare proiect este unic, la fel și abordarea mea.':
            'Flexible packages tailored to your needs. Every project is unique — so is my approach.',
        'Notă importantă': 'Important note',
        'Prețurile afișate sunt orientative și pot varia în funcție de cerințele specifice ale proiectului, locație, durată și complexitate.': 'The displayed prices are indicative and may vary depending on specific project requirements, location, duration and complexity.',
        'Pentru o ofertă personalizată, te invit să mă contactezi direct. Fiecare colaborare începe cu o discuție despre viziunea ta.':
            'For a personalized quote, please contact me directly. Every collaboration starts with a conversation about your vision.',
        'Foto': 'Photo',
        'Video': 'Video',
        'Travel & Outdoor': 'Travel & Outdoor',
        'Servicii Extra': 'Extra Services',
        'Ședințe Foto': 'Photo Sessions',
        'Portrete profesionale pentru profiluri, brand personal sau amintiri de familie.':
            'Professional portraits for social profiles, personal branding or family memories.',
        'Basic': 'Basic',
        'Perfect pentru profiluri sociale': 'Perfect for social profiles',
        '30 minute ședință foto': '30 minutes photo session',
        '1 locație': '1 location',
        '1 ținută': '1 outfit',
        '15 fotografii editate': '15 edited photos',
        'Livrare în 5 zile': 'Delivery in 5 days',
        'Solicită Ofertă': 'Request a Quote',
        'Standard': 'Standard',
        'Ideal pentru brand personal': 'Ideal for personal branding',
        '1 oră ședință foto': '1 hour photo session',
        '2 locații': '2 locations',
        '2-3 ținute': '2-3 outfits',
        '40 fotografii editate': '40 edited photos',
        'Livrare în 7 zile': 'Delivery in 7 days',
        'Premium': 'Premium',
        'Experiență completă': 'Complete experience',
        '2 ore ședință foto': '2 hours photo session',
        '3+ locații': '3+ locations',
        'Ținute nelimitate': 'Unlimited outfits',
        '70+ fotografii editate': '70+ edited photos',
        'Acoperire Completă': 'Full Coverage',
        'Concerte, botezuri, evenimente corporate și private - fiecare moment contează.':
            'Concerts, baptisms, corporate and private events — every moment matters.',
        'Botez / Privat': 'Baptism / Private',
        'Evenimente intime și de familie': 'Intimate and family events',
        '3-4 ore acoperire': '3-4 hours coverage',
        'Ceremonie + Restaurant': 'Ceremony + Restaurant',
        '150+ fotografii editate': '150+ edited photos',
        'Fotografii de grup': 'Group photos',
        'Livrare în 10 zile': 'Delivery in 10 days',
        'Concert / Festival': 'Concert / Festival',
        'Energie și momente unice pe scenă': 'Energy and unique moments on stage',
        '/ eveniment': '/ event',
        '5-6 ore acoperire': '5-6 hours coverage',
        '200+ fotografii editate': '200+ edited photos',
        'Fotografii pentru social media': 'Photos for social media',
        'Corporate': 'Corporate',
        'Conferințe, team building, lansări': 'Conferences, team building, launches',
        '/ oră': '/ hour',
        'Tarif orar flexibil': 'Flexible hourly rate',
        'Headshots angajați': 'Employee headshots',
        'Fotografii de eveniment': 'Event photos',
        'Editare profesională': 'Professional editing',
        'Format pentru presă': 'Press-ready format',
        'Fotografie Comercială': 'Commercial Photography',
        'Imagini care vând - pentru e-commerce, cataloage și listări imobiliare.':
            'Images that sell — for e-commerce, catalogs and real estate listings.',
        'Fotografie de Produs': 'Product Photography',
        'E-commerce, cataloage, social media': 'E-commerce, catalogs, social media',
        '/ produs': '/ product',
        'Fundal alb sau lifestyle': 'White background or lifestyle',
        'Multiple unghiuri': 'Multiple angles',
        'Retușare profesională': 'Professional retouching',
        'Format optimizat pentru web': 'Web-optimized format',
        'Reduceri pentru volum mare': 'Bulk volume discounts',
        'Imobiliare': 'Real Estate',
        'Apartamente, case, spații comerciale': 'Apartments, houses, commercial spaces',
        '/ proprietate': '/ property',
        'Interior & Exterior': 'Interior & Exterior',
        '10-20 fotografii editate': '10-20 edited photos',
        'Corecție perspectivă': 'Perspective correction',
        'HDR pentru luminozitate': 'HDR for lighting',
        'Livrare în 48h': 'Delivery in 48h',
        'Aventură & Peisaje': 'Adventure & Landscapes',
        'Colaborări pentru branduri, turism și content creation în locații spectaculoase.':
            'Collaborations for brands, tourism and content creation in spectacular locations.',
        'Content Creation': 'Content Creation',
        'Pentru branduri și influenceri': 'For brands and influencers',
        '/ zi': '/ day',
        '7-8 ore ședință foto': '7-8 hours photo session',
        'Multiple locații': 'Multiple locations',
        '50+ fotografii editate': '50+ edited photos',
        'Format pentru toate platformele': 'Format for all platforms',
        'Drepturi de utilizare incluse': 'Usage rights included',
        'Destination Shoots': 'Destination Shoots',
        'Ședințe foto în călătorii': 'Photo sessions while traveling',
        'La cerere': 'On request',
        'Disponibil în toată România': 'Available across Romania',
        'Posibilitate internațional': 'International possible',
        'Planificare locații': 'Location planning',
        'Flexibilitate program': 'Schedule flexibility',
        'Transport & cazare separate': 'Transport & lodging separate',
        'Discută Proiectul': 'Discuss the Project',
        'Videografie': 'Videography',
        'Video & Social Media': 'Video & Social Media',
        'Conținut video dinamic pentru prezență online puternică și engagement ridicat.':
            'Dynamic video content for a strong online presence and high engagement.',
        'Reel / Short': 'Reel / Short',
        'Perfect pentru TikTok, Reels, Shorts': 'Perfect for TikTok, Reels, Shorts',
        'Video 15-30 secunde': '15-30 second video',
        '1 concept creativ': '1 creative concept',
        'Muzică & tranziții': 'Music & transitions',
        'Format vertical optimizat': 'Optimized vertical format',
        'Video de Prezentare': 'Presentation Video',
        'Video 1-2 minute': '1-2 minute video',
        '2-3 locații': '2-3 locations',
        'Voiceover inclus': 'Voiceover included',
        'Color grading cinematografic': 'Cinematic color grading',
        'Pack Social Media': 'Social Media Pack',
        'Conținut pentru o lună': 'Content for a month',
        '5 reels/shorts': '5 reels/shorts',
        'Scenarii personalizate': 'Custom scripts',
        'Editare cu tranziții trending': 'Editing with trending transitions',
        'Subtitrări incluse': 'Subtitles included',
        'Video Profesional': 'Professional Video',
        'Corporate & Produse': 'Corporate & Products',
        'Videouri profesionale pentru afacerea ta - de la evenimente corporate la prezentări de produs.':
            'Professional videos for your business — from corporate events to product presentations.',
        'Video Corporate': 'Corporate Video',
        'Filmare Full HD': 'Full HD filming',
        'Editare profesională inclusă': 'Professional editing included',
        'Sunet profesional': 'Professional sound',
        'Format pentru presă & social': 'Format for press & social',
        'Video de Produs': 'Product Video',
        'Prezentare dinamică pentru e-commerce': 'Dynamic presentation for e-commerce',
        'Prezentare lifestyle': 'Lifestyle presentation',
        'Multiple unghiuri & detalii': 'Multiple angles & details',
        'Editare cinematografică': 'Cinematic editing',
        'Pentru Creatori': 'For Creators',
        'Video Content Creation': 'Video Content Creation',
        'Colaborări complete pentru branduri și creatori de conținut': 'Full collaborations for brands and content creators',
        'Pack Creator': 'Creator Pack',
        'Soluția completă pentru content creators': 'The complete solution for content creators',
        '8 ore de filmare': '8 hours of filming',
        '3-5 videouri editate': '3-5 edited videos',
        'Scenarii & direcție creativă': 'Scripts & creative direction',
        'Color grading profesional': 'Professional color grading',
        'Adaugă la Pachet': 'Add to Package',
        'Fotografii Extra': 'Extra Photos',
        'Editare suplimentară': 'Additional editing',
        '25 RON / foto': '25 RON / photo',
        'Livrare Express': 'Express Delivery',
        '24-48 ore': '24-48 hours',
        '+30% din pachet': '+30% of package',
        'Ore Extra': 'Extra Hours',
        'Peste durata pachetului': 'Beyond package duration',
        '150 RON / oră': '150 RON / hour',
        'Editare Suplimentară': 'Additional Editing',
        'Peste durata inclusă': 'Beyond included duration',
        '100 RON / minut': '100 RON / minute',
        '48-72 ore': '48-72 hours',
        '+40% din pachet': '+40% of package',
        'Deplasarea în afara Sibiului este asigurată de client.': 'Travel outside Sibiu is covered by the client.',
        'Ai un proiect în minte?': 'Got a project in mind?',
        'Hai să discutăm despre viziunea ta și să găsim pachetul perfect pentru tine.':
            'Let\'s talk about your vision and find the perfect package for you.',
        'Contactează-mă pe Instagram': 'Contact me on Instagram',
        'Sibiu, România • Disponibil pentru deplasări în toată țara': 'Sibiu, Romania • Available for travel nationwide',
        'Add-ons': 'Add-ons',

        // ---------- Gallery pages ----------
        'Galerie Foto': 'Photo Gallery',
        '84 fotografii din portofoliul meu.': '84 photographs from my portfolio.',
        'Fotografii de portret care surprind esența și personalitatea fiecărei persoane.':
            'Portrait photos that capture the essence and personality of each person.',
        'Rezervă o Ședință': 'Book a Session',
        'Concerte, evenimente private și corporate imortalizate profesional.':
            'Concerts, private and corporate events captured professionally.',
        'Rezervă pentru Eveniment': 'Book for an Event',
        'Fotografii comerciale de produse și imobiliare pentru apartamente, clădiri și proprietăți.':
            'Commercial product and real estate photography for apartments, buildings and properties.',
        'Fotografie de călătorie și peisaje care inspiră și captivează.': 'Travel photography and landscapes that inspire and captivate.',
        'Vezi Mai Multe': 'See More',

        // ---------- Aria labels & tooltips ----------
        'Deschide meniul': 'Open menu',
        'Deschide meniu': 'Open menu',
        'Închide meniu': 'Close menu',
        'Închide': 'Close',
        'Scroll la portofoliu': 'Scroll to portfolio',
        'Vizualizare imagine': 'Image viewer',
        'Imaginea anterioară': 'Previous image',
        'Imaginea următoare': 'Next image',
    };

    // Build reverse map (EN → RO) for restoring.
    const EN_TO_RO = Object.create(null);
    for (const ro in RO_TO_EN) {
        EN_TO_RO[RO_TO_EN[ro]] = ro;
    }

    // Translatable HTML attributes.
    const ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];

    function getLang() {
        try {
            return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        } catch (e) {
            return DEFAULT_LANG;
        }
    }

    function setLang(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    }

    function translateString(str, toLang) {
        if (!str) return str;
        const trimmed = str.trim();
        if (!trimmed) return str;
        const map = toLang === 'en' ? RO_TO_EN : EN_TO_RO;
        const translated = map[trimmed];
        if (!translated) return str;
        // Preserve surrounding whitespace.
        return str.replace(trimmed, translated);
    }

    function walkTextNodes(root, callback) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentNode;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.nodeName;
                    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
                    // Skip nodes inside the language switcher itself.
                    if (parent.closest && parent.closest('#bs-lang-switcher')) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        let n;
        while ((n = walker.nextNode())) callback(n);
    }

    function applyLanguage(lang) {
        // Translate text nodes.
        walkTextNodes(document.body, function (node) {
            const translated = translateString(node.nodeValue, lang);
            if (translated !== node.nodeValue) node.nodeValue = translated;
        });

        // Translate attributes.
        const all = document.body.querySelectorAll('*');
        for (let i = 0; i < all.length; i++) {
            const el = all[i];
            if (el.closest('#bs-lang-switcher')) continue;
            for (let j = 0; j < ATTRS.length; j++) {
                const attr = ATTRS[j];
                if (el.hasAttribute(attr)) {
                    const original = el.getAttribute(attr);
                    const translated = translateString(original, lang);
                    if (translated !== original) el.setAttribute(attr, translated);
                }
            }
        }

        // Translate <title>.
        if (document.title) {
            // Title strings vary per page — translate per-page title parts.
            document.title = translatePageTitle(document.title, lang);
        }

        // Update <html lang>.
        document.documentElement.setAttribute('lang', lang);

        // Update the switcher's own label.
        updateSwitcherLabel(lang);
    }

    // Title translation: split on the divider used across the site ("|" or "-").
    function translatePageTitle(title, lang) {
        // Common page-title fragments seen in this site.
        const titleMap = {
            'Bobosshots | Terzea Bogdan Fotograf - Sibiu': 'Bobosshots | Terzea Bogdan Photographer - Sibiu',
            'Prețuri Servicii Foto | Bobosshots - Fotograf Sibiu': 'Photo Services Pricing | Bobosshots - Sibiu Photographer',
            'Galerie Foto | Bobosshots - Fotograf Sibiu': 'Photo Gallery | Bobosshots - Sibiu Photographer',
            'Fotografie Produs & Auto | Bobosshots - Fotograf Sibiu': 'Product & Car Photography | Bobosshots - Sibiu Photographer',
            'Fotografie Evenimente | Bobosshots - Fotograf Sibiu': 'Event Photography | Bobosshots - Sibiu Photographer',
            'Travel Photography România | Bobosshots - Fotograf Sibiu': 'Travel Photography Romania | Bobosshots - Sibiu Photographer',
            'Galerie Portrete | Bobosshots - Fotograf Sibiu': 'Portrait Gallery | Bobosshots - Sibiu Photographer',
        };
        if (lang === 'en' && titleMap[title]) return titleMap[title];
        if (lang === 'ro') {
            for (const ro in titleMap) {
                if (titleMap[ro] === title) return ro;
            }
        }
        return title;
    }

    function buildSwitcher() {
        if (document.getElementById('bs-lang-switcher')) return;

        const style = document.createElement('style');
        style.id = 'bs-lang-switcher-style';
        style.textContent = `
            #bs-lang-switcher {
                position: fixed;
                top: 20px;
                right: 16px;
                z-index: 10000;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 10px;
                background: rgba(10, 10, 10, 0.85);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 999px;
                cursor: pointer;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 600;
                color: #fff;
                user-select: none;
                line-height: 1;
                transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            }
            #bs-lang-switcher:hover {
                background: rgba(67, 56, 202, 0.9);
                border-color: rgba(99, 102, 241, 0.7);
                transform: translateY(-1px);
            }
            #bs-lang-switcher:active { transform: translateY(0); }
            #bs-lang-switcher .bs-flag {
                display: inline-flex;
                width: 22px;
                height: 16px;
                border-radius: 3px;
                overflow: hidden;
                box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
                vertical-align: middle;
                flex-shrink: 0;
            }
            #bs-lang-switcher .bs-flag svg {
                width: 100%;
                height: 100%;
                display: block;
            }
            #bs-lang-switcher .bs-code { letter-spacing: 0.5px; }
            /* Avoid clashing with existing top-right buttons (hamburger / Contact) on narrow viewports. */
            @media (max-width: 1279px) {
                #bs-lang-switcher { right: 64px; }
            }
            @media (max-width: 767px) {
                #bs-lang-switcher {
                    top: 22px;
                    right: 60px;
                    padding: 5px 9px;
                    font-size: 12px;
                }
                #bs-lang-switcher .bs-flag {
                    width: 20px;
                    height: 14px;
                }
            }
        `;
        document.head.appendChild(style);

        const btn = document.createElement('button');
        btn.id = 'bs-lang-switcher';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Switch language / Schimbă limba');
        btn.innerHTML = '<span class="bs-flag"></span><span class="bs-code"></span>';
        btn.addEventListener('click', function () {
            const current = getLang();
            const next = current === 'ro' ? 'en' : 'ro';
            setLang(next);
            applyLanguage(next);
        });
        document.body.appendChild(btn);
        updateSwitcherLabel(getLang());
    }

    const FLAG_SVG = {
        ro: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" preserveAspectRatio="none">' +
            '<rect width="1" height="2" fill="#002B7F"/>' +
            '<rect x="1" width="1" height="2" fill="#FCD116"/>' +
            '<rect x="2" width="1" height="2" fill="#CE1126"/>' +
            '</svg>',
        en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" preserveAspectRatio="none">' +
            '<rect width="60" height="30" fill="#012169"/>' +
            '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>' +
            '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2"/>' +
            '<path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/>' +
            '<path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/>' +
            '</svg>'
    };

    function updateSwitcherLabel(lang) {
        const btn = document.getElementById('bs-lang-switcher');
        if (!btn) return;
        const flag = btn.querySelector('.bs-flag');
        const code = btn.querySelector('.bs-code');
        // The button shows the language you'd switch TO on click.
        const target = lang === 'ro' ? 'en' : 'ro';
        flag.innerHTML = FLAG_SVG[target];
        code.textContent = target.toUpperCase();
        // aria-label must contain the visible text (Lighthouse "label-content-name-mismatch").
        const title = target === 'en' ? 'Switch to English' : 'Schimbă în Română';
        btn.setAttribute('title', title);
        btn.setAttribute('aria-label', target.toUpperCase() + ' — ' + title);
    }

    function init() {
        buildSwitcher();
        const lang = getLang();
        if (lang !== DEFAULT_LANG) applyLanguage(lang);
        else updateSwitcherLabel(lang);
        // Reveal body once translation is applied (no-op for users who never set lang).
        // Paired with the inline pre-paint snippet in each page's <head> that hides
        // the body when the stored language is not the default (avoiding flash of RO).
        document.documentElement.removeAttribute('data-lang-pending');
    }

    // Safety net: if the script ever fails to run (parse error, blocked, etc.),
    // remove the pre-paint hide attribute after 2s so the page is never stuck blank.
    setTimeout(function () {
        document.documentElement.removeAttribute('data-lang-pending');
    }, 2000);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
