export interface WordGroup {
  words: string[];
  points: 3 | 5 | 7;
}

export interface Card {
  id: number;
  groups: WordGroup[];
}

export interface CheckedState {
  [key: string]: boolean;
}
