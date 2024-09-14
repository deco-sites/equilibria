import { useSignal } from "@preact/signals";
import ReactionList from "./ReactionList.tsx";
import InitialState from "./InitialState.tsx";
import EndState from "./EndState.tsx";
import { Reaction, Solid, Solution } from "../utils/types.tsx";
import { substances } from "../utils/helper.tsx";
import { useEffect } from "preact/hooks";
import { Concentrations, find_equilibrium, Masses } from "../utils/solver.tsx";

export default function EquilibriumSolver() {
  const reactions = useSignal<Reaction[]>([]);
  const solutes = useSignal<string[]>([]);
  const solutions = useSignal<Solution[]>([]);
  const solids = useSignal<Solid[]>([]);
  const concentrations = useSignal<Concentrations>({});
  const masses = useSignal<Masses>({});
  const equilibriumIsOutdated = useSignal<boolean>(true);

  useEffect(() => {
    const [solutesNames, solidNames] = substances(reactions.value);
    solutes.value = solutesNames;
    solids.value = solidNames.map((solid) => {
      const current = solids.value.find((s) => s.name === solid);
      if (current) return current;
      return {
        name: solid,
        mass: 0,
        molarMass: 1,
      };
    });
  }, [reactions.value]);

  useEffect(() => {
    equilibriumIsOutdated.value = true;
  }, [reactions.value, solutions.value, solids.value]);

  return (
    <div class="flex flex-wrap">
      <ReactionList
        reactions={reactions}
      />
      <InitialState
        solutions={solutions}
        solutes={solutes.value}
        solids={solids}
      />
      {equilibriumIsOutdated.value
        ? (
          <div class="w-screen md:w-96 px-2 my-2">
            <button
              class="w-full px-5 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 font-medium"
              onClick={() => {
                const [c, m] = find_equilibrium(
                  solutions.value,
                  solids.value,
                  reactions.value,
                );
                concentrations.value = c;
                masses.value = m;
                equilibriumIsOutdated.value = false;
              }}
            >
              Solve
            </button>
          </div>
        )
        : <EndState concentrations={concentrations} masses={masses} />}
    </div>
  );
}
