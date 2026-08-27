# ART FASHION — Prêt-à-Porter Masculin de Luxe (Cotonou, Bénin)

<p align="center">
  <img src="apps/storefront/public/logo-art-fashion.png" alt="Logo ART FASHION" width="400">
</p>

> **Monorepo Officiel d'E-commerce & Back-Office CMS pour ART FASHION**  
> 📍 **Localisation physique** : Rue 403, Quartier Zongo / Scoa Gbéto (près Avenue Jean-Paul II & Galerie Fayola), Cotonou, Bénin  
> 🌐 **Facebook Officiel** : [https://www.facebook.com/artfashionbenin/](https://www.facebook.com/artfashionbenin/)  
> **Auteur** : @hopsyder | **Organisation** : Nexus Partners

---

## 🌟 Présentation du Projet

**ART FASHION** est la maison de référence du prêt-à-porter masculin de luxe à Cotonou. Ce projet Monorepo propulsé par **pnpm v10** et **Turborepo** réunit le site vitrine client et le back-office CMS d'administration.

### 🌐 Système de Traduction Bilingue Dynamique (FR 🇫🇷 / EN 🇬🇧)
Le site vitrine est doté d'un **sélecteur de langue dynamique** en haut de page permettant de basculer instantanément entre le Français et l'Anglais sur l'intégralité du catalogue, des boutons d'action et du parcours d'achat.

---

## 📦 Architecture du Monorepo

```
boutique-art-fashion/
├── apps/
│   ├── storefront/            # 🛒 Site Vitrine Client Bilingue FR/EN (Port 3000)
│   │   ├── src/components/    # Header (Lang Toggle), Hero, Catalog, ProductModal, Cart, Checkout
│   │   └── src/context/       # StoreContext avec helper t() & i18n
│   │
│   └── admin-cms/             # 🛠️ Back-Office CMS & Gestionnaire d'Images (Port 3001)
│       ├── src/components/    # ProductManager, SectionImageManager (Éditeur CMS), OrderManager
│       └── src/context/       # AdminContext (Gestion CRUD et persistance)
│
├── packages/
│   └── shared/                # 🧬 Package Partagé (Types, initialData ART FASHION, Helpers FCFA, i18n)
│       └── src/               # Models (Product, Order, SectionsConfig), Dictionnaires FR & EN
│
├── Dockerfile                 # Conteneurisation Multi-stage Monorepo
├── docker-compose.yml         # Port 8080 (Vitrine) & Port 8081 (Admin CMS)
├── nginx.conf                 # Configuration Nginx Multi-serveurs
├── pnpm-workspace.yaml        # Workspace pnpm
├── turbo.json                 # Pipeline Turborepo
└── README.md
```

---

## 🚀 Fonctionnalités Clés & Rayons Masculins

- **Costumes & Blazers** : Costumes 3 pièces croisés italiens, draps de laine fins, finitions dorées d'inspiration dahoméenne.
- **Chemises de Luxe** : Chemises col mandarin en lin pur d'Égypte et coton avec liserés Wax.
- **Grands Boubous Bazin** : Boubous de prestige Bazin Riche Getzner brodés au fil d'or par les artisans de Cotonou.
- **Chaussures & Accessoires** : Mocassins en cuir de veau pleine fleur, ceintures tressées main et boutons de manchette.
- **Accès Google Maps & Facebook** : Boutons d'itinéraire direct vers la Rue 403 et vers la page Facebook [artfashionbenin](https://www.facebook.com/artfashionbenin/).

---

## 💻 Instructions de Lancement

```bash
# 1. Installer les dépendances
pnpm install

# 2. Lancer les 2 applications en parallèle (Vitrine: 3000 | Admin CMS: 3001)
pnpm run dev

# 3. Exécuter la vérification des types TypeScript
pnpm test

# 4. Compilation de production
pnpm build
```

- **Site Vitrine Client** : [http://localhost:3000](http://localhost:3000)
- **Back-Office Admin CMS** : [http://localhost:3001](http://localhost:3001)
