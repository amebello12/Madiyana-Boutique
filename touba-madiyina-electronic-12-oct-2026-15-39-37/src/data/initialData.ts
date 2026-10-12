import { Product, Category, Article, CustomPage, Review, SenegalZone, Coupon, StoreSettings, Order } from '../types';
import { importedCategories, importedCatalogProducts } from './importedCatalog';

export const initialStoreSettings: StoreSettings = {
  name: 'TOUBA MADIYINA ELECTRONIC',
  slogan: 'Achetez simplement, recevez rapidement',
  phone: '+221 77 536 34 37',
  contactPhone: '77 536 34 37',
  whatsappNumber: '221775363437',
  email: 'contact@toubamadiyina.sn',
  address: 'Boulevard Général de Gaulle, Angle Rue 22, Sandaga / Médina, Dakar, Sénégal',
  mapsLandmark: 'Angle Rue 22 x Boulevard Général de Gaulle (Face Marché Sandaga & Médina)',
  mapsCoordinates: '14.6853, -17.4475',
  mapsOpeningHours: 'Du Lundi au Samedi : 08h30 - 20h30 (Dimanche sur RDV / Permanence WhatsApp)',
  announcementText: '🚚 Livraison express à Dakar (Même Jour) | 💳 Paiement à la livraison | 📱 Wave & Orange Money 100% Sécurisé',
  freeShippingMinAmount: 150000,
  promoBannerActive: true,
  promoBannerTitle: '🔥 GRANDES PROMOTIONS',
  promoBannerSubtitle: 'Profitez de nos offres exceptionnelles avant la fin du stock disponible à Dakar. Jusqu\'à -45% sur les smartphones, TV et climatiseurs.',
  socialLinks: {
    facebook: 'https://facebook.com/toubamadiyina',
    instagram: 'https://instagram.com/toubamadiyina',
    tiktok: 'https://tiktok.com/@toubamadiyina',
    whatsapp: 'https://wa.me/221775363437'
  }
};

export const initialSenegalZones: SenegalZone[] = [
  {
    id: 'dakar-centre',
    name: 'Dakar Centre & Plateau',
    fee: 1500,
    deliveryTime: '2h à 4h (Express)',
    districts: ['Plateau', 'Médina', 'Fann', 'Point E', 'Mermoz', 'Gueule Tapée', 'Colobane', 'Fass']
  },
  {
    id: 'dakar-residentiel',
    name: 'Dakar Ouest & Almadies',
    fee: 1500,
    deliveryTime: '3h à 5h (Express)',
    districts: ['Almadies', 'Ngor', 'Ouakam', 'Mamelles', 'Yoff', 'Virage', 'Sacre-Cœur', 'Liberté 1 à 6', 'Sotrac']
  },
  {
    id: 'dakar-nord',
    name: 'Dakar Nord & Parcelles',
    fee: 1500,
    deliveryTime: 'Livraison le jour même',
    districts: ['Parcelles Assainies', 'Grand Yoff', 'Nord Foire', 'Ouest Foire', 'Maristes', 'Hann Bel-Air', 'Patte d\'Oie']
  },
  {
    id: 'dakar-banlieue',
    name: 'Banlieue de Dakar (Pikine & Guédiawaye)',
    fee: 2000,
    deliveryTime: '24h maximum',
    districts: ['Pikine', 'Guédiawaye', 'Thiaroye', 'Yeumbeul', 'Keur Massar', 'Malika', 'Mbao', 'Tivaouane Peulh']
  },
  {
    id: 'rufisque-diamniadio',
    name: 'Rufisque & Diamniadio / Pôle Urbain',
    fee: 2500,
    deliveryTime: '24h',
    districts: ['Rufisque Centre', 'Bargny', 'Sébikotane', 'Diamniadio', 'Sendou', 'Jaxaay']
  },
  {
    id: 'thies-mbour',
    name: 'Thiès, Mbour & Petite Côte',
    fee: 3500,
    deliveryTime: '24h à 48h',
    districts: ['Thiès Ville', 'Mbour', 'Saly Portudal', 'Somone', 'Ngaparou', 'Popenguine', 'Tivaouane']
  },
  {
    id: 'senegal-regions',
    name: 'Autres Régions du Sénégal (GP / Expédition)',
    fee: 4500,
    deliveryTime: '48h à 72h',
    districts: ['Touba / Diourbel', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Tambacounda', 'Kolda', 'Fatick', 'Louga', 'Matam', 'Kédougou']
  }
];

export const initialCategories: Category[] = [
  {
    id: 'telephones-accessoires',
    name: 'Téléphones & Accessoires',
    slug: 'telephones-accessoires',
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    description: 'Smartphones récents Samsung, iPhone, Xiaomi, Tecno, Infinix, chargeurs rapides et écouteurs.',
    itemCount: 14
  },
  {
    id: 'informatique',
    name: 'Informatique & Bureautique',
    slug: 'informatique',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    description: 'PC Portables HP, Dell, MacBook, imprimantes, écrans et disques SSD.',
    itemCount: 8
  },
  {
    id: 'tv-audio',
    name: 'TV & Home Cinéma',
    slug: 'tv-audio',
    icon: '📺',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    description: 'Téléviseurs Smart 4K UHD, barres de son, enceintes Bluetooth JBL et systèmes audio.',
    itemCount: 10
  },
  {
    id: 'electromenager',
    name: 'Électroménager',
    slug: 'electromenager',
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    description: 'Climatiseurs Inverter économiques, réfrigérateurs, congélateurs, lave-linge.',
    itemCount: 12
  },
  {
    id: 'maison-cuisine',
    name: 'Maison & Petit Électroménager',
    slug: 'maison-cuisine',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    description: 'Air Fryers, micro-ondes, mixeurs, cafetières, robots de cuisine et aspirateurs.',
    itemCount: 9
  },
  {
    id: 'accessoires-gadgets',
    name: 'Audio & Accessoires',
    slug: 'accessoires-gadgets',
    icon: '🎧',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Casques anti-bruit, montres connectées, powerbanks 20000mAh, trépieds et gadgets.',
    itemCount: 11
  },
  {
    id: 'solaire-energie',
    name: 'Solaire & Énergie',
    slug: 'solaire-energie',
    icon: '☀️',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    description: 'Ventilateurs rechargeables solaires, projecteurs LED solaires pour Dakar et régions.',
    itemCount: 6
  },
  {
    id: 'promotions-flash',
    name: '🔥 Grandes Promotions',
    slug: 'promotions-flash',
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    description: 'Les meilleures réductions jusqu\'à -45% sur tout notre stock disponible.',
    itemCount: 15
  },
  ...importedCategories
];

export const initialProducts: Product[] = [
  {
    id: 'prod-samsung-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 5G (512 Go / 12 Go RAM) - Titanium Black',
    slug: 'samsung-galaxy-s24-ultra-512go',
    sku: 'TME-SAMS24U-512',
    price: 685000,
    compareAtPrice: 790000,
    discountPercentage: 13,
    category: 'telephones-accessoires',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Le flagship ultime de Samsung avec Galaxy AI intégrée, processeur Snapdragon 8 Gen 3 for Galaxy, capteur photo 200 MP révolutionnaire et stylet S-Pen intégré. Écran Dynamic AMOLED 2X 120Hz anti-reflet parfait sous le soleil de Dakar.',
    features: [
      'Galaxy AI : Traduction instantanée des appels et retouche photo magique',
      'Écran plat Dynamic AMOLED 2X 6.8" 120Hz avec verre Gorilla Armor',
      'Quadruple capteur photo 200 MP + zoom optique x5 et x10 Space Zoom',
      'Batterie longue durée 5000 mAh avec charge ultra rapide 45W',
      'Cadre en titane ultra résistant et certification IP68 étanche'
    ],
    specs: {
      'Écran': '6.8 pouces Dynamic AMOLED 2X QHD+ (3120 x 1440)',
      'Processeur': 'Snapdragon 8 Gen 3 (4nm)',
      'RAM / Stockage': '12 Go RAM / 512 Go UFS 4.0',
      'Appareil Photo': '200 MP + 50 MP (Périscope) + 12 MP + 10 MP / Frontal 12 MP',
      'Batterie': '5000 mAh compatible charge rapide et sans fil',
      'Réseau': 'Double SIM physique + eSIM / 5G Sénégal'
    },
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnds: '2026-08-28T23:59:59Z',
    rating: 4.9,
    reviewCount: 42,
    tags: ['Samsung', 'Smartphone', '5G', 'Flagship', 'Galaxy AI', 'Promo'],
    warranty: 'Garantie 24 Mois Samsung Sénégal',
    createdAt: '2026-08-01',
    shopifyHandle: 'samsung-galaxy-s24-ultra-512go'
  },
  {
    id: 'prod-smart-tv-samsung-65',
    title: 'Smart TV Samsung 65" Crystal UHD 4K (Modèle 2026) - HDR10+ & Tizen OS',
    slug: 'smart-tv-samsung-65-crystal-4k',
    sku: 'TME-TV-SAM65-4K',
    price: 345000,
    compareAtPrice: 420000,
    discountPercentage: 18,
    category: 'tv-audio',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Plongez dans des images d\'un réalisme saisissant avec la technologie Dynamic Crystal Color. Résolution 4K UHD pure, processeur Crystal 4K, compatibilité Netflix, YouTube, Canal+ et IPTV préinstallés. Son immersif OTS Lite et design ultrafin sans bordure.',
    features: [
      'Résolution 4K Ultra HD (3840 x 2160 pixels) avec HDR10+',
      'Système Smart TV Tizen avec toutes les applications (Netflix, YouTube, Shahid, Canal+)',
      'Mode Gaming ultra fluide et connectivité AirPlay 2 / Smart View',
      'Télécommande écologique SolarCell rechargeable à la lumière',
      '3 ports HDMI 2.1, 2 ports USB, Bluetooth 5.2 et Wi-Fi 5'
    ],
    specs: {
      'Taille écran': '65 pouces (163 cm de diagonale)',
      'Définition': '3840 x 2160 (4K UHD)',
      'Audio': '20W RMS avec Q-Symphony & Dolby Digital Plus',
      'Connectivité': '3x HDMI, 2x USB, Wi-Fi, Ethernet, Bluetooth, Optique',
      'Consommation': 'Éco-énergétique Classe A+'
    },
    inStock: true,
    stockCount: 5,
    isFeatured: true,
    isFlashSale: false,
    rating: 4.8,
    reviewCount: 31,
    tags: ['TV', 'Samsung', '4K', 'Smart TV', 'Salon', 'Dakar'],
    warranty: 'Garantie 12 Mois avec assistance SAV à Dakar',
    createdAt: '2026-08-02',
    shopifyHandle: 'smart-tv-samsung-65-crystal-4k'
  },
  {
    id: 'prod-climatiseur-gree-12000',
    title: 'Climatiseur Split Inverter Gree 12000 BTU (1.5 CV) - Gaz R32 Ultra Économique',
    slug: 'climatiseur-split-inverter-gree-12000-btu',
    sku: 'TME-CLIM-GREE12K',
    price: 215000,
    compareAtPrice: 260000,
    discountPercentage: 17,
    category: 'electromenager',
    brand: 'Gree',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Le climatiseur le plus prisé à Dakar pour résister à la chaleur et à l\'humidité tropicale. Technologie Inverter Gree permettant jusqu\'à 60% d\'économie sur votre facture Senelec. Refroidissement turbo en 60 secondes, filtre antibactérien et fonctionnement silencieux.',
    features: [
      'Technologie Inverter : Réduction massive de la consommation électrique Senelec',
      'Gaz écologique R32 à haut rendement thermique',
      'Filtre à haute densité anti-poussière et purification d\'air intégrée',
      'Mode Nuit silencieux (seulement 24 dB)',
      'Revêtement Golden Fin anti-corrosion résistant à l\'air marin de Dakar'
    ],
    specs: {
      'Puissance': '12 000 BTU (1.5 CV)',
      'Surface conseillée': '15 à 25 m²',
      'Gaz réfrigérant': 'R32 écologique',
      'Niveau sonore': '24 à 38 dB',
      'Alimentation': '220-240V / 50Hz (Protection contre surtensions Senelec)'
    },
    inStock: true,
    stockCount: 12,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnds: '2026-08-25T18:00:00Z',
    rating: 4.9,
    reviewCount: 56,
    tags: ['Climatiseur', 'Gree', 'Inverter', 'Électroménager', 'Senelec Éco'],
    warranty: 'Garantie 2 Ans sur Compresseur + Kit de pose inclus',
    createdAt: '2026-08-03',
    shopifyHandle: 'climatiseur-split-inverter-gree-12000-btu'
  },
  {
    id: 'prod-iphone-15-pro-max',
    title: 'Apple iPhone 15 Pro Max (256 Go) - Titane Naturel',
    slug: 'apple-iphone-15-pro-max-256go',
    sku: 'TME-IPH15PM-256',
    price: 765000,
    compareAtPrice: 850000,
    discountPercentage: 10,
    category: 'telephones-accessoires',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Forgé dans le titane de qualité aérospatiale. Puce A17 Pro ultra-puissante pour des performances graphiques incomparables, bouton Action personnalisable et téléobjectif 5x. Port USB-C universel.',
    features: [
      'Design en titane naturel léger et résistant',
      'Puce A17 Pro avec GPU 6 cœurs pour le gaming niveau console',
      'Téléobjectif optique 5x de 120 mm pour des portraits époustouflants',
      'Bouton Action programmable pour accès instantané',
      'Autonomie record jusqu\'à 29 heures de lecture vidéo'
    ],
    specs: {
      'Écran': '6.7 pouces Super Retina XDR OLED ProMotion 120Hz',
      'Puce': 'A17 Pro (3nm)',
      'Capacité': '256 Go NVMe',
      'Caméras': '48 MP principal + 12 MP ultra grand-angle + 12 MP téléobjectif 5x',
      'Connecteur': 'USB-C (USB 3 jusqu\'à 10 Gbit/s)',
      'Réseaux': 'Compatible 5G Orange / Free Sénégal, Wi-Fi 6E'
    },
    inStock: true,
    stockCount: 6,
    isFeatured: true,
    isFlashSale: false,
    rating: 5.0,
    reviewCount: 48,
    tags: ['Apple', 'iPhone', 'iOS', 'Titane', 'Prestige'],
    warranty: 'Garantie 1 An Apple Care officielle',
    createdAt: '2026-08-04',
    shopifyHandle: 'apple-iphone-15-pro-max-256go'
  },
  {
    id: 'prod-refrigerateur-innova-nofrost',
    title: 'Réfrigérateur Combiné Innova No Frost 320L - Inox Anti-traces & Distributeur d\'eau',
    slug: 'refrigerateur-combine-innova-320l-nofrost',
    sku: 'TME-FRIDGE-INN320',
    price: 265000,
    compareAtPrice: 310000,
    discountPercentage: 14,
    category: 'electromenager',
    brand: 'Innova',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Le réfrigérateur familial parfait pour conserver vos aliments frais plus longtemps au Sénégal. Froid ventilé Total No Frost évitant la corvée de dégivrage, distributeur d\'eau fraîche en façade sans raccordement et clayettes en verre trempé haute résistance.',
    features: [
      'Total No Frost : Zéro givre dans le congélateur et froid homogène',
      'Distributeur d\'eau fraîche intégré sur la porte avant',
      'Compartiment fraîcheur Moist Balance Crisper pour fruits & légumes',
      'Éclairage LED doux et économe en énergie',
      'Portes réversibles et pieds réglables'
    ],
    specs: {
      'Volume Total': '320 Litres (Réfrigérateur 225L / Congélateur 95L)',
      'Technologie Froid': 'No Frost Multi Air Flow',
      'Dimensions (H x L x P)': '178 x 60 x 65 cm',
      'Gaz': 'R600a éco-friendly',
      'Finition': 'Acier inoxydable brossé anti-traces de doigts'
    },
    inStock: true,
    stockCount: 7,
    isFeatured: true,
    isFlashSale: false,
    rating: 4.7,
    reviewCount: 22,
    tags: ['Réfrigérateur', 'Innova', 'NoFrost', 'Cuisine', 'Électroménager'],
    warranty: 'Garantie 12 Mois pièces et main d\'œuvre',
    createdAt: '2026-08-05',
    shopifyHandle: 'refrigerateur-combine-innova-320l-nofrost'
  },
  {
    id: 'prod-air-fryer-ninja-dual',
    title: 'Friteuse sans Huile Air Fryer Double Bac 8.5L XXL - 2400W & Cuisson Synchronisée',
    slug: 'air-fryer-double-bac-8l5-xxl',
    sku: 'TME-AIRFRY-85L',
    price: 58000,
    compareAtPrice: 75000,
    discountPercentage: 22,
    category: 'maison-cuisine',
    brand: 'MasterCook Pro',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Cuisinez des repas sains et croustillants avec 85% d\'huile en moins ! Deux compartiments indépendants pour cuire simultanément vos poissons braisés dakarois, frites croustillantes, poulet rôti ou beignets avec fin de cuisson synchronisée.',
    features: [
      'Double bac indépendant (2 x 4.25L) capacité totale 8.5 Litres',
      '8 programmes automatiques tactiles (Frites, Viande, Poisson, Gâteaux, Déshydratation)',
      'Technologie DualZone avec synchronisation intelligente des deux bacs',
      'Revêtement antiadhésif sans BPA facile à nettoyer au lave-vaisselle',
      'Puissance 2400W pour une cuisson 50% plus rapide qu\'un four traditionnel'
    ],
    specs: {
      'Capacité': '8.5 Litres (Pour 6 à 8 personnes)',
      'Puissance': '2400 Watts',
      'Thermostat': 'Réglable de 50°C à 220°C',
      'Minuteur': 'Jusqu\'à 60 minutes avec arrêt automatique',
      'Poids': '7.2 kg'
    },
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnds: '2026-08-26T21:00:00Z',
    rating: 4.9,
    reviewCount: 64,
    tags: ['Air Fryer', 'Cuisine', 'Tendance', 'Healthy', 'Maison'],
    warranty: 'Garantie 1 An échange à neuf en cas de panne',
    createdAt: '2026-08-06',
    shopifyHandle: 'air-fryer-double-bac-8l5-xxl'
  },
  {
    id: 'prod-casque-jbl-tune-770nc',
    title: 'Casque Bluetooth JBL Tune 770NC - Réduction de Bruit Active & 70h d\'Autonomie',
    slug: 'casque-bluetooth-jbl-tune-770nc',
    sku: 'TME-JBL-770NC',
    price: 45000,
    compareAtPrice: 59000,
    discountPercentage: 23,
    category: 'accessoires-gadgets',
    brand: 'JBL',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Le son emblématique JBL Pure Bass avec Réduction de Bruit Adaptative True ANC. Parfait pour les transports et le travail au calme. Jusqu\'à 70 heures d\'autonomie en sans-fil, recharge rapide (5 min = 3 heures de musique).',
    features: [
      'Son Pure Bass JBL puissant et équilibré',
      'Réduction active du bruit adaptative avec Smart Ambient',
      'Bluetooth 5.3 avec connexion multipoint (PC + Smartphone en simultané)',
      'Autonomie record : 70h (ANC désactivée) / 44h (ANC activée)',
      'Microphones intégrés pour des appels limpides'
    ],
    specs: {
      'Transducteurs': '40 mm dynamiques',
      'Autonomie': 'Jusqu\'à 70 heures',
      'Temps de charge': '2 heures (USB-C)',
      'Poids': '232 g (Pliable et ultra confortable)',
      'Connexion': 'Bluetooth 5.3 + Câble jack audio 3.5mm inclus'
    },
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    isFlashSale: false,
    rating: 4.8,
    reviewCount: 39,
    tags: ['JBL', 'Casque', 'Audio', 'Bluetooth', 'Noise Cancelling'],
    warranty: 'Garantie 6 Mois officielle',
    createdAt: '2026-08-07',
    shopifyHandle: 'casque-bluetooth-jbl-tune-770nc'
  },
  {
    id: 'prod-ventilateur-solaire-rechargeable',
    title: 'Ventilateur Solaire Rechargeable 16" Haute Vitesse avec Panneau Solaire & Lampe LED',
    slug: 'ventilateur-solaire-rechargeable-16-pouces',
    sku: 'TME-SOLAR-FAN16',
    price: 32000,
    compareAtPrice: 42000,
    discountPercentage: 23,
    category: 'solaire-energie',
    brand: 'SunPower Senegal',
    images: [
      'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Ne souffrez plus des coupures d\'électricité ! Ventilateur rechargeable autonome équipé d\'un panneau solaire externe 9V 12W, d\'un projecteur LED de secours et d\'un port USB pour charger vos téléphones. Autonomie de 8 à 14 heures.',
    features: [
      'Rechargeable sur secteur (220V Senelec) ET avec son panneau solaire inclus',
      'Batterie Lithium haute capacité 12V 4.5Ah longue durée',
      '3 vitesses de ventilation silencieuse avec oscillation automatique 90°',
      'Port USB 5V pour recharger smartphones et lampes',
      'Télécommande sans fil et minuterie intégrée'
    ],
    specs: {
      'Diamètre': '16 pouces (40 cm) à 5 pales aérodynamiques',
      'Panneau Solaire': 'Poly-cristallin 12W avec câble de 5 mètres',
      'Autonomie': '8h en vitesse max, jusqu\'à 14h en vitesse moyenne',
      'Éclairage': 'Veilleuse LED 18 ampoules intégrée',
      'Hauteur': 'Ajustable jusqu\'à 135 cm'
    },
    inStock: true,
    stockCount: 30,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnds: '2026-08-30T23:59:59Z',
    rating: 4.9,
    reviewCount: 78,
    tags: ['Solaire', 'Ventilateur', 'Autonomie', 'Anti-Délestage', 'Sénégal'],
    warranty: 'Garantie 6 Mois avec pièces de rechange disponibles',
    createdAt: '2026-08-08',
    shopifyHandle: 'ventilateur-solaire-rechargeable-16-pouces'
  },
  {
    id: 'prod-ordinateur-hp-pavilion-15',
    title: 'PC Portable HP Pavilion 15.6" Full HD (Intel Core i7 13e Gén / 16 Go RAM / 512 Go SSD)',
    slug: 'pc-portable-hp-pavilion-15-core-i7',
    sku: 'TME-HP-PAV15-I7',
    price: 435000,
    compareAtPrice: 495000,
    discountPercentage: 12,
    category: 'informatique',
    brand: 'HP',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'L\'ordinateur idéal pour les étudiants, professionnels, graphistes et télétravailleurs à Dakar. Processeur Intel Core i7 1355U, 16 Go de mémoire vive pour un multitâche ultra rapide et SSD NVMe ultra réactif. Clavier rétroéclairé avec pavé numérique et Windows 11 Pro activé.',
    features: [
      'Processeur Intel Core i7-1355U (10 cœurs jusqu\'à 5.0 GHz Turbo)',
      '16 Go RAM DDR4 3200MHz pour naviguer sans aucun ralentissement',
      'Stockage 512 Go SSD NVMe M.2 ultra rapide (Démarrage en 7 secondes)',
      'Écran 15.6" IPS Full HD Micro-Bords anti-reflets',
      'Audio Bang & Olufsen puissant et webcam HD avec réduction de bruit'
    ],
    specs: {
      'Écran': '15.6 pouces Full HD IPS (1920 x 1080)',
      'Processeur': 'Intel Core i7 13th Gen',
      'Graphiques': 'Intel Iris Xe Graphics',
      'Connectique': '1x USB-C 10Gbps, 2x USB-A, 1x HDMI 2.1, Jack 3.5mm',
      'Batterie': 'Autonomie jusqu\'à 8h30 avec charge rapide (50% en 45 min)'
    },
    inStock: true,
    stockCount: 9,
    isFeatured: false,
    isFlashSale: false,
    rating: 4.8,
    reviewCount: 19,
    tags: ['HP', 'Laptop', 'Core i7', 'Informatique', 'Bureautique'],
    warranty: 'Garantie 12 Mois HP Sénégal + Sacoche offerte',
    createdAt: '2026-08-09',
    shopifyHandle: 'pc-portable-hp-pavilion-15-core-i7'
  },
  {
    id: 'prod-lave-linge-midea-8kg',
    title: 'Machine à Laver Automatique Midea 8 kg - Moteur Inverter & Vapeur Anti-allergies',
    slug: 'machine-a-laver-midea-8kg-inverter',
    sku: 'TME-WASH-MID8KG',
    price: 220000,
    compareAtPrice: 260000,
    discountPercentage: 15,
    category: 'electromenager',
    brand: 'Midea',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Prenez soin du linge de toute la famille avec ce lave-linge frontal intelligent. Moteur Inverter Quattro silencieux et économe en eau/électricité, programme Express 15 minutes et fonction Steam Care qui élimine 99.9% des bactéries et plis.',
    features: [
      'Capacité 8 kg idéale pour les familles sénégalaises',
      'Moteur Inverter Quattro : 70% d\'énergie économisée et silence absolu',
      'Technologie Vapeur Hygiène & Anti-froissage',
      '14 programmes de lavage adaptés à tous les tissus (Boubous, Coton, Laine, Synthétique)',
      'Essorage rapide 1400 tours/minute pour un séchage ultra rapide'
    ],
    specs: {
      'Capacité': '8 Kilogrammes',
      'Vitesse d\'essorage': '1400 tr/min',
      'Classe énergétique': 'A+++',
      'Tambour': 'Acier inoxydable Water Cube Drum doux pour les vêtements',
      'Dimensions': '85 x 59.5 x 56.5 cm'
    },
    inStock: true,
    stockCount: 4,
    isFeatured: false,
    isFlashSale: false,
    rating: 4.9,
    reviewCount: 16,
    tags: ['Machine à laver', 'Midea', 'Inverter', 'Lavage', 'Maison'],
    warranty: 'Garantie 2 Ans sur la machine, 10 ans sur le moteur',
    createdAt: '2026-08-10',
    shopifyHandle: 'machine-a-laver-midea-8kg-inverter'
  },
  {
    id: 'prod-powerbank-oraimo-30000',
    title: 'Batterie Externe Oraimo PowerBox 30000 mAh - Charge Rapide 22.5W & Écran LED',
    slug: 'batterie-externe-oraimo-30000mah-22w5',
    sku: 'TME-ORA-PB30K',
    price: 18500,
    compareAtPrice: 25000,
    discountPercentage: 26,
    category: 'accessoires-gadgets',
    brand: 'Oraimo',
    images: [
      'https://images.unsplash.com/photo-1609592426815-585bb044fbe0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Une réserve d\'énergie colossale dans votre sac. Permet de recharger un smartphone 6 à 8 fois. Compatible charge ultra-rapide Power Delivery et Quick Charge 3.0. Lampe torche LED intégrée.',
    features: [
      'Capacité monstre 30 000 mAh certifiée',
      'Charge rapide 22.5W (Charge 60% d\'un iPhone ou Samsung en 30 min)',
      'Triple sortie pour recharger 3 appareils simultanément',
      'Écran numérique affichant le pourcentage exact de batterie restante',
      'Système de sécurité Multi-Protect contre les surchauffes'
    ],
    specs: {
      'Capacité': '30 000 mAh (111 Wh)',
      'Sorties': '2x USB-A Fast Charge (22.5W) + 1x Type-C PD (20W)',
      'Entrées': 'Type-C et Micro-USB',
      'Lampe torche': 'LED puissante d\'urgence intégrée',
      'Poids': '580 g'
    },
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnds: '2026-08-27T23:59:59Z',
    rating: 4.8,
    reviewCount: 92,
    tags: ['Oraimo', 'Powerbank', 'Accessoires', 'Autonomie', 'Promo'],
    warranty: 'Garantie 6 Mois Oraimo Sénégal',
    createdAt: '2026-08-11',
    shopifyHandle: 'batterie-externe-oraimo-30000mah-22w5'
  },
  {
    id: 'prod-smartwatch-ultra-amoled',
    title: 'Montre Connectée Sport Ultra 2 Titanium 49mm - Écran AMOLED, Appels Bluetooth & ECG',
    slug: 'montre-connectee-sport-ultra-2-amoled',
    sku: 'TME-WATCH-ULT2',
    price: 25000,
    compareAtPrice: 35000,
    discountPercentage: 28,
    category: 'accessoires-gadgets',
    brand: 'FitPro Pro',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'La montre connectée la plus complète pour votre style et votre santé. Boîtier robuste en titane, écran haute luminosité lisible en plein soleil, passation et réception des appels directs en Bluetooth, suivi cardiaque, sommeil, tension artérielle et plus de 100 modes sportifs.',
    features: [
      'Écran tactile AMOLED 2.1 pouces avec affichage permanent Always-on',
      'Haut-parleur et micro intégrés pour téléphoner directement au poignet',
      'Suivi complet : Fréquence cardiaque 24/7, SpO2, Sommeil, Tension',
      'Notifications WhatsApp, SMS, Facebook, TikTok et appels entrants',
      '3 bracelets inclus dans la boîte (Silicone Océan, Tissu Trail et Métal)'
    ],
    specs: {
      'Boîtier': '49 mm Alliage Titane haute résistance',
      'Étanchéité': 'IP68 (Résistant aux éclaboussures et transpiration)',
      'Autonomie': '5 à 7 jours d\'utilisation active, charge magnétique sans fil',
      'Compatibilité': 'Android et iPhone (iOS)'
    },
    inStock: true,
    stockCount: 35,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnds: '2026-08-29T23:59:59Z',
    rating: 4.7,
    reviewCount: 51,
    tags: ['Smartwatch', 'Montre', 'Gadget', 'Sport', 'Connecté'],
    warranty: 'Garantie 6 Mois avec SAV',
    createdAt: '2026-08-12',
    shopifyHandle: 'montre-connectee-sport-ultra-2-amoled'
  },
  ...importedCatalogProducts
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-samsung-s24-ultra',
    author: 'Moussa Diop',
    rating: 5,
    comment: 'Téléphone 100% original reçu en moins de 3h aux Almadies. Service client réactif sur WhatsApp et livreur très courtois. J\'ai payé par Wave à la livraison.',
    date: '14 Août 2026',
    verifiedBuyer: true,
    city: 'Dakar (Almadies)',
    helpfulCount: 14
  },
  {
    id: 'rev-2',
    productId: 'prod-samsung-s24-ultra',
    author: 'Aïssatou Ndiaye',
    rating: 5,
    comment: 'L\'appareil photo est tout simplement magique ! Très bonne expérience d\'achat chez TOUBA MADIYINA ELECTRONIC. Le S24 Ultra est sous scellé avec facture.',
    date: '10 Août 2026',
    verifiedBuyer: true,
    city: 'Dakar (Sacré-Cœur)',
    helpfulCount: 9
  },
  {
    id: 'rev-3',
    productId: 'prod-climatiseur-gree-12000',
    author: 'Ibrahima Sarr',
    rating: 5,
    comment: 'Installation rapide le lendemain de la commande à Pikine. Le climatiseur est hyper silencieux et refroidit le salon en quelques minutes. Consommation Woyofal très faible !',
    date: '18 Août 2026',
    verifiedBuyer: true,
    city: 'Pikine Tally Boumack',
    helpfulCount: 22
  },
  {
    id: 'rev-4',
    productId: 'prod-air-fryer-ninja-dual',
    author: 'Fatou Bintou Seck',
    rating: 5,
    comment: 'J\'ai préparé du thiof braisé et des pastels sans presque d\'huile, c\'est un vrai délice ! Mes enfants adorent. Reçu très rapidement à Mermoz.',
    date: '12 Août 2026',
    verifiedBuyer: true,
    city: 'Dakar (Mermoz)',
    helpfulCount: 18
  },
  {
    id: 'rev-5',
    productId: 'prod-ventilateur-solaire-rechargeable',
    author: 'Ousmane Fall',
    rating: 5,
    comment: 'Commandé pour mes parents à Touba. Le panneau solaire charge très bien et le ventilateur tourne toute la nuit sans problème. Bravo pour la livraison dans les régions.',
    date: '16 Août 2026',
    verifiedBuyer: true,
    city: 'Touba Mosquée',
    helpfulCount: 31
  }
];

export const initialArticles: Article[] = [
  {
    id: 'art-guide-climatiseur-senegal',
    title: 'Guide 2026 : Comment choisir son Climatiseur Inverter pour économiser sur le Woyofal à Dakar',
    slug: 'guide-choisir-climatiseur-inverter-dakar-woyofal',
    excerpt: 'Face aux chaleurs estivales de Dakar et à la facture Senelec, découvrez pourquoi la technologie Inverter R32 divise votre consommation électrique par deux.',
    content: `À Dakar et dans les régions du Sénégal, la chaleur et l'humidité rendent le climatiseur indispensable. Cependant, la peur de voir grimper la facture Woyofal freine beaucoup d'acheteurs.

Voici les 4 règles d'or pour bien choisir :
1. **Optez TOUJOURS pour la technologie Inverter** : Contrairement aux anciens climatiseurs qui s'arrêtent et redémarrent à pleine puissance, l'Inverter ajuste sa vitesse en continu, économisant 40 à 60% d'électricité.
2. **Dimensionnez selon votre pièce** :
   - 9 000 BTU (1 CV) : chambre de 9 à 15 m²
   - 12 000 BTU (1.5 CV) : chambre parentale ou petit salon (15 à 25 m²)
   - 18 000 BTU (2 CV) : grand salon de 25 à 35 m²
   - 24 000 BTU (2.5 CV) : espace ouvert de 35 à 50 m²
3. **Privilégiez le gaz R32** : Plus performant et respectueux de l'environnement que le R410a.
4. **Vérifiez le traitement anti-corrosion (Golden Fin)** : Indispensable sur la presqu'île de Dakar à cause des embruns marins.

Tous les climatiseurs chez **TOUBA MADIYINA ELECTRONIC** répondent à ces exigences avec garantie certifiée.`,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    author: 'Équipe Technique TOUBA MADIYINA',
    date: '15 Août 2026',
    category: 'Guides d\'achat',
    readTime: '4 min'
  },
  {
    id: 'art-wave-orange-money-securite',
    title: 'Paiements Mobile au Sénégal : Pourquoi Wave et Orange Money garantissent un achat 100% serein',
    slug: 'paiements-wave-orange-money-senegal-securite',
    excerpt: 'Comment fonctionne le paiement mobile instantané et la livraison avec paiement à la réception sur notre boutique en ligne.',
    content: `Au Sénégal, la confiance est le pilier du commerce électronique. Chez **TOUBA MADIYINA ELECTRONIC**, nous avons pensé chaque étape pour votre sécurité :

- **Paiement à la livraison** : Vous ne payez que lorsque le livreur est devant votre porte et que vous avez inspecté votre colis.
- **Wave & Orange Money** : 0% de frais cachés, transactions instantanées avec confirmation SMS officielle.
- **Support WhatsApp direct** : Un conseiller dédié vous accompagne avant, pendant et après votre commande.`,
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    author: 'Service Client',
    date: '10 Août 2026',
    category: 'Astuces & Conseils',
    readTime: '3 min'
  }
];

export const initialPages: CustomPage[] = [
  {
    id: 'page-a-propos',
    title: 'À Propos de TOUBA MADIYINA ELECTRONIC',
    slug: 'a-propos',
    content: `### Bienvenue chez TOUBA MADIYINA ELECTRONIC
**« Achetez simplement, recevez rapidement »**

Fondée au cœur battant du commerce dakarois, **TOUBA MADIYINA ELECTRONIC** est l'enseigne de référence spécialisée dans la distribution d'équipements électroniques, électroménagers et produits high-tech de haute qualité au Sénégal.

#### Notre Histoire & Showroom à Dakar
Installée au **Boulevard Général de Gaulle, Angle Rue 22, Sandaga / Médina, Dakar**, notre boutique physique accueille chaque jour particuliers et professionnels en quête de matériel fiable, certifié et garanti.

#### Notre Mission
Démocratiser l'accès aux meilleures marques internationales (**Samsung, Apple, HP, Dell, Gree, Midea, TCL, JBL, Innova, Xiaomi**) aux tarifs les plus compétitifs du marché sénégalais, avec un service client bienveillant et un accompagnement sur mesure.

#### Nos Engagements Clés
- **100% Produits Authentiques & Neufs** : Aucun produit reconditionné sans mention explicite, toutes nos marchandises sont scellées et garanties.
- **Livraison Express le Jour Même à Dakar** : Commandez avant 16h et recevez votre colis en 2h à 4h à votre domicile ou bureau.
- **Paiements Mobiles Sécurisés au Sénégal** : Règlement par Wave, Orange Money ou en espèces directement à la livraison après inspection de votre colis.
- **Service Après-Vente (SAV) Réactif** : Prise en charge rapide de vos garanties, conseils d'installation et pièces de rechange disponibles.
- **Support WhatsApp 7j/7** : Une équipe locale dévouée joignable au **+221 77 536 34 37** pour toutes vos commandes et questions.`,
    updatedAt: '2026-08-22'
  },
  {
    id: 'page-cgu-mentions-legales',
    title: 'CGU & Mentions Légales',
    slug: 'cgu-mentions-legales',
    content: `### Conditions Générales d'Utilisation & Mentions Légales

Bienvenue sur le site officiel de **TOUBA MADIYINA ELECTRONIC** (accessible à l'adresse web de la boutique). L'utilisation de notre plateforme e-commerce implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation.

#### 1. Éditeur de la Plateforme & Identification
- **Dénomination Sociale** : TOUBA MADIYINA ELECTRONIC SARL
- **Siège Social & Boutique** : Boulevard Général de Gaulle, Angle Rue 22, Sandaga / Médina, Dakar, Sénégal
- **Téléphone Service Client** : +221 77 536 34 37 / +221 33 800 00 00
- **Email Officiel** : contact@toubamadiyina.sn
- **Registre du Commerce (RCCM)** : SN.DKR.2024.B.8942 / NINEA : 008942718
- **Directeur de Publication** : Direction Commerciale TOUBA MADIYINA

#### 2. Objet & Accès au Service
Le site a pour objet la présentation, la commande en ligne et la livraison de produits électroniques, d'équipements informatiques et d'appareils électroménagers au Sénégal. L'accès au site est gratuit pour tout utilisateur disposant d'un accès à Internet.

#### 3. Propriété Intellectuelle
L'ensemble des éléments constituant ce site (textes, visuels graphiques, logos TOUBA MADIYINA, fiches techniques, arborescence, architecture logicielle) est protégé par les lois sénégalaises et internationales régissant la propriété intellectuelle (OAPI). Toute reproduction ou exploitation sans accord écrit préalable est strictement interdite.

#### 4. Responsabilité & Disponibilité du Service
TOUBA MADIYINA ELECTRONIC s'efforce de maintenir le site accessible 24h/24 et 7j/7. Toutefois, l'accès peut être momentanément interrompu pour des besoins de maintenance technique ou suite à des perturbations des réseaux de télécommunications.

#### 5. Loi Applicable & Juridiction Compétente
Les présentes conditions sont régies et interprétées conformément au droit de la République du Sénégal. Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis aux juridictions compétentes de Dakar.`,
    updatedAt: '2026-08-22'
  },
  {
    id: 'page-politique-confidentialite',
    title: 'Politique de Confidentialité',
    slug: 'politique-confidentialite',
    content: `### Politique de Confidentialité & Protection des Données Personnelles

Chez **TOUBA MADIYINA ELECTRONIC**, la protection de vos données personnelles et le respect de votre vie privée sont au cœur de nos priorités. Cette politique détaille les informations que nous collectons et l'usage qui en est fait.

#### 1. Conformité avec la Législation Sénégalaise
Notre traitement des données est en stricte conformité avec la **Loi n° 2008-12 du 25 janvier 2008** portant sur la Protection des Données à Caractère Personnel au Sénégal et sous l'égide de la **Commission de Protection des Données Personnelles (CDP Sénégal)**.

#### 2. Données Collectées lors de vos Commandes
Pour assurer le traitement et la livraison de vos colis, nous collectons les informations suivantes :
- **Nom et Prénom** : Pour l'adressage de la facture et l'identification à la livraison.
- **Numéro de téléphone mobile (+221)** : Indispensable pour coordonner la livraison par appel/SMS et envoyer le numéro de suivi de commande.
- **Adresse de Livraison (Région, Ville, Quartier, Repères)** : Pour guider nos livreurs directement à votre porte.
- **Adresse Email (Facultative)** : Pour l'envoi de confirmations de commande et factures dématérialisées.

#### 3. Sécurité des Paiements Mobiles (Wave & Orange Money)
- **Aucune donnée bancaire sensible n'est enregistrée** sur nos serveurs.
- Les paiements par **Wave Sénégal** et **Orange Money** s'effectuent selon les protocoles officiels chiffrés de chaque opérateur.
- Lors du paiement à la livraison (Cash à la livraison), le règlement s'effectue directement en main propre avec le livreur contre reçu officiel.

#### 4. Non-Divulgation à des Tiers
Vos informations personnelles ne sont **jamais vendues, louées ou cédées** à des tiers à des fins publicitaires. Elles sont uniquement transmises à nos équipes internes et à nos livreurs assermentés pour l'exécution exclusive de votre livraison.

#### 5. Vos Droits d'Accès, de Modification et de Suppression
Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment par message WhatsApp au **+221 77 536 34 37** ou par email à **contact@toubamadiyina.sn**.`,
    updatedAt: '2026-08-22'
  },
  {
    id: 'page-conditions-generales-vente',
    title: 'Conditions Générales de Vente (CGV)',
    slug: 'conditions-generales-vente',
    content: `### Conditions Générales de Vente (CGV) — TOUBA MADIYINA ELECTRONIC

Les présentes Conditions Générales de Vente (CGV) régissent toutes les ventes d'articles conclues entre **TOUBA MADIYINA ELECTRONIC** et ses clients sur le territoire de la République du Sénégal.

#### 1. Prix & Monnaie
- Tous les tarifs affichés sur le site sont exprimés en **Francs CFA (XOF / FCFA)** toutes taxes comprises (TTC).
- Les prix n'incluent pas les frais de livraison, lesquels sont calculés et affichés avant la validation définitive de votre commande en fonction de votre zone géographique.

#### 2. Processus de Commande & Validation
- Les commandes peuvent être passées directement via notre panier en ligne ou par **WhatsApp Direct**.
- Toute commande validée fait l'objet d'un appel téléphonique ou message de confirmation par notre service client avant l'expédition du livreur.

#### 3. Modes de Règlement Acceptés
- **Paiement à la Livraison (Cash / Espèces)** : Vous réglez directement le livreur après avoir reçu et inspecté le colis.
- **Wave Sénégal** : Paiement mobile rapide et sécurisé.
- **Orange Money Sénégal** : Transfert direct et sécurisé.

#### 4. Modalités & Tarifs de Livraison
- **Dakar Centre & Résidentiel (Plateau, Almadies, Sacré-Cœur, Yoff)** : 1 500 FCFA (Livraison en 2h à 4h).
- **Banlieue de Dakar (Pikine, Guédiawaye, Keur Massar, Parcelles)** : 2 000 FCFA (Le jour même ou sous 24h).
- **Rufisque, Diamniadio, Bargny** : 2 500 FCFA (Sous 24h).
- **Régions de l'Intérieur (Thiès, Touba, Saint-Louis, Kaolack, etc.)** : 3 500 à 4 500 FCFA (Expédition sécurisée sous 24h à 72h via nos réseaux de transporteurs partenaires).
- **Livraison Gratuite** : Offerte pour toute commande supérieure ou égale à 150 000 FCFA à Dakar !

#### 5. Garanties Matériel & Service Après-Vente (SAV)
- Tous nos téléphones, téléviseurs et appareils électroménagers bénéficient d'une **garantie légale de conformité de 6 à 24 mois**.
- La garantie couvre tout défaut de fabrication ou vice caché sous réserve d'une utilisation normale conforme à la notice du fabricant.

#### 6. Droit de Rétractation & Échange sous 7 Jours
En cas de produit non conforme ou présentant un dysfonctionnement à la réception, le client dispose d'un délai de **7 jours calendaires** à compter de la réception pour demander un échange gratuit ou un remboursement. Le produit doit être retourné complet avec son emballage, accessoires et facture d'origine.`,
    updatedAt: '2026-08-22'
  },
  {
    id: 'page-livraison',
    title: 'Politique et Tarifs de Livraison au Sénégal',
    slug: 'livraison',
    content: `### Modalités de Livraison chez TOUBA MADIYINA ELECTRONIC

Nous livrons rapidement à Dakar, en banlieue et dans toutes les régions du Sénégal.

#### 1. Zone Dakar Centre & Résidentiel (Plateau, Almadies, Mermoz, Sacré-Cœur, Yoff)
- **Tarif** : 1 500 FCFA
- **Délai** : 2 à 4 heures pour toute commande passée avant 16h.
- **Gratuit** dès 150 000 FCFA d'achat !

#### 2. Zone Banlieue (Pikine, Guédiawaye, Keur Massar, Parcelles Assainies)
- **Tarif** : 2 000 FCFA
- **Délai** : Le jour même ou sous 24h.

#### 3. Rufisque, Diamniadio & Bargny
- **Tarif** : 2 500 FCFA
- **Délai** : 24h maximum.

#### 4. Régions (Thiès, Touba, Saint-Louis, Kaolack, Ziguinchor, etc.)
- **Tarif** : 3 500 à 4 500 FCFA selon la localité via nos partenaires transporteurs (GP / Colis Express).
- **Délai** : 24 à 72 heures avec numéro de suivi SMS.`,
    updatedAt: '2026-08-22'
  },
  {
    id: 'page-retours-garantie',
    title: 'Garanties & Conditions de Retour',
    slug: 'retours-garantie',
    content: `### Notre Politique de Garantie et Retours

Chez **TOUBA MADIYINA ELECTRONIC**, la satisfaction de nos clients est notre priorité absolue.

#### Droit de rétractation et Échange sous 7 Jours
Si un produit présente un défaut de fabrication ou ne correspond pas à vos attentes, vous disposez de 7 jours après réception pour demander un échange immédiat ou un remboursement complet.

#### Garanties Fabricant
- **Smartphones & PC Portables** : 12 à 24 mois de garantie officielle.
- **Climatiseurs & Électroménager** : 1 à 2 ans de garantie avec disponibilité des pièces de rechange à Dakar.
- **Accessoires & Petits Appareils** : 6 mois de garantie échange à neuf.`,
    updatedAt: '2026-08-22'
  },
  {
    id: 'page-faq',
    title: 'Foire Aux Questions (FAQ)',
    slug: 'faq',
    content: `### Questions Fréquentes

**Q : Comment passer une commande ?**
R : Vous pouvez commander directement sur notre site en ajoutant vos articles au panier et en validant votre adresse, ou bien cliquer sur le bouton vert **"Commander sur WhatsApp"** pour discuter directement avec un conseiller.

**Q : Puis-je payer au moment de la livraison ?**
R : Oui ! Vous pouvez inspecter le produit devant le livreur puis régler en espèces ou par transfert Wave / Orange Money.

**Q : Les produits sont-ils sous garantie ?**
R : Absolument, tous nos produits sont neufs, scellés et vendus avec facture et garantie de 6 à 24 mois.

**Q : Livrez-vous en dehors de Dakar ?**
R : Oui, nous expédions tous les jours vers Thiès, Mbour, Touba, Saint-Louis, Ziguinchor et partout au Sénégal.`,
    updatedAt: '2026-08-22'
  }
];

export const initialCoupons: Coupon[] = [
  {
    code: 'BIENVENUE10',
    discountPercent: 10,
    minAmount: 20000,
    isActive: true,
    description: '10% de réduction sur votre première commande (Dès 20 000 FCFA)'
  },
  {
    code: 'DAKAR2026',
    fixedDiscount: 5000,
    minAmount: 50000,
    isActive: true,
    description: '5 000 FCFA de remise immédiate dès 50 000 FCFA d\'achat'
  },
  {
    code: 'WAVEEXPRESS',
    discountPercent: 5,
    minAmount: 10000,
    isActive: true,
    description: '5% de réduction supplémentaire pour tout paiement mobile Wave'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord_demo_001',
    orderNumber: 'TME-2026-8492',
    date: '2026-08-20T14:30:00.000Z',
    customer: {
      fullName: 'Moussa Diop',
      phone: '77 536 34 37',
      email: 'moussa.diop@gmail.com',
      region: 'Dakar Centre & Résidentiel',
      city: 'Dakar',
      district: 'Sacré-Cœur 3',
      address: 'Villa N° 42, près de la boulangerie',
      deliveryNotes: 'Appeler 15 min avant arrivée'
    },
    items: [
      {
        product: {
          id: 'prod-smart-tv-samsung-65',
          title: 'Smart TV Samsung 65" Crystal UHD 4K (Modèle 2026)',
          slug: 'smart-tv-samsung-65-crystal-4k',
          sku: 'TME-TV-SAM65-4K',
          price: 345000,
          compareAtPrice: 420000,
          discountPercentage: 18,
          category: 'tv-audio',
          brand: 'Samsung',
          images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80'],
          description: 'Smart TV Samsung 4K',
          features: ['4K UHD', 'Smart TV Tizen'],
          specs: {},
          inStock: true,
          stockCount: 5,
          rating: 4.8,
          reviewCount: 31,
          tags: ['TV', 'Samsung'],
          createdAt: '2026-08-02'
        },
        quantity: 1
      }
    ],
    subtotal: 345000,
    shippingFee: 0,
    discount: 0,
    total: 345000,
    paymentMethod: 'wave',
    paymentStatus: 'paid',
    orderStatus: 'en_livraison',
    trackingNumber: 'SN-202608-84920',
    trackingEvents: [
      {
        date: '2026-08-20T14:30:00.000Z',
        status: 'Commande reçue',
        description: 'Commande validée par le client via Wave.',
        location: 'Sandaga, Dakar'
      },
      {
        date: '2026-08-20T15:10:00.000Z',
        status: 'En préparation',
        description: 'Colis emballé et vérifié au dépôt de Sandaga.',
        location: 'Entrepôt Dakar'
      },
      {
        date: '2026-08-20T16:00:00.000Z',
        status: 'En cours de livraison',
        description: 'Coursier express en route vers Sacré-Cœur 3.',
        location: 'Dakar Express'
      }
    ]
  },
  {
    id: 'ord_demo_002',
    orderNumber: 'TME-2026-7124',
    date: '2026-08-21T08:15:00.000Z',
    customer: {
      fullName: 'Fatou Kiné Ndiaye',
      phone: '78 120 44 88',
      region: 'Dakar Centre & Plateau',
      city: 'Dakar',
      district: 'Médina',
      address: 'Rue 10 x Angle Boulevard du Général de Gaulle'
    },
    items: [
      {
        product: {
          id: 'prod-climatiseur-gree-12000',
          title: 'Climatiseur Split Inverter Gree 12000 BTU (1.5 CV)',
          slug: 'climatiseur-split-inverter-gree-12000-btu',
          sku: 'TME-CLIM-GREE12K',
          price: 215000,
          compareAtPrice: 260000,
          discountPercentage: 17,
          category: 'electromenager',
          brand: 'Gree',
          images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'],
          description: 'Climatiseur Inverter Gree économique',
          features: ['Inverter', 'Gaz R32'],
          specs: {},
          inStock: true,
          stockCount: 8,
          rating: 4.9,
          reviewCount: 42,
          tags: ['Climatiseur', 'Gree'],
          createdAt: '2026-08-01'
        },
        quantity: 1
      }
    ],
    subtotal: 215000,
    shippingFee: 0,
    discount: 0,
    total: 215000,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'confirmee',
    trackingNumber: 'SN-202608-71240',
    trackingEvents: [
      {
        date: '2026-08-21T08:15:00.000Z',
        status: 'Commande validée',
        description: 'Commande confirmée, en attente de mise en livraison.',
        location: 'Médina, Dakar'
      }
    ]
  },
  {
    id: 'ord_demo_003',
    orderNumber: 'TME-2026-6281',
    date: '2026-08-19T11:00:00.000Z',
    customer: {
      fullName: 'Cheikh Tidiane Fall',
      phone: '76 430 92 11',
      region: 'Dakar Ouest & Almadies',
      city: 'Dakar',
      district: 'Almadies',
      address: 'Route des Almadies, Immeuble Horizon'
    },
    items: [
      {
        product: {
          id: 'prod-smart-tv-samsung-65',
          title: 'Smart TV Samsung 65" Crystal UHD 4K (Modèle 2026)',
          slug: 'smart-tv-samsung-65-crystal-4k',
          sku: 'TME-TV-SAM65-4K',
          price: 345000,
          category: 'tv-audio',
          brand: 'Samsung',
          images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80'],
          description: 'Smart TV Samsung 4K',
          features: ['4K UHD'],
          specs: {},
          inStock: true,
          stockCount: 5,
          rating: 4.8,
          reviewCount: 31,
          tags: ['TV'],
          createdAt: '2026-08-02'
        },
        quantity: 1
      }
    ],
    subtotal: 345000,
    shippingFee: 0,
    discount: 0,
    total: 345000,
    paymentMethod: 'wave',
    paymentStatus: 'paid',
    orderStatus: 'livree',
    trackingNumber: 'SN-202608-62810',
    trackingEvents: [
      {
        date: '2026-08-19T11:00:00.000Z',
        status: 'Livrée avec succès',
        description: 'Colis remis en main propre au client. Paiement Wave reçu.',
        location: 'Almadies, Dakar'
      }
    ]
  },
  {
    id: 'ord_demo_004',
    orderNumber: 'TME-2026-9055',
    date: '2026-08-21T09:45:00.000Z',
    customer: {
      fullName: 'Aminata Ba',
      phone: '70 812 33 00',
      region: 'Dakar Nord & Parcelles',
      city: 'Dakar',
      district: 'Parcelles Assainies',
      address: 'Unité 15, Villa 120'
    },
    items: [
      {
        product: {
          id: 'prod-asp-beko-v61814vr',
          title: 'Aspirateur BEKO V 61814 VR - Haute Puissance Cyclonique',
          slug: 'aspirateur-beko-v-61814-vr',
          sku: 'TME-ASP-BEK61814',
          price: 52000,
          category: 'aspirateurs-nettoyage',
          brand: 'Beko',
          images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80'],
          description: 'Aspirateur haute puissance',
          features: ['Cyclonique', 'Filtre HEPA'],
          specs: {},
          inStock: true,
          stockCount: 10,
          rating: 4.7,
          reviewCount: 15,
          tags: ['Aspirateur', 'Beko'],
          createdAt: '2026-08-05'
        },
        quantity: 1
      }
    ],
    subtotal: 52000,
    shippingFee: 1500,
    discount: 0,
    total: 53500,
    paymentMethod: 'orange_money',
    paymentStatus: 'pending',
    orderStatus: 'en_attente',
    trackingNumber: 'SN-202608-90550',
    trackingEvents: [
      {
        date: '2026-08-21T09:45:00.000Z',
        status: 'En attente de validation',
        description: 'Commande enregistrée, contact avec le client pour confirmation.',
        location: 'Parcelles Assainies, Dakar'
      }
    ]
  }
];

