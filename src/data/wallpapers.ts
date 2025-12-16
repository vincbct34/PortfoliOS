/**
 * Available wallpapers for the desktop background
 */
export interface Wallpaper {
  id: string;
  name: string;
  value: string;
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'gradient-purple',
    name: 'Purple Gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'gradient-blue',
    name: 'Blue Ocean',
    value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'gradient-dark',
    name: 'Dark Mode',
    value: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    value: 'linear-gradient(135deg, #00c6fb 0%, #005bea 50%, #7c3aed 100%)',
  },
  {
    id: 'gradient-forest',
    name: 'Forest',
    value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  },
  {
    id: 'gradient-midnight',
    name: 'Midnight',
    value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  },
  {
    id: 'gradient-candy',
    name: 'Candy',
    value: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #fcb69f 100%)',
  },
  {
    id: 'gradient-ocean',
    name: 'Deep Ocean',
    value: 'linear-gradient(135deg, #0c1a2c 0%, #1a3a5c 50%, #0d4f6e 100%)',
  },
  {
    id: 'mesh-gradient',
    name: 'Mesh',
    value:
      'radial-gradient(at 40% 20%, hsla(280,70%,50%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,90%,50%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,85%,55%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(220,80%,50%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,80%,55%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(140,70%,45%,1) 0px, transparent 50%), linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  },
  {
    id: 'solid-black',
    name: 'Pure Black',
    value: '#000000',
  },
  {
    id: 'solid-charcoal',
    name: 'Charcoal',
    value: '#1a1a1a',
  },
];

/**
 * Available accent colors for UI elements
 */
export interface AccentColor {
  id: string;
  name: string;
  value: string;
}

export const accentColors: AccentColor[] = [
  { id: 'blue', name: 'Blue', value: '#0078d4' },
  { id: 'purple', name: 'Purple', value: '#8b5cf6' },
  { id: 'pink', name: 'Pink', value: '#ec4899' },
  { id: 'red', name: 'Red', value: '#ef4444' },
  { id: 'orange', name: 'Orange', value: '#f97316' },
  { id: 'green', name: 'Green', value: '#22c55e' },
  { id: 'teal', name: 'Teal', value: '#14b8a6' },
];
