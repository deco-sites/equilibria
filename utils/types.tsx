export type State = "solid" | "liquid" | "solute";

export interface Substance {
  name: string;
  amount: number;
  state: State;
}

export interface Reaction {
  reagents: Substance[];
  products: Substance[];
  constant: number;
}

export interface Solute {
  name: string;
  concentration: number; // mol/L
}

export interface Solution {
  volume: number; // mL
  solutes: Solute[];
}

export interface Solid {
  name: string;
  mass: number; // g
  molarMass: number; // g/mol
}
