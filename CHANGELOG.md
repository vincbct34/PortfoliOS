# Changelog

All notable changes to PortfoliOS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.3.1] - 2025-12-24

### Fixed
- **CI/CD**: Fixed linting and type errors to ensure `npm run check` passes successfully
  - Removed unused variables in `useOpenGraphImage`
  - Fixed type safety in `Projects.tsx`

### Removed
- **Keyboard Shortcuts**: Removed all keyboard shortcut functionality
  - Deleted `useKeyboardNavigation` hook (Window movement with Ctrl+Keys)
  - Deleted `useKeyboardShortcuts` hook (Global shortcuts)
  - Updated `Window` component to remove keyboard navigation integration
## [1.3.0] - 2025-12-24

### Added
- **Code Documentation**: Added consistent JSDoc-style comments to 57 TypeScript files
  - File headers with `@file` and `@description` tags
  - Interface and type documentation
  - Function and component JSDoc with `@param` and `@returns` tags
  - Documented files include: core files, apps, components, contexts, hooks, services, data, types, constants, and utilities

---

## [1.2.0] - 2025-12-17

### Added
- **GitHub Performance Dashboard**: New Performance tab in Skills app with Task Manager-style interface
  - Animated canvas graphs showing weekly/daily commit activity
  - Repository stats (public + private with token)
  - Language usage bar with GitHub color scheme
  - Recent activity feed with event icons
  - GitHub API integration with localStorage caching (1h TTL)
  - Support for `VITE_GITHUB_TOKEN` environment variable for private repo access
  - Responsive design for mobile/tablet/desktop

### Changed
- **Skills App**: Now has two tabs - Processes (existing) and Performance (new)
- **Environment**: Added `VITE_GITHUB_TOKEN` to `.env.example`
- **TypeScript**: Added env type declarations in `vite-env.d.ts`

---

## [1.1.0] - 2025-12-17

### Added
- **Mobile Responsiveness**: Added responsive CSS media queries (768px breakpoint) to 7 apps:
  - **AboutMe**: Vertical header layout, centered avatar, stacked info grid
  - **Contact**: Single-column contact methods, full-width form
  - **FileExplorer**: Hidden sidebar, compact toolbar and grid items
  - **Notepad**: Compact menu bar, responsive dialogs
  - **Projects**: Smaller card widths, extra 480px breakpoint for single column
  - **Settings**: Horizontal tab navigation, 2-column wallpaper grid
  - **Skills**: 2-column stats bar, simplified process list

### Changed
- **Desktop**: Hide desktop icons on mobile devices (use taskbar/start menu instead)
- **README**: Updated README with latest changes
- **.gitattributes**: Convert line endings to LF
- **SnakeGame**: Improved mobile controls and styling; fixed D-pad overlapping taskbar on small screens
- **Terminal**: Updated CSS module styling
- **Desktop**: Updated module styling
- **StartMenu**: Updated styling for better mobile responsiveness; removed search auto-focus to prevent keyboard popup on mobile
- **Taskbar**: Improved styling with icon-only mode, active indicator, and mobile responsiveness
- **Window**: Hide resize handles when window is maximized

---

## [1.0.0] - 2025-12-17

### Added
- **MIT License**: Added MIT License to the project for open source distribution (`2534b0d`)

### Changed
- **CI Workflow**: Updated CI workflow to use `check:ci` script for consistency in checks (`6f26b0a`)

---

## [0.3.0] - 2025-12-16 (Deployed Version)

> This is the version deployed at commit `7a6ae60ceaba1d25077c5ac33d6179c24c61cf46`

### Fixed
- **Code Quality**: Formatting fixes to complete the check script (`7a6ae60`)

### Changed
- **Email Service**: Refactored email service config to validate configuration at runtime and use local variables for environment values (`11c15f0`)
- **Testing**: Updated framer-motion mocks in Desktop and Window tests to handle additional props
- **Error Handling**: Replaced `console.log` with `console.error` for window close error reporting in App.tsx
- **CI Workflow**: Refactored CI workflow for improved readability and consistency (`16b2b41`)

---

## [0.2.0] - 2025-12-16

### Added
- **Vitest Testing Setup**: Introduced Vitest and Testing Library for unit testing, including configuration and initial test files for components and contexts (`801b4a4`)
- **PWA Support**: Enhanced PWA support with manifest, service worker, and meta tags in index.html
- **Public Assets**: Added public assets for PWA functionality
- **SEO & Social Sharing**: Improved SEO and social sharing metadata

### Changed
- Updated `.gitignore` for test and coverage files

---

## [0.1.0] - 2025-12-16

### Added
- **Portfolio Data**: Centralized portfolio content in `src/data/portfolio.ts` (`cbd671e`)
- **Email Service**: Added EmailJS integration via a new emailService
- **CI Workflow**: Added CI workflow and environment variable example
- **Custom Cursor**: Added custom cursor resize states

### Changed
- **AboutMe, Skills, Projects, Contact Apps**: Refactored to use centralized portfolio data
- **Contact Form**: Updated with async submission, status messages, and spinner
- **Project Images**: Improved project image handling
- Various UI elements and documentation updates

---

## [0.0.1] - 2025-12-16

### Added
- **Initial Release**: Set up a new React project using Vite (`9bde608`)
- Initial configuration files (`.gitignore`, Prettier, ESLint)
- Project structure with essential components, contexts, hooks, and services
- Example apps showcasing the OS-like interface
- Global styles and asset files to provide a functional starting point
