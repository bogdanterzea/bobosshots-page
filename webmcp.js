// WebMCP — exposes Bobosshots site information to compatible AI agents.
// Spec: https://webmachinelearning.github.io/webmcp/
// Loaded with `defer`, feature-detected, no DOM mutations, no perf cost on browsers without WebMCP.
(function () {
  'use strict';

  if (typeof navigator === 'undefined' || !navigator.modelContext || typeof navigator.modelContext.provideContext !== 'function') {
    return;
  }

  var photographer = {
    name: 'Terzea Bogdan',
    brand: 'Bobosshots',
    location: 'Sibiu, Romania',
    region: 'RO-SB',
    coordinates: { lat: 45.7983, lng: 24.1256 },
    specialties: [
      'Portrete artistice (studio & outdoor)',
      'Fotografie de evenimente (nunți, botezuri, concerte, corporate)',
      'Fotografie de produs și imobiliare',
      'Travel & outdoor photography',
      'Videografie (reels, shorts, corporate, content creation)'
    ],
    languages: ['ro'],
    website: 'https://bobosshots.com/',
    sitemap: 'https://bobosshots.com/sitemap.xml'
  };

  var contact = {
    instagram: 'https://instagram.com/bobosshots',
    behance: 'https://www.behance.net/bogdanterzea',
    phone: '+40748144371',
    email: 'contact@bobosshots.com',
    serviceArea: 'Sibiu and surroundings; available throughout Romania for events.',
    operatingHours: {
      timezone: 'Europe/Bucharest',
      weekdays: '09:00–18:00',
      saturday: '10:00–16:00',
      sunday: 'closed'
    },
    preferredChannel: 'instagram_dm'
  };

  var portfolio = {
    galleryIndex: 'https://bobosshots.com/galerie',
    categories: [
      { id: 'portrete', name: 'Portrete', url: 'https://bobosshots.com/galerie/portrete', description: 'Studio and outdoor portraits — personal branding, family, artistic.' },
      { id: 'evenimente', name: 'Evenimente', url: 'https://bobosshots.com/galerie/evenimente', description: 'Concerts, baptisms, corporate and private events.' },
      { id: 'produse', name: 'Produse', url: 'https://bobosshots.com/galerie/produse', description: 'Product photography (incl. automotive) for e-commerce and catalogs.' },
      { id: 'travel', name: 'Travel', url: 'https://bobosshots.com/galerie/travel', description: 'Landscape, travel and outdoor content.' }
    ]
  };

  var pricing = {
    currency: 'RON',
    url: 'https://bobosshots.com/preturi',
    markdown: 'https://bobosshots.com/preturi/index.md',
    travelNote: 'Deplasarea în afara Sibiului este asigurată de client.',
    foto: {
      portrete: [
        { tier: 'Basic',    price: 350, durationMin: 30,  locations: 1,    outfits: 1,        editedPhotos: 15,  deliveryDays: 5 },
        { tier: 'Standard', price: 550, durationMin: 60,  locations: 2,    outfits: '2-3',    editedPhotos: 40,  deliveryDays: 7, recommended: true },
        { tier: 'Premium',  price: 850, durationMin: 120, locations: '3+', outfits: 'unlimited', editedPhotos: '70+', deliveryDays: 7 }
      ],
      evenimente: [
        { tier: 'Botez / Privat',     price: 1200, unit: 'event',  durationHours: '3-4', editedPhotos: '150+', deliveryDays: 10 },
        { tier: 'Concert / Festival', price: 2000, unit: 'event',  durationHours: '5-6', editedPhotos: '200+', deliveryDays: 5 },
        { tier: 'Corporate',          price: 200,  unit: 'hour' }
      ],
      produse:    [{ tier: 'Fotografie de Produs', price: 80, unit: 'product' }],
      imobiliare: [{ tier: 'Imobiliare',           price: 500, unit: 'property', editedPhotos: '10-20', deliveryHours: 48 }],
      travel: [
        { tier: 'Content Creation',  price: 1300, unit: 'day', durationHours: '7-8', editedPhotos: '50+' },
        { tier: 'Destination Shoots', price: 'on request' }
      ]
    },
    video: {
      socialMedia: [
        { tier: 'Reel / Short',          price: 400 },
        { tier: 'Video de Prezentare',   price: 700, recommended: true },
        { tier: 'Pack Social Media',     price: 1500 }
      ],
      corporate: [
        { tier: 'Video Corporate',  price: 400, unit: 'hour' },
        { tier: 'Video de Produs',  price: 250, unit: 'product' }
      ],
      contentCreation: [
        { tier: 'Pack Creator',     price: 2200, unit: 'day' }
      ]
    },
    addOns: {
      foto: [
        { item: 'Fotografii Extra (editare suplimentară)', price: 25, unit: 'photo' },
        { item: 'Livrare Express (24-48h)',                price: '+30% of package' },
        { item: 'Ore Extra',                                price: 150, unit: 'hour' }
      ],
      video: [
        { item: 'Editare Suplimentară', price: 100, unit: 'minute' },
        { item: 'Livrare Express (48-72h)', price: '+40% of package' }
      ]
    }
  };

  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'getPhotographerInfo',
        description: 'Returns information about the photographer Terzea Bogdan (Bobosshots): brand, location, specialties, languages.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        execute: function () { return photographer; }
      },
      {
        name: 'getContactInfo',
        description: 'Returns contact details for booking a session: Instagram (preferred), phone, email, service area and operating hours (Europe/Bucharest).',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        execute: function () { return contact; }
      },
      {
        name: 'getPortfolio',
        description: 'Lists portfolio gallery categories (portrete, evenimente, produse, travel) with their URLs and descriptions.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['portrete', 'evenimente', 'produse', 'travel'],
              description: 'Optional: return only the specified category.'
            }
          },
          additionalProperties: false
        },
        execute: function (input) {
          if (input && input.category) {
            var match = portfolio.categories.find(function (c) { return c.id === input.category; });
            return match ? { category: match } : { error: 'Unknown category', validCategories: portfolio.categories.map(function (c) { return c.id; }) };
          }
          return portfolio;
        }
      },
      {
        name: 'getPricing',
        description: 'Returns photography & video service pricing in RON (Sibiu, Romania). Optional service filter: foto-portrete, foto-evenimente, foto-produse, foto-imobiliare, foto-travel, video-social, video-corporate, video-content, addons.',
        inputSchema: {
          type: 'object',
          properties: {
            service: {
              type: 'string',
              enum: ['foto-portrete', 'foto-evenimente', 'foto-produse', 'foto-imobiliare', 'foto-travel', 'video-social', 'video-corporate', 'video-content', 'addons'],
              description: 'Optional: return pricing for a specific service category.'
            }
          },
          additionalProperties: false
        },
        execute: function (input) {
          var meta = { currency: pricing.currency, url: pricing.url, markdown: pricing.markdown, travelNote: pricing.travelNote };
          if (!input || !input.service) return pricing;
          switch (input.service) {
            case 'foto-portrete':    return Object.assign({}, meta, { service: 'foto-portrete',    packages: pricing.foto.portrete });
            case 'foto-evenimente':  return Object.assign({}, meta, { service: 'foto-evenimente',  packages: pricing.foto.evenimente });
            case 'foto-produse':     return Object.assign({}, meta, { service: 'foto-produse',     packages: pricing.foto.produse });
            case 'foto-imobiliare':  return Object.assign({}, meta, { service: 'foto-imobiliare',  packages: pricing.foto.imobiliare });
            case 'foto-travel':      return Object.assign({}, meta, { service: 'foto-travel',      packages: pricing.foto.travel });
            case 'video-social':     return Object.assign({}, meta, { service: 'video-social',     packages: pricing.video.socialMedia });
            case 'video-corporate':  return Object.assign({}, meta, { service: 'video-corporate',  packages: pricing.video.corporate });
            case 'video-content':    return Object.assign({}, meta, { service: 'video-content',    packages: pricing.video.contentCreation });
            case 'addons':           return Object.assign({}, meta, { service: 'addons',           addOns: pricing.addOns });
            default:                 return pricing;
          }
        }
      }
    ]
  });
})();
