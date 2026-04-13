export type Direction = 'L' | 'R' | 'N';

export interface TransitionRule {
  currentState: string;
  readSymbol: string;
  writeSymbol: string;
  direction: Direction;
  nextState: string;
}

export type Tape = Record<number, string>;
