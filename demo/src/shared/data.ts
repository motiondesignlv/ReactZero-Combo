import type { TabConfig } from '@reactzero/combo/tabs';

export const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew'];

export interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export const frameworks: OptionItem[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
  { label: 'Preact', value: 'preact' },
];

export interface UserItem {
  name: string;
  role: string;
  initials: string;
  color: string;
}

export const users: UserItem[] = [
  { name: 'Alice Johnson', role: 'Engineering Lead', initials: 'AJ', color: '#3b82f6' },
  { name: 'Bob Smith', role: 'Product Manager', initials: 'BS', color: '#ef4444' },
  { name: 'Carol Davis', role: 'Designer', initials: 'CD', color: '#10b981' },
  { name: 'Dan Wilson', role: 'DevOps Engineer', initials: 'DW', color: '#f59e0b' },
  { name: 'Eve Brown', role: 'QA Analyst', initials: 'EB', color: '#8b5cf6' },
];

export interface EnvItem {
  label: string;
  value: string;
  status: string;
  color: string;
}

export const environments: EnvItem[] = [
  { label: 'Production', value: 'prod', status: 'healthy', color: '#10b981' },
  { label: 'Staging', value: 'staging', status: 'warning', color: '#f59e0b' },
  { label: 'Development', value: 'dev', status: 'healthy', color: '#10b981' },
  { label: 'Canary', value: 'canary', status: 'error', color: '#ef4444' },
];

export interface MailFolder {
  label: string;
  value: string;
  count: number;
}

export const mailFolders: MailFolder[] = [
  { label: 'Inbox', value: 'inbox', count: 23 },
  { label: 'Starred', value: 'starred', count: 5 },
  { label: 'Drafts', value: 'drafts', count: 2 },
  { label: 'Sent', value: 'sent', count: 0 },
  { label: 'Archive', value: 'archive', count: 142 },
];

export const fruitGroups = [
  { label: 'Tropical', items: ['Mango', 'Papaya', 'Pineapple', 'Coconut'] },
  { label: 'Berries', items: ['Strawberry', 'Blueberry', 'Raspberry'] },
  { label: 'Stone Fruits', items: ['Peach', 'Plum', 'Cherry'] },
];

type FoodItem = { label: string; value: string };

const fruitItems: FoodItem[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
];

const vegetableItems: FoodItem[] = [
  { label: 'Carrot', value: 'carrot' },
  { label: 'Broccoli', value: 'broccoli' },
  { label: 'Spinach', value: 'spinach' },
  { label: 'Kale', value: 'kale' },
];

const grainItems: FoodItem[] = [
  { label: 'Rice', value: 'rice' },
  { label: 'Wheat', value: 'wheat' },
  { label: 'Oats', value: 'oats' },
  { label: 'Quinoa', value: 'quinoa' },
];

export const foodTabs: TabConfig<FoodItem>[] = [
  { id: 'fruits', label: 'Fruits', items: fruitItems, badge: fruitItems.length },
  { id: 'vegetables', label: 'Vegetables', items: vegetableItems, badge: vegetableItems.length },
  { id: 'grains', label: 'Grains', items: grainItems, badge: grainItems.length },
];

export const checkboxItems: OptionItem[] = [
  { label: 'Read', value: 'read' },
  { label: 'Write', value: 'write' },
  { label: 'Execute', value: 'execute' },
  { label: 'Delete', value: 'delete' },
  { label: 'Admin', value: 'admin' },
];

// Rich fruits with descriptions for playground rich item variant
export interface RichFruit {
  label: string;
  value: string;
  description: string;
  icon: string;
}

export const richFruits: RichFruit[] = [
  { label: 'Apple', value: 'apple', description: 'Sweet and crispy', icon: '🍎' },
  { label: 'Banana', value: 'banana', description: 'Rich in potassium', icon: '🍌' },
  { label: 'Cherry', value: 'cherry', description: 'Small and tart', icon: '🍒' },
  { label: 'Date', value: 'date', description: 'Naturally sweet', icon: '🌴' },
  { label: 'Elderberry', value: 'elderberry', description: 'Immune booster', icon: '🫐' },
  { label: 'Fig', value: 'fig', description: 'Soft and seedy', icon: '🥝' },
  { label: 'Grape', value: 'grape', description: 'Vine-ripened', icon: '🍇' },
  { label: 'Honeydew', value: 'honeydew', description: 'Cool and refreshing', icon: '🍈' },
];

// Action items for playground action variant
export interface ActionItem {
  label: string;
  value: string;
  description: string;
  actionLabel: string;
}

export const actionItems: ActionItem[] = [
  { label: 'Deploy to Production', value: 'deploy-prod', description: 'Push latest build to production servers', actionLabel: 'Run' },
  { label: 'Rollback', value: 'rollback', description: 'Revert to the previous stable version', actionLabel: 'Run' },
  { label: 'Clear Cache', value: 'clear-cache', description: 'Invalidate CDN and application cache', actionLabel: 'Run' },
  { label: 'Run Tests', value: 'run-tests', description: 'Execute the full test suite', actionLabel: 'Run' },
  { label: 'Sync Database', value: 'sync-db', description: 'Run pending migrations', actionLabel: 'Run' },
];

// Currency items for trigger decoration demos
export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

// Category groups for grouped items demos
export interface CategoryItem {
  label: string;
  value: string;
}

// --- Creative Showcase Data ---

export interface GradientItem {
  label: string;
  value: string;
  gradient: string;
  from: string;
  to: string;
}

export const gradients: GradientItem[] = [
  { label: 'Sunset Blaze', value: 'sunset', gradient: 'linear-gradient(135deg, #f97316, #ec4899)', from: '#f97316', to: '#ec4899' },
  { label: 'Ocean Depths', value: 'ocean', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', from: '#06b6d4', to: '#3b82f6' },
  { label: 'Northern Lights', value: 'aurora', gradient: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', from: '#8b5cf6', to: '#06b6d4' },
  { label: 'Forest Canopy', value: 'forest', gradient: 'linear-gradient(135deg, #10b981, #84cc16)', from: '#10b981', to: '#84cc16' },
  { label: 'Rose Gold', value: 'rosegold', gradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)', from: '#f43f5e', to: '#f59e0b' },
  { label: 'Midnight Sky', value: 'midnight', gradient: 'linear-gradient(135deg, #1e1b4b, #7c3aed)', from: '#1e1b4b', to: '#7c3aed' },
  { label: 'Coral Reef', value: 'coral', gradient: 'linear-gradient(135deg, #fb923c, #f472b6)', from: '#fb923c', to: '#f472b6' },
  { label: 'Arctic Frost', value: 'arctic', gradient: 'linear-gradient(135deg, #e0f2fe, #c7d2fe)', from: '#e0f2fe', to: '#c7d2fe' },
];

export interface DestinationItem {
  label: string;
  value: string;
  country: string;
  gradient: string;
  icon: string;
  rating: number;
  price: string;
}

export const destinations: DestinationItem[] = [
  { label: 'Santorini', value: 'santorini', country: 'Greece', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', icon: '🏛️', rating: 4.9, price: '$1,200' },
  { label: 'Kyoto', value: 'kyoto', country: 'Japan', gradient: 'linear-gradient(135deg, #f43f5e, #f97316)', icon: '⛩️', rating: 4.8, price: '$1,450' },
  { label: 'Machu Picchu', value: 'machu', country: 'Peru', gradient: 'linear-gradient(135deg, #10b981, #84cc16)', icon: '🏔️', rating: 4.9, price: '$980' },
  { label: 'Marrakech', value: 'marrakech', country: 'Morocco', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: '🕌', rating: 4.6, price: '$650' },
  { label: 'Reykjavik', value: 'reykjavik', country: 'Iceland', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)', icon: '🌋', rating: 4.7, price: '$1,800' },
  { label: 'Bali', value: 'bali', country: 'Indonesia', gradient: 'linear-gradient(135deg, #14b8a6, #22c55e)', icon: '🌴', rating: 4.7, price: '$890' },
];

export interface TrackItem {
  title: string;
  value: string;
  artist: string;
  album: string;
  duration: string;
  color: string;
  bpm: number;
}

export const tracks: TrackItem[] = [
  { title: 'Midnight Drive', value: 'midnight-drive', artist: 'Neon Echo', album: 'Cityscapes', duration: '3:42', color: '#7c3aed', bpm: 120 },
  { title: 'Golden Hour', value: 'golden-hour', artist: 'Sol Rising', album: 'Daybreak', duration: '4:15', color: '#f59e0b', bpm: 98 },
  { title: 'Deep Current', value: 'deep-current', artist: 'Aqua Marine', album: 'Tides', duration: '5:01', color: '#06b6d4', bpm: 110 },
  { title: 'Electric Bloom', value: 'electric-bloom', artist: 'Flora Bass', album: 'Garden EP', duration: '3:28', color: '#ec4899', bpm: 128 },
  { title: 'Mountain Echo', value: 'mountain-echo', artist: 'Alto Peak', album: 'Elevation', duration: '6:12', color: '#10b981', bpm: 85 },
  { title: 'Rust & Dust', value: 'rust-dust', artist: 'Desert Road', album: 'Highway', duration: '4:44', color: '#f97316', bpm: 105 },
];

// --- Abstract Art Gallery Data ---

export interface ArtworkItem {
  label: string;
  value: string;
  artist: string;
  medium: string;
  category: 'fluid' | 'geometric' | 'cosmic';
  image: string;
  fallbackGradient: string;
}

export const artworks: ArtworkItem[] = [
  { label: 'Fluid Dreams', value: 'fluid-dreams', artist: 'Elena Morisot', medium: 'Digital', category: 'fluid', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
  { label: 'Chromatic Wave', value: 'chromatic-wave', artist: 'Marcus Cole', medium: 'Acrylic', category: 'fluid', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #f97316, #06b6d4)' },
  { label: 'Gradient Horizon', value: 'gradient-horizon', artist: 'Yuki Tanaka', medium: 'Digital', category: 'fluid', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #3b82f6, #10b981)' },
  { label: 'Indigo Depths', value: 'indigo-depths', artist: 'Sofia Ren', medium: 'Oil', category: 'cosmic', image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  { label: 'Geometric Bloom', value: 'geometric-bloom', artist: 'Leo Vance', medium: 'Digital', category: 'geometric', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)' },
  { label: 'Liquid Marble', value: 'liquid-marble', artist: 'Anya Petrova', medium: 'Mixed', category: 'fluid', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #ec4899, #f97316)' },
  { label: 'Deep Space', value: 'deep-space', artist: 'James Xu', medium: 'Photography', category: 'cosmic', image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #1e1b4b, #7c3aed)' },
  { label: 'Painted Ribbons', value: 'painted-ribbons', artist: 'Clara Dubois', medium: 'Acrylic', category: 'geometric', image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=400&h=200&fit=crop&auto=format', fallbackGradient: 'linear-gradient(135deg, #3b82f6, #ef4444)' },
];

// --- Design Palette Explorer Data ---

export interface PaletteItem {
  label: string;
  value: string;
  colors: string[];
  category: string;
}

export const palettes: PaletteItem[] = [
  { label: 'Sunset Warm', value: 'sunset-warm', colors: ['#f97316', '#f59e0b', '#ef4444', '#fbbf24', '#dc2626'], category: 'Warm' },
  { label: 'Ocean Breeze', value: 'ocean-breeze', colors: ['#06b6d4', '#3b82f6', '#0ea5e9', '#2dd4bf', '#1d4ed8'], category: 'Cool' },
  { label: 'Forest Walk', value: 'forest-walk', colors: ['#10b981', '#84cc16', '#22c55e', '#16a34a', '#365314'], category: 'Natural' },
  { label: 'Berry Crush', value: 'berry-crush', colors: ['#ec4899', '#a855f7', '#8b5cf6', '#f472b6', '#7c3aed'], category: 'Vibrant' },
  { label: 'Neutral Stone', value: 'neutral-stone', colors: ['#78716c', '#a8a29e', '#d6d3d1', '#57534e', '#e7e5e4'], category: 'Neutral' },
  { label: 'Neon Glow', value: 'neon-glow', colors: ['#06ffa5', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7'], category: 'Vibrant' },
];

// --- Component Library Data ---

export interface ComponentItem {
  label: string;
  value: string;
  description: string;
  icon: string;
  badge?: 'popular' | 'new';
  gradient: string;
}

export const components: ComponentItem[] = [
  { label: 'Button', value: 'button', description: 'Clickable actions and CTAs', icon: '▸', badge: 'popular', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
  { label: 'Modal', value: 'modal', description: 'Overlay dialogs and confirms', icon: '▣', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)' },
  { label: 'Data Table', value: 'data-table', description: 'Sortable rows and columns', icon: '☰', badge: 'new', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  { label: 'Chart', value: 'chart', description: 'Visualize data and trends', icon: '△', badge: 'popular', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  { label: 'Form', value: 'form', description: 'Input fields and validation', icon: '✎', gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' },
  { label: 'Toast', value: 'toast', description: 'Notifications and alerts', icon: '◉', badge: 'new', gradient: 'linear-gradient(135deg, #f43f5e, #ef4444)' },
  { label: 'Sidebar', value: 'sidebar', description: 'Navigation and panels', icon: '◧', gradient: 'linear-gradient(135deg, #64748b, #475569)' },
  { label: 'Card', value: 'card', description: 'Content containers', icon: '□', badge: 'popular', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
];

// --- Attach to Anything: Action Menu ---

export interface QuickAction {
  label: string;
  value: string;
  icon: string;
  shortcut?: string;
}

export const quickActions: QuickAction[] = [
  { label: 'New Note', value: 'new-note', icon: '📝', shortcut: '⌘N' },
  { label: 'Upload File', value: 'upload', icon: '📎', shortcut: '⌘U' },
  { label: 'Take Photo', value: 'photo', icon: '📷' },
  { label: 'Record Audio', value: 'audio', icon: '🎙️' },
  { label: 'Share Link', value: 'share', icon: '🔗', shortcut: '⌘K' },
  { label: 'New Folder', value: 'folder', icon: '📁' },
];

// --- Attach to Anything: Profile Menu ---

export interface MenuItem {
  label: string;
  value: string;
  icon: string;
  danger?: boolean;
}

export const menuItems: MenuItem[] = [
  { label: 'My Profile', value: 'profile', icon: '👤' },
  { label: 'Settings', value: 'settings', icon: '⚙️' },
  { label: 'Team Members', value: 'team', icon: '👥' },
  { label: 'Billing', value: 'billing', icon: '💳' },
  { label: 'Sign Out', value: 'signout', icon: '🚪', danger: true },
];

// --- Attach to Anything: Mixed Dashboard ---

export interface DashboardItem {
  label: string;
  value: string;
  description: string;
  icon: string;
  type: 'widget' | 'action';
  status?: 'healthy' | 'warning' | 'error';
}

export const dashboardItems: DashboardItem[] = [
  { label: 'Revenue Chart', value: 'revenue', description: 'Monthly revenue trends', icon: '📊', type: 'widget', status: 'healthy' },
  { label: 'User Analytics', value: 'analytics', description: 'Active users & sessions', icon: '👥', type: 'widget', status: 'healthy' },
  { label: 'Error Monitor', value: 'errors', description: 'Exception tracking', icon: '🐛', type: 'widget', status: 'warning' },
  { label: 'Deploy to Prod', value: 'deploy', description: 'Push latest build', icon: '🚀', type: 'action' },
  { label: 'Clear Cache', value: 'cache', description: 'Invalidate CDN cache', icon: '🗑️', type: 'action' },
  { label: 'Run Tests', value: 'tests', description: 'Execute full test suite', icon: '🧪', type: 'action' },
  { label: 'API Health', value: 'api', description: 'Endpoint status board', icon: '🌐', type: 'widget', status: 'error' },
  { label: 'Sync Database', value: 'sync', description: 'Run pending migrations', icon: '🔄', type: 'action' },
];

export const categoryGroups: { label: string; items: CategoryItem[] }[] = [
  {
    label: 'Frontend',
    items: [
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Svelte', value: 'svelte' },
    ],
  },
  {
    label: 'Backend',
    items: [
      { label: 'Node.js', value: 'node' },
      { label: 'Python', value: 'python' },
      { label: 'Go', value: 'go' },
    ],
  },
  {
    label: 'Database',
    items: [
      { label: 'PostgreSQL', value: 'pg' },
      { label: 'MongoDB', value: 'mongo' },
      { label: 'Redis', value: 'redis' },
    ],
  },
];
