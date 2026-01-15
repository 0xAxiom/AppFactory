/// <reference types="expo-router/types" />

declare module '@/constants/theme' {
  export const colors: typeof import('./src/constants/theme').colors;
  export const typography: typeof import('./src/constants/theme').typography;
  export const spacing: typeof import('./src/constants/theme').spacing;
  export const radius: typeof import('./src/constants/theme').radius;
}

declare module '@/types' {
  export * from './src/types';
}

declare module '@/stores/SubscriptionContext' {
  export * from './src/stores/SubscriptionContext';
}

declare module '@/services/storage' {
  export * from './src/services/storage';
}

declare module '@/ui/icons' {
  export * from './src/ui/icons';
}
