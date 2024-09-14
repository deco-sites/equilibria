import Modal from "./Modal.tsx";
import { Solid } from "../utils/types.tsx";
import { Signal } from "@preact/signals";
import { substanceNameParser } from "../utils/helper.tsx";

interface Props {
  open: boolean;
  closeModal: () => void;
  solid: Signal<Solid>;
  updateSolid: (solid: Solid) => void;
}

export default function SolidModal(
  { solid, updateSolid, open, closeModal }: Props,
) {
  return (
    <Modal title="Edit Solid" open={open} closeModal={closeModal}>
      <div class="mb-4">
        <label
          class="block text-gray-700 font-medium mb-1"
          for="substance-name"
        >
          Substance Name
        </label>
        <div
          class="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500"
          disabled
          dangerouslySetInnerHTML={{
            __html: substanceNameParser(solid.value.name, "solid"),
          }}
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1" for="mass">
          Mass (g)
        </label>
        <input
          value={solid.value.mass}
          type="number"
          id="mass"
          placeholder="Enter mass"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          onChange={(e) => {
            solid.value = {
              ...solid.value,
              mass: parseFloat((e.target as HTMLInputElement).value),
            };
          }}
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1" for="molar-mass">
          Molar Mass (g/mol)
        </label>
        <input
          value={solid.value.molarMass}
          type="number"
          id="molar-mass"
          placeholder="Enter molar mass"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          onChange={(e) => {
            solid.value = {
              ...solid.value,
              molarMass: parseFloat((e.target as HTMLInputElement).value),
            };
          }}
        />
      </div>

      <div class="flex justify-end mt-6">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => {
            updateSolid(solid.value);
            closeModal();
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
