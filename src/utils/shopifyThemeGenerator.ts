import JSZip from 'jszip';
import { Product, Category, StoreSettings } from '../types';

export async function generateShopifyThemeZip(
  settings: StoreSettings,
  products: Product[],
  categories: Category[]
): Promise<Blob> {
  const zip = new JSZip();

  // 1. layout/theme.liquid
  const themeLiquid = `<!doctype html>
<html class="no-js" lang="fr">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="{{ settings.color_primary | default: '#1e40af' }}">
    <link rel="canonical" href="{{ canonical_url }}">
    
    <title>{{ page_title }}{% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}</title>
    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN for instant styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                blue: '{{ settings.color_primary | default: "#1e40af" }}',
                blueDark: '#1e3a8a',
                green: '#16a34a',
                dark: '#0f172a'
              }
            },
            fontFamily: {
              sans: ['"Plus Jakarta Sans"', 'sans-serif'],
              heading: ['Outfit', 'sans-serif']
            }
          }
        }
      }
    </script>

    {{ content_for_header }}

    <style>
      :root {
        --color-primary: {{ settings.color_primary | default: '#1e40af' }};
        --color-secondary: {{ settings.color_secondary | default: '#16a34a' }};
        --color-bg: #f8fafc;
      }
      body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background-color: var(--color-bg);
      }
      .btn-primary {
        background-color: var(--color-primary);
        color: #ffffff;
        transition: all 0.2s ease;
      }
      .btn-primary:hover {
        opacity: 0.92;
        transform: translateY(-1px);
      }
      .btn-whatsapp {
        background-color: #22c55e;
        color: #ffffff;
      }
      .btn-whatsapp:hover {
        background-color: #16a34a;
      }
    </style>
  </head>

  <body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
    <!-- Announcement Bar -->
    {% section 'announcement-bar' %}

    <!-- Main Header -->
    {% section 'header' %}

    <!-- Content for layout -->
    <main id="MainContent" class="flex-grow focus:none" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>

    <!-- Trust Badges -->
    {% section 'trust-badges' %}

    <!-- Footer -->
    {% section 'footer' %}

    <!-- Floating WhatsApp Button for Senegal (Dakar) -->
    {% section 'whatsapp-floating' %}

    <!-- Mini Cart Drawer -->
    {% render 'cart-drawer' %}
  </body>
</html>`;

  zip.file('layout/theme.liquid', themeLiquid);

  // 2. templates/index.json
  const indexJson = {
    name: "Page d'accueil TOUBA MADIYINA ELECTRONIC",
    wrapper: "div.homepage-sections",
    sections: {
      "hero_banner": {
        type: "hero-banner",
        settings: {
          heading: "Les bons produits au bon prix",
          subheading: "Découvrez nos produits tendance et profitez de nos meilleures offres au Sénégal. Téléphones, TV, Climatiseurs , Sonorisation, Electronique et Électroménager livrés directement chez vous.",
          button_primary_text: "ACHETER MAINTENANT",
          button_secondary_text: "VOIR LES PROMOTIONS",
          badge_text: "🇸🇳 Boutique High-Tech N°1 & Maison à Dakar"
        }
      },
      "featured_categories": {
        type: "featured-categories",
        settings: {
          title: "Nos Catégories Populaires",
          subtitle: "Explorez nos univers électronique, maison et électroménager"
        }
      },
      "flash_sale": {
        type: "flash-sale",
        settings: {
          title: "🔥 GRANDES PROMOTIONS",
          subtitle: "Profitez de nos offres exceptionnelles avant la fin du stock à Dakar.",
          button_text: "DÉCOUVRIR LES OFFRES",
          hours_left: 48
        }
      },
      "featured_products": {
        type: "featured-products",
        settings: {
          title: "🔥 NOS PRODUITS VEDETTES",
          subtitle: "Les meilleures ventes et nouveautés sélectionnées avec soin",
          products_to_show: 8
        }
      },
      "senegal_delivery": {
        type: "senegal-delivery-info",
        settings: {
          title: "Livraison Express à Dakar et partout au Sénégal",
          dakar_fee: "1 500 FCFA",
          banlieue_fee: "2 000 FCFA",
          region_fee: "3 500 - 4 500 FCFA"
        }
      }
    },
    order: [
      "hero_banner",
      "featured_categories",
      "flash_sale",
      "featured_products",
      "senegal_delivery"
    ]
  };

  zip.file('templates/index.json', JSON.stringify(indexJson, null, 2));

  // 3. templates/product.json
  const productJson = {
    name: "Page Produit TOUBA MADIYINA",
    sections: {
      "main": {
        type: "main-product",
        settings: {
          enable_zoom: true,
          show_whatsapp_button: true,
          show_delivery_estimator: true,
          show_wave_om_badges: true
        }
      },
      "related_products": {
        type: "featured-products",
        settings: {
          title: "Vous pourriez aussi aimer",
          subtitle: "Articles fréquemment achetés ensemble"
        }
      }
    },
    order: ["main", "related_products"]
  };
  zip.file('templates/product.json', JSON.stringify(productJson, null, 2));

  // 4. templates/collection.json
  const collectionJson = {
    name: "Catalogue & Collections",
    sections: {
      "main": {
        type: "main-collection",
        settings: {
          products_per_page: 16,
          enable_filtering: true,
          enable_sorting: true
        }
      }
    },
    order: ["main"]
  };
  zip.file('templates/collection.json', JSON.stringify(collectionJson, null, 2));

  // 5. templates/cart.json, page.json, 404.json
  zip.file('templates/cart.json', JSON.stringify({
    sections: {
      "main": {
        type: "main-cart",
        settings: {}
      }
    },
    order: ["main"]
  }, null, 2));

  zip.file('templates/page.json', JSON.stringify({
    sections: {
      "main": {
        type: "main-page",
        settings: {}
      }
    },
    order: ["main"]
  }, null, 2));

  // 6. SECTIONS
  // sections/announcement-bar.liquid
  zip.file('sections/announcement-bar.liquid', `{% schema %}
{
  "name": "Barre d'annonce Sénégal",
  "settings": [
    {
      "type": "text",
      "id": "text",
      "label": "Texte d'annonce",
      "default": "🚚 Livraison rapide à Dakar | 💳 Paiement à la livraison | 📱 Wave & Orange Money"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Couleur de fond",
      "default": "#1e40af"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Couleur du texte",
      "default": "#ffffff"
    }
  ]
}
{% endschema %}

<div class="bg-blue-800 text-white text-xs md:text-sm py-2 px-4 text-center font-medium shadow-inner tracking-wide">
  <div class="max-w-7xl mx-auto flex items-center justify-center gap-3 overflow-x-auto whitespace-nowrap">
    <span>{{ section.settings.text }}</span>
  </div>
</div>`);

  // sections/header.liquid
  zip.file('sections/header.liquid', `{% schema %}
{
  "name": "En-tête TOUBA MADIYINA",
  "settings": [
    {
      "type": "text",
      "id": "shop_name",
      "label": "Nom de la boutique",
      "default": "TOUBA MADIYINA ELECTRONIC"
    },
    {
      "type": "text",
      "id": "slogan",
      "label": "Slogan",
      "default": "Achetez simplement, recevez rapidement"
    },
    {
      "type": "text",
      "id": "phone",
      "label": "Numéro Service Client",
      "default": "+221 77 536 34 37"
    }
  ]
}
{% endschema %}

<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20 gap-4">
      
      <!-- Logo & Name -->
      <a href="/" class="flex items-center gap-3 group shrink-0">
        <svg width="220" height="50" viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto">
          <g id="letter-T">
            <path d="M 12 12 H 68 V 26 H 50 V 78 H 30 V 26 H 12 V 12 Z" fill="#0B2545"/>
            <path d="M 44 4 L 26 40 H 40 L 29 74 L 54 36 H 38 L 52 4 Z" fill="#10B981"/>
            <circle cx="22" cy="50" r="4.5" fill="#10B981"/>
            <path d="M 22 50 L 33 42" stroke="#10B981" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="50" cy="46" r="4.5" fill="#10B981"/>
            <path d="M 50 46 L 41 56" stroke="#10B981" stroke-width="3.5" stroke-linecap="round"/>
          </g>
          <path d="M 78 24 H 90 L 104 56 L 118 24 H 130 V 78 H 117 V 44 L 106 68 H 101 L 91 44 V 78 H 78 V 24 Z" fill="#0B2545"/>
          <path d="M 140 24 H 178 V 36 H 154 V 45 H 174 V 56 H 154 V 66 H 178 V 78 H 140 V 24 Z" fill="#0B2545"/>
          <text x="190" y="42" fill="#0B2545" font-family="system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="2.5">TOUBA MADIYINA</text>
          <text x="192" y="68" fill="#0B2545" font-family="system-ui, sans-serif" font-weight="800" font-size="17" letter-spacing="4">ELECTRONICS SHOP</text>
        </svg>
      </a>

      <!-- Search Bar -->
      <div class="hidden md:flex flex-1 max-w-xl mx-4">
        <form action="/search" method="get" class="w-full relative">
          <input 
            type="text" 
            name="q" 
            placeholder="Que recherchez-vous ? (ex: Samsung S24, Climatiseur, Air Fryer...)" 
            class="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm transition-all shadow-inner bg-slate-50 focus:bg-white"
          />
          <button type="submit" class="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-1">
            Rechercher
          </button>
        </form>
      </div>

      <!-- Action Icons -->
      <div class="flex items-center gap-3 md:gap-5">
        <a href="https://wa.me/221775363437" target="_blank" class="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors">
          <span>WhatsApp 7j/7</span>
        </a>

        <a href="/account" class="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </a>

        <a href="/cart" class="relative p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-2 font-bold text-sm">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <span class="hidden sm:inline">Panier</span>
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
            {{ cart.item_count }}
          </span>
        </a>
      </div>
    </div>

    <!-- Desktop Navigation Menu -->
    <nav class="hidden md:flex items-center justify-center gap-8 py-3 border-t border-slate-100 text-sm font-semibold text-slate-700">
      <a href="/" class="text-blue-700 hover:text-blue-800 transition-colors">Accueil</a>
      <a href="/collections/all" class="hover:text-blue-700 transition-colors">Boutique</a>
      <a href="/collections/telephones-accessoires" class="hover:text-blue-700 transition-colors">Électronique</a>
      <a href="/collections/electromenager" class="hover:text-blue-700 transition-colors">Électroménager</a>
      <a href="/collections/tv-audio" class="hover:text-blue-700 transition-colors">TV & Audio</a>
      <a href="/collections/promotions-flash" class="text-rose-600 font-bold hover:text-rose-700 transition-colors flex items-center gap-1">
        <span>🔥 Promotions</span>
      </a>
      <a href="/pages/livraison" class="hover:text-blue-700 transition-colors">Livraison Sénégal</a>
      <a href="/pages/contact" class="hover:text-blue-700 transition-colors">Contact</a>
    </nav>
  </div>
</header>`);

  // sections/hero-banner.liquid
  zip.file('sections/hero-banner.liquid', `{% schema %}
{
  "name": "Bannière Principale",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Titre",
      "default": "Les bons produits au bon prix"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Sous-titre",
      "default": "Découvrez nos produits tendance et profitez de nos meilleures offres au Sénégal. Téléphones, TV, Climatiseurs , Sonorisation, Electronique et Électroménager livrés directement chez vous."
    },
    {
      "type": "text",
      "id": "button_primary_text",
      "label": "Bouton 1",
      "default": "ACHETER MAINTENANT"
    },
    {
      "type": "text",
      "id": "button_secondary_text",
      "label": "Bouton 2",
      "default": "VOIR LES PROMOTIONS"
    }
  ]
}
{% endschema %}

<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 md:py-24">
  <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs md:text-sm font-semibold">
          <span>🇸🇳 Boutique High-Tech N°1 & Maison à Dakar</span>
        </div>
        
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          {{ section.settings.heading }}
        </h1>
        
        <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
          {{ section.settings.subheading }}
        </p>

        <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
          <a href="/collections/all" class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 text-sm sm:text-base tracking-wide">
            {{ section.settings.button_primary_text }}
          </a>
          <a href="/collections/promotions-flash" class="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-all text-sm sm:text-base">
            {{ section.settings.button_secondary_text }}
          </a>
        </div>

        <div class="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center">
          <div>
            <div class="text-xl sm:text-2xl font-black text-blue-400">+5 000</div>
            <div class="text-xs text-slate-400">Clients Satisfaits</div>
          </div>
          <div>
            <div class="text-xl sm:text-2xl font-black text-emerald-400">2h à 4h</div>
            <div class="text-xs text-slate-400">Livraison Dakar</div>
          </div>
          <div>
            <div class="text-xl sm:text-2xl font-black text-amber-400">100%</div>
            <div class="text-xs text-slate-400">Produits Vérifiés</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 relative">
        <div class="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700/50">
          <img src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80" alt="TOUBA MADIYINA ELECTRONIC" class="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500">
          <div class="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 text-left">
            <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Offre Vedette</span>
            <div class="text-white font-bold text-sm">Samsung Galaxy S24 Ultra & Climatiseurs Inverter</div>
            <div class="text-emerald-400 font-extrabold text-xs mt-1">Paiement Wave, Orange Money ou à la livraison</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>`);

  // sections/trust-badges.liquid
  zip.file('sections/trust-badges.liquid', `{% schema %}
{
  "name": "Garanties et Confiance",
  "settings": []
}
{% endschema %}

<section class="py-12 bg-white border-y border-slate-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      
      <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-2xl">
          🚚
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-base">Livraison rapide</h4>
          <p class="text-xs text-slate-600 mt-1">Livraison express à Dakar et partout au Sénégal en 24-48h.</p>
        </div>
      </div>

      <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-2xl">
          💳
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-base">Paiement sécurisé</h4>
          <p class="text-xs text-slate-600 mt-1">Wave, Orange Money et paiement en espèces à la livraison.</p>
        </div>
      </div>

      <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-2xl">
          🔒
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-base">Achat 100% sécurisé</h4>
          <p class="text-xs text-slate-600 mt-1">Vos informations sont protégées et service client 7j/7.</p>
        </div>
      </div>

      <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-2xl">
          ✅
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-base">Produits vérifiés</h4>
          <p class="text-xs text-slate-600 mt-1">Garantie certifiée sur tous nos articles électroniques.</p>
        </div>
      </div>

    </div>
  </div>
</section>`);

  // sections/flash-sale.liquid
  zip.file('sections/flash-sale.liquid', `{% schema %}
{
  "name": "Section Promotion Flash",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Titre",
      "default": "🔥 GRANDES PROMOTIONS"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Sous-titre",
      "default": "Profitez de nos offres exceptionnelles avant la fin du stock à Dakar."
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Bouton",
      "default": "DÉCOUVRIR LES OFFRES"
    }
  ]
}
{% endschema %}

<section class="py-12 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg">
      
      <div class="space-y-4 text-center md:text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-wider animate-pulse">
          ⚡ Offre Limitée
        </div>
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight">
          {{ section.settings.title }}
        </h2>
        <p class="text-slate-300 text-sm sm:text-base max-w-xl">
          {{ section.settings.subtitle }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-6">
        <div class="flex items-center gap-3 text-center">
          <div class="bg-slate-800/80 border border-slate-700 px-4 py-3 rounded-2xl min-w-[70px]">
            <span class="block text-2xl font-black text-blue-400" id="hours">24</span>
            <span class="text-[10px] text-slate-400 uppercase font-semibold">Heures</span>
          </div>
          <span class="text-xl font-bold text-slate-500">:</span>
          <div class="bg-slate-800/80 border border-slate-700 px-4 py-3 rounded-2xl min-w-[70px]">
            <span class="block text-2xl font-black text-blue-400" id="minutes">45</span>
            <span class="text-[10px] text-slate-400 uppercase font-semibold">Minutes</span>
          </div>
          <span class="text-xl font-bold text-slate-500">:</span>
          <div class="bg-slate-800/80 border border-slate-700 px-4 py-3 rounded-2xl min-w-[70px]">
            <span class="block text-2xl font-black text-amber-400" id="seconds">18</span>
            <span class="text-[10px] text-slate-400 uppercase font-semibold">Secondes</span>
          </div>
        </div>

        <a href="/collections/promotions-flash" class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl transition-all whitespace-nowrap text-sm sm:text-base">
          {{ section.settings.button_text }}
        </a>
      </div>

    </div>
  </div>
</section>`);

  // sections/main-page.liquid
  zip.file('sections/main-page.liquid', `{% schema %}
{
  "name": "Page de Contenu",
  "settings": []
}
{% endschema %}

<div class="bg-slate-50 min-h-screen py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
      <div class="border-b border-slate-100 pb-6 mb-8">
        <span class="text-xs font-black uppercase tracking-wider text-blue-600">TOUBA MADIYINA ELECTRONIC</span>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 mt-2">{{ page.title }}</h1>
      </div>
      <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
        {{ page.content }}
      </div>
    </div>
  </div>
</div>`);

  // sections/whatsapp-floating.liquid
  zip.file('sections/whatsapp-floating.liquid', `{% schema %}
{
  "name": "Bouton WhatsApp Flottant",
  "settings": [
    {
      "type": "text",
      "id": "phone",
      "label": "Numéro WhatsApp Sénégal (avec indicatif 221)",
      "default": "221775363437"
    }
  ]
}
{% endschema %}

<a 
  href="https://wa.me/{{ section.settings.phone }}?text=Bonjour%20TOUBA%20MADIYINA%20ELECTRONIC%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20vos%20produits." 
  target="_blank" 
  rel="noopener noreferrer"
  class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 group"
  aria-label="Contacter TOUBA MADIYINA sur WhatsApp"
>
  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.771.884 2.802.884 3.18 0 5.766-2.586 5.767-5.766.001-3.18-2.584-5.766-5.773-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.077-1.745-.386-1.425-.593-2.339-2.047-2.41-2.14-.07-.095-.572-.763-.572-1.455 0-.693.363-1.033.493-1.175.13-.142.285-.178.38-.178.095 0 .19.002.272.007.087.004.204-.033.319.243.119.286.406.993.442 1.065.036.072.06.155.012.249-.047.095-.072.155-.144.238-.072.083-.151.185-.216.249-.072.072-.147.15-.063.294.084.144.372.613.799.993.551.49 1.015.642 1.159.714.144.072.227.06.311-.036.084-.095.361-.421.457-.565.096-.144.192-.12.324-.072.132.048.837.395.981.467.144.072.24.108.276.168.036.06.036.353-.108.758z"/>
  </svg>
  <span class="hidden sm:inline font-bold text-sm">Commander sur WhatsApp</span>
</a>`);

  // sections/footer.liquid
  zip.file('sections/footer.liquid', `{% schema %}
{
  "name": "Pied de page TOUBA MADIYINA",
  "settings": []
}
{% endschema %}

<footer class="bg-slate-950 text-slate-400 text-sm pt-16 pb-12 border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
      
      <!-- Brand column -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center gap-3">
          <svg width="220" height="50" viewBox="0 0 320 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto">
            <g id="letter-T">
              <path d="M 12 12 H 68 V 26 H 50 V 78 H 30 V 26 H 12 V 12 Z" fill="#FFFFFF"/>
              <path d="M 44 4 L 26 40 H 40 L 29 74 L 54 36 H 38 L 52 4 Z" fill="#10B981"/>
              <circle cx="22" cy="50" r="4.5" fill="#10B981"/>
              <path d="M 22 50 L 33 42" stroke="#10B981" stroke-width="3.5" stroke-linecap="round"/>
              <circle cx="50" cy="46" r="4.5" fill="#10B981"/>
              <path d="M 50 46 L 41 56" stroke="#10B981" stroke-width="3.5" stroke-linecap="round"/>
            </g>
            <path d="M 78 24 H 90 L 104 56 L 118 24 H 130 V 78 H 117 V 44 L 106 68 H 101 L 91 44 V 78 H 78 V 24 Z" fill="#FFFFFF"/>
            <path d="M 140 24 H 178 V 36 H 154 V 45 H 174 V 56 H 154 V 66 H 178 V 78 H 140 V 24 Z" fill="#FFFFFF"/>
            <text x="190" y="42" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="2.5">TOUBA MADIYINA</text>
            <text x="192" y="68" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="800" font-size="17" letter-spacing="4">ELECTRONICS SHOP</text>
          </svg>
        </div>
        <p class="text-xs text-slate-400 max-w-sm leading-relaxed">
          « Achetez simplement, recevez rapidement » — Votre boutique e-commerce de référence au Sénégal pour les téléphones, téléviseurs, climatiseurs et appareils électroménagers.
        </p>
        <div class="pt-2 text-xs space-y-1.5 text-slate-300">
          <p>📍 <strong>Boutique :</strong> Boulevard Général de Gaulle, Dakar, Sénégal</p>
          <p>📞 <strong>Téléphone :</strong> +221 77 536 34 37</p>
          <p>💬 <strong>WhatsApp :</strong> +221 77 536 34 37 (Disponible 7j/7)</p>
        </div>
      </div>

      <!-- Quick links -->
      <div class="space-y-3">
        <h4 class="font-bold text-white uppercase text-xs tracking-wider">Catégories</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="/collections/telephones-accessoires" class="hover:text-white transition-colors">Téléphones & Smartphones</a></li>
          <li><a href="/collections/electromenager" class="hover:text-white transition-colors">Climatiseurs & Réfrigérateurs</a></li>
          <li><a href="/collections/tv-audio" class="hover:text-white transition-colors">Smart TV & Barres de son</a></li>
          <li><a href="/collections/informatique" class="hover:text-white transition-colors">PC Portables & Bureautique</a></li>
          <li><a href="/collections/solaire-energie" class="hover:text-white transition-colors">Ventilateurs Solaires</a></li>
        </ul>
      </div>

      <!-- Customer Service & Legal Pages -->
      <div class="space-y-3">
        <h4 class="font-bold text-white uppercase text-xs tracking-wider">Informations & Légal</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="/pages/a-propos" class="hover:text-white transition-colors">À Propos de nous</a></li>
          <li><a href="/pages/cgu-mentions-legales" class="hover:text-white transition-colors">CGU & Mentions Légales</a></li>
          <li><a href="/pages/politique-confidentialite" class="hover:text-white transition-colors">Politique de Confidentialité</a></li>
          <li><a href="/pages/conditions-generales-vente" class="hover:text-white transition-colors">Conditions Générales de Vente</a></li>
          <li><a href="/pages/livraison" class="hover:text-white transition-colors">Tarifs de Livraison Dakar</a></li>
          <li><a href="/pages/retours-garantie" class="hover:text-white transition-colors">Garanties & Retours (7 Jours)</a></li>
          <li><a href="/pages/faq" class="hover:text-white transition-colors">Foire Aux Questions (FAQ)</a></li>
        </ul>
      </div>

      <!-- Senegal Payments -->
      <div class="space-y-3">
        <h4 class="font-bold text-white uppercase text-xs tracking-wider">Moyens de Paiement</h4>
        <div class="flex flex-wrap gap-2 pt-1">
          <span class="px-2.5 py-1 rounded bg-slate-800 text-blue-400 font-black text-[11px] border border-slate-700">Wave Sénégal</span>
          <span class="px-2.5 py-1 rounded bg-slate-800 text-orange-400 font-black text-[11px] border border-slate-700">Orange Money</span>
          <span class="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-black text-[11px] border border-slate-700">Cash à la livraison</span>
        </div>
        <p class="text-[11px] text-slate-500 pt-2">
          Paiement 100% vérifié à la réception de votre colis.
        </p>
      </div>

    </div>

    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <p>&copy; 2026 TOUBA MADIYINA ELECTRONIC. Tous droits réservés. Boutique optimisée pour le Sénégal.</p>
      <div class="flex items-center gap-3 text-[11px]">
        <a href="/pages/a-propos" class="hover:text-slate-300">À Propos</a>
        <span>•</span>
        <a href="/pages/cgu-mentions-legales" class="hover:text-slate-300">Mentions Légales</a>
        <span>•</span>
        <a href="/pages/politique-confidentialite" class="hover:text-slate-300">Confidentialité</a>
        <span>•</span>
        <a href="/pages/conditions-generales-vente" class="hover:text-slate-300">CGV</a>
      </div>
    </div>
  </div>
</footer>`);

  // 7. config/settings_schema.json
  const settingsSchema = [
    {
      name: "theme_info",
      theme_name: "TOUBA MADIYINA ELECTRONIC Premium Senegal",
      theme_version: "2.0.0",
      theme_author: "TOUBA MADIYINA",
      theme_documentation_url: "https://toubamadiyina.sn",
      theme_support_url: "https://wa.me/221775363437"
    },
    {
      name: "Couleurs & Identité",
      settings: [
        {
          type: "color",
          id: "color_primary",
          label: "Couleur Principale (Boutons)",
          default: "#1e40af"
        },
        {
          type: "color",
          id: "color_secondary",
          label: "Couleur Accent (Vert)",
          default: "#16a34a"
        },
        {
          type: "color",
          id: "color_dark",
          label: "Couleur Sombre",
          default: "#0f172a"
        }
      ]
    },
    {
      name: "Coordonnées Sénégal",
      settings: [
        {
          type: "text",
          id: "whatsapp_number",
          label: "Numéro WhatsApp",
          default: "221775363437"
        },
        {
          type: "text",
          id: "phone_number",
          label: "Téléphone Standard",
          default: "+221 77 536 34 37"
        },
        {
          type: "text",
          id: "address_senegal",
          label: "Adresse à Dakar",
          default: "Boulevard Général de Gaulle, Sandaga / Médina, Dakar"
        }
      ]
    }
  ];
  zip.file('config/settings_schema.json', JSON.stringify(settingsSchema, null, 2));

  // 8. config/settings_data.json
  const settingsData = {
    current: {
      color_primary: "#1e40af",
      color_secondary: "#16a34a",
      color_dark: "#0f172a",
      whatsapp_number: settings.whatsappNumber,
      phone_number: settings.phone,
      address_senegal: settings.address
    }
  };
  zip.file('config/settings_data.json', JSON.stringify(settingsData, null, 2));

  // 9. locales/fr.json
  const frLocale = {
    general: {
      accessibility: {
        skip_to_text: "Passer au contenu"
      },
      meta: {
        tags: "Mots-clés \"{{ tags }}\"",
        page: "Page {{ page }}"
      }
    },
    products: {
      product: {
        add_to_cart: "Ajouter au panier",
        buy_now: "Acheter maintenant",
        order_whatsapp: "Commander sur WhatsApp",
        in_stock: "En stock à Dakar",
        out_of_stock: "Rupture de stock",
        sold_out: "Épuisé",
        regular_price: "Prix normal",
        sale_price: "Prix promotionnel",
        save_html: "Économisez {{ saved_amount }}"
      }
    },
    cart: {
      general: {
        title: "Votre Panier",
        subtotal: "Sous-total",
        shipping_at_checkout: "Frais de livraison calculés à la commande",
        checkout: "Passer la commande",
        empty: "Votre panier est vide",
        continue_shopping: "Continuer les achats"
      }
    }
  };
  zip.file('locales/fr.json', JSON.stringify(frLocale, null, 2));

  // 10. Generate the ZIP Blob
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}
