export const GAME_TYPES = {
  CHOOSE_YOUR_SIDE: 'choose_your_side',
  CLEAR_THE_BOX: 'clear_the_box',
  PULL_THE_STRING: 'pull_the_string',
} as const;

export type GameType = (typeof GAME_TYPES)[keyof typeof GAME_TYPES];

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  choose_your_side: 'Choose Your Side',
  clear_the_box: 'Clear The Box',
  pull_the_string: 'Pull The String',
};

export const SIDE_TYPES = {
  LEFT: 'kiri',
  RIGHT: 'kanan',
} as const;

export type SideType = (typeof SIDE_TYPES)[keyof typeof SIDE_TYPES];

export const TEAM_TYPES = {
  TEAM_A: 'tim_a',
  TEAM_B: 'tim_b',
} as const;

export type TeamType = (typeof TEAM_TYPES)[keyof typeof TEAM_TYPES];
