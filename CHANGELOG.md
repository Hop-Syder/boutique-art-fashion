# CHANGELOG — Art Fashion (Prêt-à-Porter de Luxe)

Toutes les modifications majeures, améliorations de fonctionnalités, optimisations UX/UI, SEO et corrections apportées au projet **Storefront + Admin CMS** sont répertoriées ci-dessous.

---

## [1.0.0] - 2026-08-19

### 🎨 Marque & Identité Officielle
- **Nom de Marque Officiel** : **Art Fashion**
- **Slogan Officiel** : **Prêt-à-Porter de Luxe**
- Alignement bilingue (FR / EN) des balises Meta SEO, balises Open Graph, titres de pages, pied de page et barre d'annonce.

---

### 📂 Restructuration des Catégories (9 Rayons Officiels)
Alignement strict des 9 rayons de prêt-à-porter avec emojis explicites sur le Storefront et l'Admin CMS :
1. 👕 **Hauts (Chemises, Boubous...)** (`cat.hauts` / `hauts`)
2. 👖 **Bas (Pantalons, Jeans...)** (`cat.bas` / `bas`)
3. 🧥 **Vestes & manteaux** (`cat.vestes_manteaux` / `vestes-manteaux`)
4. 🤵 **Costumes & habillé** (`cat.costumes_habille` / `costumes-habille`)
5. 🩲 **Sous-vêtements** (`cat.sous_vetements` / `sous-vetements`)
6. 👞 **Chaussures** (`cat.chaussures` / `chaussures`)
7. 💼 **Accessoires** (`cat.accessoires` / `accessoires`)
8. 🏋️ **Vêtements de sport** (`cat.vetements_de_sport` / `vetements-de-sport`)
9. 🎁 **Autre** (`cat.autre` / `autre`)

---

### 🛍️ Storefront (Site Vitrine Client)
- **Menu de Navigation Desktop Fixe** : En-tête survolant toutes les pages avec accès prioritaire permanent et verre dépoli (`backdrop-blur-xl`).
- **Bouton Panier Flottant au Scroll** : Dès que l'utilisateur défile vers le bas (`window.scrollY > 150`), un bouton panier flottant apparaît au-dessus du bouton WhatsApp. Il affiche le badge dynamique d'articles, le montant total en FCFA et ouvre le tiroir du panier en un clic.
- **Moteur de Recherche Full-Text Multi-Champs** : Recherche instantanée et insensible aux accents sur l'ensemble des champs (nom, description, références SKU, variantes, couleurs, tailles, tags, attributs).
- **Avis Clients Authentiques** : Intégration dynamique des témoignages clients dans le bandeau de réassurance.
- **Filtres Dynamiques Bilingues** : Filtres interactifs par tailles, pointures, couleurs, coupes, matières et collections.

---

### ⚙️ Admin CMS (Back-Office de Gestion)
- **Téléversement d'Images Locales (Max 3 Mo)** : Composant `ImageUploadInput` autorisant le choix de fichiers `.png`, `.jpg`, `.jpeg` ou `.webp` depuis l'ordinateur/smartphone avec validation stricte de taille à 3 Mo max.
- **Formulaire Produit Harmonisé** : Sélecteur de catégorie affichant les 9 rayons avec emojis et descriptions.
- **Éditeur de Sections (CMS)** : Édition en temps réel du bandeau Hero, du bloc Artisanat & Savoir-faire, et des bannières promotionnelles.
- **Gestionnaire des Commandes & Zones de Livraison** : Suivi des statuts (`NOUVELLE`, `CONTACTÉE`, `CONFIRMÉE`, `EN_COURS_DE_LIVRAISON`, `LIVRÉE`, `ANNULÉE`) avec accès direct aux échanges WhatsApp client.
- **Sauvegarde & Restauration JSON** : Exportation et importation complètes de la base de données en un clic.

---

### 🚀 Performance, SEO & Infrastructure
- **Architecture Monorepo Clean (pnpm + Turbo)** : Packages `@ayele/shared`, `@ayele/storefront`, `@ayele/admin-cms`.
- **Validation Strictes** : `pnpm test` (0 erreur TypeScript / Linter), `pnpm build` (Compilations Vite de production en 5s).
- **Standards DEXTY & Author Header** : Présence des blocs d'en-tête Nexus Partners sur tous les composants majeurs.
