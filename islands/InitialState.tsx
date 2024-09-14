import SolidList from "./SolidList.tsx";
import SolutionList from "./SolutionList.tsx";
import { Solid, Solution } from "../utils/types.tsx";
import { Signal } from "@preact/signals";

interface Props {
  solutions: Signal<Solution[]>;
  solids: Signal<Solid[]>;
  solutes: string[];
}

export default function InitialState({ solutes, solutions, solids }: Props) {
  return (
    <div>
      <SolutionList solutions={solutions} solutes={solutes} />
      <SolidList solids={solids} />
    </div>
  );
}
