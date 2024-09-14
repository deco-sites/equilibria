import { Solution } from "../utils/types.tsx";
import { substanceNameParser } from "../utils/helper.tsx";
import AddButton from "./AddButton.tsx";
import { Signal, useSignal } from "@preact/signals";
import SolutionModal from "./SolutionModal.tsx";
import Card from "./Card.tsx";

interface SolutionViewerProps {
  index: number;
  solution: Solution;
}

function SolutionViewer({ index, solution }: SolutionViewerProps) {
  return (
    <Card>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-semibold">Solution {index}</span>
        <span class="text-gray-500 text-sm">{solution.volume} mL</span>
      </div>
      <div class="space-y-1">
        {solution.solutes.map((solute, _) => (
          <div class="flex justify-between">
            <span
              class="font-medium"
              dangerouslySetInnerHTML={{
                __html: substanceNameParser(solute.name),
              }}
            >
            </span>
            <span class="text-gray-500">{solute.concentration} M</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface Props {
  solutions: Signal<Solution[]>;
  solutes: string[];
}

export default function SolutionList({ solutions, solutes }: Props) {
  const isModalOpen = useSignal<boolean>(false);
  const modalSolution = useSignal<Solution>({ volume: 0, solutes: [] });
  const editSolutionIndex = useSignal<number>(-1);

  const setSolution = (solution: Solution | null) => {
    if (solution === null) {
      solutions.value = solutions.value.filter((_, index) =>
        index !== editSolutionIndex.value
      );
    } else {
      if (editSolutionIndex.value === -1) {
        solutions.value = [...solutions.value, solution];
      } else {
        solutions.value = solutions.value.map((s, index) =>
          index === editSolutionIndex.value ? solution : s
        );
      }
    }
  };

  return (
    <div class="w-screen md:w-96 px-2">
      <div class="pl-2 text-2xl font-semibold my-2">
        Solutions
      </div>
      <div class="space-y-4 mb-4">
        {solutions.value.map((solution, index) => (
          <div
            onClick={() => {
              editSolutionIndex.value = index;
              modalSolution.value = solution;
              isModalOpen.value = true;
            }}
          >
            <SolutionViewer index={index + 1} solution={solution} />
          </div>
        ))}
      </div>
      <AddButton
        onClick={() => {
          editSolutionIndex.value = -1;
          modalSolution.value = { volume: 0, solutes: [] };
          isModalOpen.value = true;
        }}
      />
      <SolutionModal
        solution={modalSolution}
        open={isModalOpen.value}
        closeModal={() => {
          isModalOpen.value = false;
        }}
        setSolution={setSolution}
        solutes={solutes}
        editing={editSolutionIndex.value !== -1}
      />
    </div>
  );
}
