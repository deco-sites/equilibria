import { Reaction, Solid, Solution, Substance } from "./types.tsx";

export type Concentrations = Record<string, number>; // mol/L
export type Masses = Record<string, number>; // g
type MolarMasses = Record<string, number>; // g/mol

export function find_equilibrium(
  solutions: Solution[],
  solids: Solid[],
  reactions: Reaction[],
): [Concentrations, Masses] {
  const concentrations: Concentrations = {};
  const masses: Masses = {};
  const molarMasses: MolarMasses = {};
  const volume = solutions.reduce((acc, solution) => acc + solution.volume, 0);

  for (const solution of solutions) {
    for (const solute of solution.solutes) {
      concentrations[solute.name] = solute.concentration * solution.volume /
        volume;
    }
  }
  for (const solid of solids) {
    masses[solid.name] = solid.mass;
    molarMasses[solid.name] = solid.molarMass;
  }

  for (const reaction of reactions) {
    const substances = [...reaction.reagents, ...reaction.products];
    for (const substance of substances) {
      if (!concentrations[substance.name] && substance.state === "solute") {
        concentrations[substance.name] = 0;
      } else if (!masses[substance.name] && substance.state === "solid") {
        masses[substance.name] = 0;
      }
    }
  }

  const all_reactions = [...reactions];
  for (let i = 0; i < reactions.length; i++) {
    for (let j = 0; j < reactions.length; j++) {
      if (i === j) continue;
      if (j > i) {
        const combined1 = combine_reactions(reactions[i], reactions[j]);
        all_reactions.push(...combined1);
      }
      const combined2 = combine_reactions(
        reactions[i],
        invert_reaction(reactions[j]),
      );
      all_reactions.push(...combined2);
      const combined3 = combine_reactions(
        invert_reaction(reactions[i]),
        reactions[j],
      );
      all_reactions.push(...combined3);
      const combined4 = combine_reactions(
        invert_reaction(reactions[i]),
        invert_reaction(reactions[j]),
      );
      all_reactions.push(...combined4);
    }
  }

  const reactions_already_applied: Record<number, boolean> = {};

  for (let i = 0; i < 2000; i++) {
    /*
        let mx_delta = 0, reaction_index = -1;
        for (let j = 0; j < all_reactions.length; j++) {
            const reaction = all_reactions[j];
            const delta = find_equilibrium_for_reaction(
                concentrations,
                masses,
                molarMasses,
                volume,
                reaction,
            );
            if (Math.abs(delta) > Math.abs(mx_delta)) {
                reaction_index = j;
                mx_delta = Math.abs(delta);
            }
        }
        if (reaction_index === -1) {
            break;
        }
        const reaction = all_reactions[reaction_index];
        reactions_already_applied[reaction_index] = true;
        const delta = find_equilibrium_for_reaction(
            concentrations,
            masses,
            molarMasses,
            volume,
            reaction,
        );
        apply_delta(concentrations, masses, molarMasses, volume, delta, reaction);
        */
    for (const reaction of all_reactions) {
      const q = find_equilibrium_for_reaction(
        concentrations,
        masses,
        molarMasses,
        volume,
        reaction,
      );
      apply_delta(concentrations, masses, molarMasses, volume, q, reaction);
    }
  }

  return [concentrations, masses];
}

function find_equilibrium_for_reaction(
  concentrations: Concentrations,
  masses: Masses,
  molarMasses: MolarMasses,
  volume: number,
  reaction: Reaction,
): number {
  let mn = -1000, mx = 1000;
  for (const reagent of reaction.reagents) {
    let q: number;
    if (reagent.state === "solute") {
      q = concentrations[reagent.name] / reagent.amount;
    } else if (reagent.state === "solid") {
      q = volume === 0
        ? 0
        : masses[reagent.name] / molarMasses[reagent.name] / (volume / 1000.0) /
          reagent.amount;
    } else {
      continue;
    }
    mx = Math.min(mx, q);
  }
  for (const product of reaction.products) {
    let q: number;
    if (product.state === "solute") {
      q = concentrations[product.name] / product.amount;
    } else if (product.state === "solid") {
      q = volume === 0
        ? 0
        : masses[product.name] / molarMasses[product.name] / (volume / 1000.0) /
          product.amount;
    } else {
      continue;
    }
    mn = Math.max(mn, -q);
  }
  if (mx < mn) {
    return 0;
  }
  for (let i = 0; i < 100; i++) {
    const q = (mn + mx) / 2;
    const new_concentrations = { ...concentrations };
    const new_masses = { ...masses };
    apply_delta(
      new_concentrations,
      new_masses,
      molarMasses,
      volume,
      q,
      reaction,
    );
    if (evaluate_q(new_concentrations, reaction) > reaction.constant) {
      mx = q;
    } else {
      mn = q;
    }
  }
  return mn;
}

function apply_delta(
  concentrations: Concentrations,
  masses: Masses,
  molarMasses: MolarMasses,
  volume: number,
  q: number,
  reaction: Reaction,
) {
  for (const reagent of reaction.reagents) {
    if (reagent.state === "solute") {
      concentrations[reagent.name] -= q * reagent.amount;
    } else if (reagent.state === "solid") {
      masses[reagent.name] -= q * (volume / 1000.0) *
        molarMasses[reagent.name] * reagent.amount;
    }
  }
  for (const product of reaction.products) {
    if (product.state === "solute") {
      concentrations[product.name] += q * product.amount;
    } else if (product.state === "solid") {
      masses[product.name] += q * (volume / 1000.0) *
        molarMasses[product.name] * product.amount;
    }
  }
}

function evaluate_q(
  concentrations: Concentrations,
  reaction: Reaction,
): number {
  let result = 1;
  for (const product of reaction.products) {
    if (product.state !== "solute") continue;
    result *= Math.pow(concentrations[product.name], product.amount);
  }
  for (const reagent of reaction.reagents) {
    if (reagent.state !== "solute") continue;
    result /= Math.pow(concentrations[reagent.name], reagent.amount);
  }
  return result;
}

function gcd(a: number, b: number) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

function invert_reaction(reaction: Reaction): Reaction {
  return {
    reagents: reaction.products,
    products: reaction.reagents,
    constant: 1 / reaction.constant,
  };
}

function combine_reactions(r1: Reaction, r2: Reaction): Reaction[] {
  const reactions: Reaction[] = [];
  for (const reagent of r1.reagents) {
    const product = r2.products.find((p) => p.name === reagent.name);
    if (product) {
      const g = gcd(reagent.amount, product.amount);
      const q1 = product.amount / g;
      const q2 = reagent.amount / g;
      const reagents: Substance[] = [];
      for (const r of r1.reagents) {
        if (r.name !== reagent.name) {
          reagents.push({
            name: r.name,
            amount: r.amount * q1,
            state: r.state,
          });
        }
      }
      for (const r of r2.reagents) {
        if (r.name !== reagent.name) {
          reagents.push({
            name: r.name,
            amount: r.amount * q2,
            state: r.state,
          });
        }
      }
      const products: Substance[] = [];
      for (const p of r1.products) {
        if (p.name !== reagent.name) {
          products.push({
            name: p.name,
            amount: p.amount * q1,
            state: p.state,
          });
        }
      }
      for (const p of r2.products) {
        if (p.name !== reagent.name) {
          products.push({
            name: p.name,
            amount: p.amount * q2,
            state: p.state,
          });
        }
      }
      reactions.push({
        reagents,
        products,
        constant: Math.pow(r1.constant, q1) * Math.pow(r2.constant, q2),
      });
    }
  }
  return reactions;
}
