# PortfoliOS

Un portfolio interactif avec une interface inspirée de Windows 11, développé avec React et TypeScript.

![PortfoliOS Screenshot](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

- 🪟 **Interface Windows 11** - Fenêtres redimensionnables, déplaçables, maximisables
- 📁 **Explorateur de fichiers** - Navigation dans l'arborescence virtuelle
- 🎮 **Jeu Snake** - Un classique intégré
- 📝 **Bloc-notes** - Éditeur de texte avec onglets
- 📧 **Formulaire de contact** - Envoi d'emails via EmailJS
- ⚙️ **Paramètres rapides** - Mode nuit, mode focus, volume
- 🎨 **Animations fluides** - Powered by Framer Motion
- 🖱️ **Curseur personnalisé** - Effets visuels modernes

## 🛠️ Stack Technique

- **React 19** - UI Framework
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool
- **Vitest** - Testing framework
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **EmailJS** - Contact form
- **CSS Modules** - Styling

## 🚀 Développement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Vérifier le code (types + lint + format + tests)
npm run check

# Build pour la production
npm run build
```

## 🧪 Tests

```bash
# Lancer les tests en mode watch
npm run test

# Lancer les tests une seule fois
npm run test:run

# Tests pour CI (exclut les tests nécessitant des variables d'environnement)
npm run test:ci
```

## 📦 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Preview du build |
| `npm run lint` | Vérification ESLint |
| `npm run lint:fix` | Correction automatique ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm run format` | Formatage Prettier |
| `npm run format:check` | Vérification du formatage |
| `npm run test` | Tests en mode watch |
| `npm run test:run` | Tests (exécution unique) |
| `npm run check` | Types + Lint + Format + Tests |
| `npm run check:ci` | Vérification complète pour CI |

## 🚢 Déploiement

Le projet est configuré pour un déploiement automatique sur **Railway**.

1. Connectez votre repo GitHub à Railway
2. Railway détecte automatiquement Vite et configure le build
3. Le site est déployé à chaque push sur `main`

## 📝 Personnalisation

Pour personnaliser le contenu du portfolio, éditez le fichier :

```
src/data/portfolio.ts
```

Ce fichier contient toutes les informations personnelles : profil, compétences, projets et contacts.

## 📄 License

MIT © Vincent Bichat
