import { substanceNameParser } from "../utils/helper.tsx";
import { Solution } from "../utils/types.tsx";
import { Signal } from "@preact/signals";
import Modal from "./Modal.tsx";

interface Props {
  open: boolean;
  closeModal: () => void;
  solution: Signal<Solution>;
  setSolution: (solution: Solution | null) => void;
  solutes: string[];
  editing: boolean;
}

export default function SolutionModal(
  { solutes, solution, open, closeModal, setSolution, editing }: Props,
) {
  const handleSoluteToggle = (name: string, checked: boolean) => {
    if (checked) {
      solution.value = {
        ...solution.value,
        solutes: [...solution.value.solutes, { name, concentration: 0 }],
      };
    } else {
      solution.value = {
        ...solution.value,
        solutes: solution.value.solutes.filter((solute) =>
          solute.name !== name
        ),
      };
    }
  };

  const handleConcentrationChange = (name: string, concentration: number) => {
    solution.value = {
      ...solution.value,
      solutes: solution.value.solutes.map((solute) =>
        solute.name === name ? { name, concentration } : solute
      ),
    };
  };

  const handleVolumeChange = (e: Event) => {
    solution.value = {
      ...solution.value,
      volume: parseFloat((e.target as HTMLInputElement).value),
    };
  };

  const saveSolution = () => {
    setSolution(solution.value);
    closeModal();
  };

  const deleteSolution = () => {
    setSolution(null);
    closeModal();
  };

  return (
    <Modal
      title={editing ? "Edit Solution" : "Create Solution"}
      open={open}
      closeModal={closeModal}
    >
      <div class="mb-6">
        <label
          class="block text-gray-700 font-medium mb-2"
          for="solutionVolume"
        >
          Solution Volume (mL)
        </label>
        <input
          type="number"
          id="solutionVolume"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter volume"
          onChange={handleVolumeChange}
          value={solution.value.volume === 0 ? "" : solution.value.volume}
        />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 font-medium mb-2">
          Select Solutes:
        </label>
        <div class="space-y-3 h-64 overflow-y-scroll">
          {solutes.map((name, index) => (
            <div
              key={index}
              class="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm"
            >
              <input
                type="checkbox"
                id={`solute-${index}`}
                class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) =>
                  handleSoluteToggle(name, e.currentTarget.checked)}
                checked={solution.value.solutes.some((solute) =>
                  solute.name === name
                )}
              />
              <label
                for={`solute-${index}`}
                class="text-gray-800 font-medium w-1/4 ml-3"
                dangerouslySetInnerHTML={{ __html: substanceNameParser(name) }}
              />
              <input
                type="number"
                class="ml-auto w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Molarity (M)"
                onChange={(e) =>
                  handleConcentrationChange(
                    name,
                    parseFloat(e.currentTarget.value),
                  )}
                disabled={!solution.value.solutes.some((solute) =>
                  solute.name === name
                )}
                value={solution.value.solutes.find((solute) =>
                  solute.name === name
                )?.concentration || ""}
              />
            </div>
          ))}
        </div>
      </div>
      <div class="flex justify-end space-x-4">
        {editing && (
          <button
            class="px-5 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 font-medium"
            onClick={deleteSolution}
          >
            Delete
          </button>
        )}
        <button
          class="px-5 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 font-medium"
          onClick={saveSolution}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
