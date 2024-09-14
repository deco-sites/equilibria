import { Reaction } from "./types.tsx";

const reactions: Reaction[] = [
  {
    reagents: [{
      name: "H_3PO_4",
      amount: 1,
      state: "solute",
    }],
    products: [{
      name: "H_2PO_4^-",
      amount: 1,
      state: "solute",
    }, {
      name: "H^+",
      amount: 1,
      state: "solute",
    }],
    constant: 7.6e-3,
  },
  {
    reagents: [{
      name: "H_2PO_4^-",
      amount: 1,
      state: "solute",
    }],
    products: [{
      name: "HPO_4^{2-}",
      amount: 1,
      state: "solute",
    }, {
      name: "H^+",
      amount: 1,
      state: "solute",
    }],
    constant: 6.2e-8,
  },
  {
    reagents: [{
      name: "HPO_4^{2-}",
      amount: 1,
      state: "solute",
    }],
    products: [{
      name: "PO_4^{3-}",
      amount: 1,
      state: "solute",
    }, {
      name: "H^+",
      amount: 1,
      state: "solute",
    }],
    constant: 2.1e-13,
  },
  {
    reagents: [{
      name: "NH_4^+",
      amount: 1,
      state: "solute",
    }],
    products: [{
      name: "NH_3",
      amount: 1,
      state: "solute",
    }, {
      name: "H^+",
      amount: 1,
      state: "solute",
    }],
    constant: 5.75e-10,
  },
  {
    reagents: [{
      name: "AgCl",
      amount: 1,
      state: "solid",
    }],
    products: [{
      name: "Ag^+",
      amount: 1,
      state: "solute",
    }, {
      name: "Cl^-",
      amount: 1,
      state: "solute",
    }],
    constant: 1.8e-10,
  },
  {
    reagents: [{
      name: "Ca_3(PO_4)_2",
      amount: 1,
      state: "solid",
    }],
    products: [{
      name: "Ca^{2+}",
      amount: 3,
      state: "solute",
    }, {
      name: "PO_4^{3-}",
      amount: 2,
      state: "solute",
    }],
    constant: 2.22e-25,
  },
  {
    reagents: [{
      name: "NH_4MgPO_4",
      amount: 1,
      state: "solid",
    }],
    products: [{
      name: "Mg^{2+}",
      amount: 1,
      state: "solute",
    }, {
      name: "PO_4^{3-}",
      amount: 1,
      state: "solute",
    }, {
      name: "NH_4^+",
      amount: 1,
      state: "solute",
    }],
    constant: 2.5e-13,
  },
  {
    reagents: [{
      name: "Ag^+",
      amount: 1,
      state: "solute",
    }, {
      name: "NH_3",
      amount: 2,
      state: "solute",
    }],
    products: [{
      name: "Ag(NH_3)_2^+",
      amount: 1,
      state: "solute",
    }],
    constant: 1e8,
  },
  {
    reagents: [{
      name: "H_2O",
      amount: 1,
      state: "liquid",
    }],
    products: [{
      name: "H^+",
      amount: 1,
      state: "solute",
    }, {
      name: "OH^-",
      amount: 1,
      state: "solute",
    }],
    constant: 1e-14,
  },
];

export default reactions;
