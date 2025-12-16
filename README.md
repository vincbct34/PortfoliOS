# PortfoliOS

Un portfolio interactif avec une interface inspirée de Windows 11, développé avec React et TypeScript.

![PortfoliOS Screenshot](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

- 🪟 **Interface Windows 11** - Fenêtres redimensionnables, déplaçables, maximisables
- 📁 **Explorateur de fichiers** - Navigation dans l'arborescence virtuelle
- 🎮 **Jeu Snake** - Un classique intégré
- 📝 **Bloc-notes** - Éditeur de texte avec onglets
- ⚙️ **Paramètres rapides** - Mode nuit, mode focus, volume
- 🎨 **Animations fluides** - Powered by Framer Motion
- 🖱️ **Curseur personnalisé** - Effets visuels modernes

## 🛠️ Stack Technique

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **CSS Modules** - Styling

## 🚀 Développement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Vérifier le code (types + lint + format)
npm run check

# Build pour la production
npm run build
```

## 📦 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Preview du build |
| `npm run lint` | Vérification ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm run format` | Formatage Prettier |
| `npm run check` | Types + Lint + Format |

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
