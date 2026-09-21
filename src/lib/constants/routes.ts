export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  JOIN: '/join',
  DASHBOARD: '/dashboard',
  GAMES: '/games',
  GAMES_NEW: '/games/new',
  GAME_DETAIL: (id: string) => `/games/${id}`,
  GAME_EDIT: (id: string) => `/games/${id}/edit`,
  GAME_STATISTICS: (id: string) => `/games/${id}/statistics`,
  PLAY: (sessionId: string) => `/play/${sessionId}`,
  TEAM: (sessionId: string) => `/team/${sessionId}`,
} as const;
