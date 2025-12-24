export type Language = 'fr' | 'en';

export interface Translations {
  common: {
    loading: string;
    error: string;
    close: string;
    open: string;
    save: string;
    cancel: string;
    delete: string;
    download: string;
    search: string;
    yes: string;
    no: string;
  };

  apps: {
    about: string;
    projects: string;
    skills: string;
    contact: string;
    terminal: string;
    settings: string;
    notepad: string;
    snake: string;
    explorer: string;
  };

  desktop: {
    doubleClickToOpen: string;
    ariaLabel: string;
  };

  window: {
    minimize: string;
    maximize: string;
    restore: string;
    close: string;
  };

  taskbar: {
    startMenu: string;
    widgets: string;
    quickSettings: string;
    notifications: string;
    openCalendar: string;
    minimized: string;
    active: string;
  };

  startMenu: {
    search: string;
    pinned: string;
    power: string;
    noResults: string;
    sleep: string;
    restart: string;
    shutdown: string;
  };

  quickSettings: {
    title: string;
    nightMode: string;
    focusMode: string;
    volume: string;
    brightness: string;
    mute: string;
    unmute: string;
  };

  calendar: {
    worldClocks: string;
    days: string[];
    months: string[];
  };

  widgets: {
    weather: string;
    weatherLoading: string;
    weatherUnavailable: string;
    quickLinks: string;
    stats: string;
    projects: string;
    yearsXp: string;
    technologies: string;
  };

  aboutMe: {
    title: string;
    about: string;
    info: string;
    location: string;
    experience: string;
    availability: string;
    viewCV: string;
    cvLocation: string;

    profileTitle: string;
    profileBio: string;
    locationValue: string;
    experienceValue: string;
    availabilityValue: string;
  };

  projectsPage: {
    title: string;
    viewProject: string;
    viewCode: string;

    project1Desc: string;
    project2Desc: string;
    project3Desc: string;
  };

  projects: {
    title: string;
    subtitle: string;
    terminal: string;
    catCommand: string;
    viewProject: string;
    viewAll: string;
    descriptions: {
      opera: string;
      factory: string;
      portfolio: string;
      glados: string;
    };
    types: {
      opera: string;
    };
  };

  skillsPage: {
    title: string;

    catLanguage: string;
    catFrontend: string;
    catBackend: string;
    catDatabase: string;
    catTools: string;
    catDevOps: string;

    tabProcesses: string;
    tabPerformance: string;
    statSkills: string;
    statAvgLevel: string;
    statSpecialty: string;
    statExperience: string;
    years: string;
    colName: string;
    colCategory: string;
    colLevel: string;
    colProficiency: string;

    perfLoading: string;
    perfRetry: string;
    perfCommits: string;
    perfRepos: string;
    perfLanguages: string;
    perfActivity: string;
    perfWeeklyCommits: string;
    perfDailyCommits: string;
    perfTotalCommits: string;
    perfActiveRepos: string;
    perfLanguageUsage: string;
    perfRecentActivity: string;
  };

  contactPage: {
    title: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    successDetail: string;
    errorDetail: string;
    otherWays: string;
  };

  settingsPage: {
    title: string;
    personalization: string;
    wallpaper: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    language: string;
    languageFr: string;
    languageEn: string;
  };

  terminal: {
    welcome: string;
    helpHint: string;
    commandNotFound: string;
    helpTitle: string;
    easterEggs: string;

    cmdHelp: string;
    cmdAbout: string;
    cmdSkills: string;
    cmdProjects: string;
    cmdContact: string;
    cmdClear: string;
    cmdNeofetch: string;
    cmdToast: string;

    aboutTitle: string;
    aboutDesc: string;
    aboutHint: string;

    skillsTitle: string;

    projectsTitle: string;
    projectsHint: string;

    contactTitle: string;

    toastDemo: string;
    toastSuccess: string;
    toastInfo: string;
    toastWarning: string;
    toastError: string;
  };

  notepad: {
    untitled: string;
    file: string;
    new: string;
    openFile: string;
    saveFile: string;
    saveAs: string;
    export: string;
    edit: string;
    cut: string;
    copy: string;
    paste: string;
    undo: string;
    selectAll: string;
    noFiles: string;
    unsavedChanges: string;
    unsavedMessage: string;
    dontSave: string;
    newFileCreated: string;
    fileSaved: string;
    fileOpened: string;
    fileDeleted: string;
    fileDownloaded: string;
    copied: string;
    allCopied: string;
    cutDone: string;
    pasted: string;
    cannotPaste: string;
    confirmNew: string;
    confirmOpen: string;
    confirmDelete: string;
    line: string;
    words: string;
    characters: string;
    startTyping: string;
  };

  fileExplorer: {
    thisPC: string;
    documents: string;
    images: string;
    downloads: string;
    music: string;
    videos: string;
    myFiles: string;
    quickAccess: string;
    items: string;
    item: string;
    selected: string;
    openWith: string;
    copyName: string;
    folderEmpty: string;
  };

  snakeGame: {
    title: string;
    score: string;
    highScore: string;
    gameOver: string;
    playAgain: string;
    startHint: string;
  };

  lockScreen: {
    hint: string;
  };

  bootScreen: {
    loading: string;
    messages: string[];
    shutdownMessages: string[];
    safeToTurnOff: string;
  };

  notifications: {
    title: string;
    noNotifications: string;
    clearAll: string;
  };

  confirm: {
    deleteFile: string;
    deleteFileMessage: string;
  };
}

const fr: Translations = {
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    close: 'Fermer',
    open: 'Ouvrir',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    download: 'Télécharger',
    search: 'Rechercher',
    yes: 'Oui',
    no: 'Non',
  },
  apps: {
    about: 'À propos',
    projects: 'Projets',
    skills: 'Compétences',
    contact: 'Contact',
    terminal: 'Terminal',
    settings: 'Paramètres',
    notepad: 'Bloc-notes',
    snake: 'Snake',
    explorer: 'Explorateur',
  },
  desktop: {
    doubleClickToOpen: 'double-cliquez pour ouvrir',
    ariaLabel: 'Bureau',
  },
  window: {
    minimize: 'Réduire',
    maximize: 'Agrandir',
    restore: 'Restaurer',
    close: 'Fermer',
  },
  taskbar: {
    startMenu: 'Menu Démarrer',
    widgets: 'Widgets',
    quickSettings: 'Paramètres rapides',
    notifications: 'Notifications',
    openCalendar: 'Ouvrir le calendrier',
    minimized: 'réduit',
    active: 'actif',
  },
  startMenu: {
    search: 'Rechercher...',
    pinned: 'Épinglé',
    power: 'Alimentation',
    noResults: 'Aucun résultat',
    sleep: 'Mettre en veille',
    restart: 'Redémarrer',
    shutdown: 'Arrêter',
  },
  quickSettings: {
    title: 'Paramètres rapides',
    nightMode: 'Mode Nuit',
    focusMode: 'Mode Focus',
    volume: 'Volume',
    brightness: 'Luminosité',
    mute: 'Couper le son',
    unmute: 'Réactiver le son',
  },
  calendar: {
    worldClocks: 'Horloges mondiales',
    days: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
  },
  widgets: {
    weather: 'Météo',
    weatherLoading: 'Chargement météo...',
    weatherUnavailable: 'Météo indisponible',
    quickLinks: 'Liens rapides',
    stats: 'Statistiques',
    projects: 'Projets',
    yearsXp: 'Années XP',
    technologies: 'Technologies',
  },
  aboutMe: {
    title: 'À propos de moi',
    about: 'À propos',
    info: 'Informations',
    location: 'Localisation',
    experience: 'Expérience',
    availability: 'Disponibilité',
    viewCV: 'Voir mon CV',
    cvLocation: 'CV disponible dans Documents > CV_Vincent_Bichat.pdf',
    profileTitle: 'Développeur Full Stack',
    profileBio: `Étudiant en informatique à EPITECH Montpellier, passionné par le développement web et les nouvelles technologies.

Je crée des applications modernes et performantes avec une expertise en React, TypeScript et Node.js.

N'hésitez pas à me contacter pour discuter de vos projets !`,
    locationValue: 'Montpellier, France',
    experienceValue: '2+ ans',
    availabilityValue: 'Disponible',
  },
  projectsPage: {
    title: 'Mes Projets',
    viewProject: 'Voir le projet',
    viewCode: 'Voir le code',
    project1Desc:
      'Portfolio original avec une interface Windows 11. Gestion de fenêtres, drag & drop, animations fluides et design moderne.',
    project2Desc:
      'Plateforme web développée en TypeScript avec un design moderne et des fonctionnalités avancées.',
    project3Desc:
      "Interpréteur de langage développé en Haskell dans le cadre d'un projet EPITECH. Parsing, évaluation et gestion d'erreurs.",
  },
  projects: {
    title: 'Mes Projets',
    subtitle: 'Une sélection de mes travaux récents',
    terminal: 'terminal',
    catCommand: 'cat',
    viewProject: 'Voir le projet',
    viewAll: 'Voir tous les projets',
    descriptions: {
      opera: "Plateforme d'inscriptions pour l'Opéra Orchestre National Montpellier.",
      factory: 'Site vitrine pour 404Factory, avec animations et design moderne.',
      portfolio:
        'Ce portfolio ! Interface Windows 11, système de fenêtres et applications interactives.',
      glados:
        'Interpréteur de langage type LISP développé en Haskell. Gestion de la mémoire et parsing avancés.',
    },
    types: {
      opera: 'Application Web',
    },
  },
  skillsPage: {
    title: 'Mes Compétences',
    catLanguage: 'Langage',
    catFrontend: 'Frontend',
    catBackend: 'Backend',
    catDatabase: 'Base de données',
    catTools: 'Outils',
    catDevOps: 'DevOps',
    tabProcesses: 'Processus',
    tabPerformance: 'Performance',
    statSkills: 'Compétences',
    statAvgLevel: 'Maîtrise moyenne',
    statSpecialty: 'Spécialité',
    statExperience: 'Expérience',
    years: 'ans',
    colName: 'Nom',
    colCategory: 'Catégorie',
    colLevel: 'Niveau',
    colProficiency: 'Maîtrise',

    perfLoading: 'Chargement des données GitHub...',
    perfRetry: 'Réessayer',
    perfCommits: 'Commits',
    perfRepos: 'Dépôts',
    perfLanguages: 'Langages',
    perfActivity: 'Activité',
    perfWeeklyCommits: 'Commits hebdomadaires (6 derniers mois)',
    perfDailyCommits: 'Commits quotidiens (8 dernières semaines)',
    perfTotalCommits: 'Total cette année',
    perfActiveRepos: 'Dépôts actifs',
    perfLanguageUsage: 'Utilisation des langages',
    perfRecentActivity: 'Activité récente',
  },
  contactPage: {
    title: 'Me Contacter',
    name: 'Nom',
    email: 'Email',
    subject: 'Sujet',
    message: 'Message',
    send: 'Envoyer',
    sending: 'Envoi en cours...',
    success: 'Message envoyé !',
    successDetail: 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.',
    errorDetail: "Une erreur s'est produite. Veuillez réessayer.",
    otherWays: 'Autres moyens de contact',
  },
  settingsPage: {
    title: 'Paramètres',
    personalization: 'Personnalisation',
    wallpaper: "Fond d'écran",
    theme: 'Thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    language: 'Langue',
    languageFr: 'Français',
    languageEn: 'English',
  },
  terminal: {
    welcome: 'Bienvenue dans le terminal de Vincent!',
    helpHint: 'Tapez "help" pour voir les commandes disponibles.',
    commandNotFound: "n'est pas reconnu comme une commande.",
    helpTitle: 'Commandes disponibles:',
    easterEggs: 'Easter eggs (essayez-les !):',
    cmdHelp: 'Affiche cette aide',
    cmdAbout: 'À propos de moi',
    cmdSkills: 'Mes compétences',
    cmdProjects: 'Liste des projets',
    cmdContact: 'Informations de contact',
    cmdClear: 'Efface le terminal',
    cmdNeofetch: 'Affiche les infos système',
    cmdToast: 'Démonstration des notifications',
    aboutTitle: 'À PROPOS DE MOI',
    aboutDesc:
      'Développeur Full Stack passionné par le code. Je crée des applications modernes et performantes.',
    aboutHint: 'Tapez "skills" pour voir mes compétences.',
    skillsTitle: 'Compétences Techniques:',
    projectsTitle: 'Projets:',
    projectsHint: 'Visitez la fenêtre "Projets" pour plus de détails.',
    contactTitle: 'Contact:',
    toastDemo: 'Démonstration des notifications...',
    toastSuccess: 'Notification de succès',
    toastInfo: "Notification d'information",
    toastWarning: "Notification d'avertissement",
    toastError: "Notification d'erreur",
  },
  notepad: {
    untitled: 'Sans titre',
    file: 'Fichier',
    new: 'Nouveau',
    openFile: 'Ouvrir...',
    saveFile: 'Enregistrer',
    saveAs: 'Enregistrer sous...',
    export: 'Exporter',
    edit: 'Édition',
    cut: 'Couper',
    copy: 'Copier',
    paste: 'Coller',
    undo: 'Annuler',
    selectAll: 'Tout sélectionner',
    noFiles: 'Aucun fichier enregistré',
    unsavedChanges: 'Modifications non enregistrées',
    unsavedMessage: 'Voulez-vous enregistrer les modifications ?',
    dontSave: 'Ne pas enregistrer',
    newFileCreated: 'Nouveau fichier créé',
    fileSaved: 'enregistré',
    fileOpened: 'ouvert',
    fileDeleted: 'supprimé',
    fileDownloaded: 'téléchargé',
    copied: 'Copié dans le presse-papiers',
    allCopied: 'Tout le contenu copié',
    cutDone: 'Coupé dans le presse-papiers',
    pasted: 'Collé depuis le presse-papiers',
    cannotPaste: 'Impossible de coller',
    confirmNew: 'Créer un nouveau fichier sans enregistrer ?',
    confirmOpen: 'Ouvrir un fichier sans enregistrer ?',
    confirmDelete: 'Supprimer',
    line: 'Ligne',
    words: 'mots',
    characters: 'caractères',
    startTyping: 'Commencez à écrire...',
  },
  fileExplorer: {
    thisPC: 'Ce PC',
    documents: 'Documents',
    images: 'Images',
    downloads: 'Téléchargements',
    music: 'Musique',
    videos: 'Vidéos',
    myFiles: 'Mes Fichiers',
    quickAccess: 'Accès rapide',
    items: 'éléments',
    item: 'élément',
    selected: 'sélectionné',
    openWith: 'Ouvrir',
    copyName: 'Copier le nom',
    folderEmpty: 'Ce dossier est vide',
  },
  snakeGame: {
    title: 'Snake',
    score: 'Score',
    highScore: 'Record',
    gameOver: 'Game Over!',
    playAgain: 'Rejouer',
    startHint: 'Appuyez sur une flèche pour commencer',
  },
  lockScreen: {
    hint: 'Cliquez ou appuyez sur une touche pour déverrouiller',
  },
  bootScreen: {
    loading: 'Chargement...',
    messages: [
      'Initialisation du portfolio...',
      'Chargement des projets...',
      'Préparation de la base de compétences...',
      "Configuration de l'espace de travail...",
      'Presque prêt...',
    ],
    shutdownMessages: ['Arrêt du système...', 'Sauvegarde des paramètres...', 'À bientôt !'],
    safeToTurnOff: 'Vous pouvez maintenant fermer cette fenêtre.',
  },
  notifications: {
    title: 'Notifications',
    noNotifications: 'Aucune notification',
    clearAll: 'Tout effacer',
  },
  confirm: {
    deleteFile: 'Supprimer le fichier',
    deleteFileMessage:
      'Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.',
  },
};

const en: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    close: 'Close',
    open: 'Open',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    download: 'Download',
    search: 'Search',
    yes: 'Yes',
    no: 'No',
  },
  apps: {
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    contact: 'Contact',
    terminal: 'Terminal',
    settings: 'Settings',
    notepad: 'Notepad',
    snake: 'Snake',
    explorer: 'Explorer',
  },
  desktop: {
    doubleClickToOpen: 'double-click to open',
    ariaLabel: 'Desktop',
  },
  window: {
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    close: 'Close',
  },
  taskbar: {
    startMenu: 'Start Menu',
    widgets: 'Widgets',
    quickSettings: 'Quick Settings',
    notifications: 'Notifications',
    openCalendar: 'Open calendar',
    minimized: 'minimized',
    active: 'active',
  },
  startMenu: {
    search: 'Search...',
    pinned: 'Pinned',
    power: 'Power',
    noResults: 'No results',
    sleep: 'Sleep',
    restart: 'Restart',
    shutdown: 'Shut down',
  },
  quickSettings: {
    title: 'Quick Settings',
    nightMode: 'Night Mode',
    focusMode: 'Focus Mode',
    volume: 'Volume',
    brightness: 'Brightness',
    mute: 'Mute',
    unmute: 'Unmute',
  },
  calendar: {
    worldClocks: 'World Clocks',
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
  widgets: {
    weather: 'Weather',
    weatherLoading: 'Loading weather...',
    weatherUnavailable: 'Weather unavailable',
    quickLinks: 'Quick Links',
    stats: 'Statistics',
    projects: 'Projects',
    yearsXp: 'Years XP',
    technologies: 'Technologies',
  },
  aboutMe: {
    title: 'About Me',
    about: 'About',
    info: 'Information',
    location: 'Location',
    experience: 'Experience',
    availability: 'Availability',
    viewCV: 'View my CV',
    cvLocation: 'CV available in Documents > CV_Vincent_Bichat.pdf',
    profileTitle: 'Full Stack Developer',
    profileBio: `Computer Science student at EPITECH Montpellier, passionate about web development and new technologies.

I create modern and performant applications with expertise in React, TypeScript and Node.js.

Feel free to contact me to discuss your projects!`,
    locationValue: 'Montpellier, France',
    experienceValue: '2+ years',
    availabilityValue: 'Available',
  },
  projectsPage: {
    title: 'My Projects',
    viewProject: 'View project',
    viewCode: 'View code',
    project1Desc:
      'Original portfolio with a Windows 11 interface. Window management, drag & drop, smooth animations and modern design.',
    project2Desc: 'Web platform developed in TypeScript with modern design and advanced features.',
    project3Desc:
      'Language interpreter developed in Haskell as part of an EPITECH project. Parsing, evaluation and error handling.',
  },
  projects: {
    title: 'My Projects',
    subtitle: 'A selection of my recent work',
    terminal: 'terminal',
    catCommand: 'cat',
    viewProject: 'View Project',
    viewAll: 'View All Projects',
    descriptions: {
      opera: 'Registration platform for the Opéra Orchestre National Montpellier.',
      factory: 'Showcase website for 404Factory, featuring animations and modern design.',
      portfolio:
        'This portfolio! Windows 11 interface, window system, and interactive applications.',
      glados:
        'LISP-like language interpreter developed in Haskell. Advanced parsing and memory management.',
    },
    types: {
      opera: 'Web Application',
    },
  },
  skillsPage: {
    title: 'My Skills',
    catLanguage: 'Language',
    catFrontend: 'Frontend',
    catBackend: 'Backend',
    catDatabase: 'Database',
    catTools: 'Tools',
    catDevOps: 'DevOps',
    tabProcesses: 'Processes',
    tabPerformance: 'Performance',
    statSkills: 'Skills',
    statAvgLevel: 'Average Level',
    statSpecialty: 'Specialty',
    statExperience: 'Experience',
    years: 'years',
    colName: 'Name',
    colCategory: 'Category',
    colLevel: 'Level',
    colProficiency: 'Proficiency',

    perfLoading: 'Loading GitHub data...',
    perfRetry: 'Retry',
    perfCommits: 'Commits',
    perfRepos: 'Repositories',
    perfLanguages: 'Languages',
    perfActivity: 'Activity',
    perfWeeklyCommits: 'Weekly Commits (last 6 months)',
    perfDailyCommits: 'Daily Commits (last 8 weeks)',
    perfTotalCommits: 'Total This Year',
    perfActiveRepos: 'Active Repos',
    perfLanguageUsage: 'Language Usage',
    perfRecentActivity: 'Recent Activity',
  },
  contactPage: {
    title: 'Contact Me',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send',
    sending: 'Sending...',
    success: 'Message sent!',
    successDetail: 'Thank you for your message. I will get back to you soon.',
    errorDetail: 'An error occurred. Please try again.',
    otherWays: 'Other ways to contact me',
  },
  settingsPage: {
    title: 'Settings',
    personalization: 'Personalization',
    wallpaper: 'Wallpaper',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'Language',
    languageFr: 'Français',
    languageEn: 'English',
  },
  terminal: {
    welcome: "Welcome to Vincent's terminal!",
    helpHint: 'Type "help" for available commands.',
    commandNotFound: 'is not recognized as a command.',
    helpTitle: 'Available commands:',
    easterEggs: 'Easter eggs (try them!):',
    cmdHelp: 'Display this help',
    cmdAbout: 'About me',
    cmdSkills: 'My skills',
    cmdProjects: 'Project list',
    cmdContact: 'Contact info',
    cmdClear: 'Clear terminal',
    cmdNeofetch: 'Display system info',
    cmdToast: 'Notification demo',
    aboutTitle: 'ABOUT ME',
    aboutDesc:
      'Full Stack Developer passionate about code. I create modern and performant applications.',
    aboutHint: 'Type "skills" to see my skills.',
    skillsTitle: 'Technical Skills:',
    projectsTitle: 'Projects:',
    projectsHint: 'Visit the "Projects" window for more details.',
    contactTitle: 'Contact:',
    toastDemo: 'Notification demonstration...',
    toastSuccess: 'Success notification',
    toastInfo: 'Information notification',
    toastWarning: 'Warning notification',
    toastError: 'Error notification',
  },
  notepad: {
    untitled: 'Untitled',
    file: 'File',
    new: 'New',
    openFile: 'Open...',
    saveFile: 'Save',
    saveAs: 'Save As...',
    export: 'Export',
    edit: 'Edit',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    undo: 'Undo',
    selectAll: 'Select All',
    noFiles: 'No saved files',
    unsavedChanges: 'Unsaved changes',
    unsavedMessage: 'Do you want to save your changes?',
    dontSave: "Don't save",
    newFileCreated: 'New file created',
    fileSaved: 'saved',
    fileOpened: 'opened',
    fileDeleted: 'deleted',
    fileDownloaded: 'downloaded',
    copied: 'Copied to clipboard',
    allCopied: 'All content copied',
    cutDone: 'Cut to clipboard',
    pasted: 'Pasted from clipboard',
    cannotPaste: 'Cannot paste',
    confirmNew: 'Create new file without saving?',
    confirmOpen: 'Open file without saving?',
    confirmDelete: 'Delete',
    line: 'Line',
    words: 'words',
    characters: 'characters',
    startTyping: 'Start typing...',
  },
  fileExplorer: {
    thisPC: 'This PC',
    documents: 'Documents',
    images: 'Pictures',
    downloads: 'Downloads',
    music: 'Music',
    videos: 'Videos',
    myFiles: 'My Files',
    quickAccess: 'Quick Access',
    items: 'items',
    item: 'item',
    selected: 'selected',
    openWith: 'Open',
    copyName: 'Copy name',
    folderEmpty: 'This folder is empty',
  },
  snakeGame: {
    title: 'Snake',
    score: 'Score',
    highScore: 'High Score',
    gameOver: 'Game Over!',
    playAgain: 'Play Again',
    startHint: 'Press an arrow key to start',
  },
  lockScreen: {
    hint: 'Click or press any key to unlock',
  },
  bootScreen: {
    loading: 'Loading...',
    messages: [
      'Initializing portfolio...',
      'Loading projects...',
      'Preparing skills database...',
      'Setting up workspace...',
      'Almost ready...',
    ],
    shutdownMessages: ['Shutting down...', 'Saving settings...', 'See you soon!'],
    safeToTurnOff: 'It is now safe to close this window.',
  },
  notifications: {
    title: 'Notifications',
    noNotifications: 'No notifications',
    clearAll: 'Clear all',
  },
  confirm: {
    deleteFile: 'Delete file',
    deleteFileMessage: 'Are you sure you want to delete this file? This action cannot be undone.',
  },
};

export const translations: Record<Language, Translations> = { fr, en };
