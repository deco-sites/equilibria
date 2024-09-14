import { Solid } from "../utils/types.tsx";
import { substanceNameParser } from "../utils/helper.tsx";
import { Signal, useSignal } from "@preact/signals";
import Card from "./Card.tsx";
import SolidModal from "./SolidModal.tsx";

interface Props {
  solids: Signal<Solid[]>;
}

export default function SolidList({ solids }: Props) {
  const isModalOpen = useSignal<boolean>(false);
  const modalSolid = useSignal<Solid>({ name: "", mass: 0, molarMass: 0 });
  const editSolidIndex = useSignal<number>(-1);

  const updateSolid = (solid: Solid) => {
    solids.value = solids.value.map((s, index) =>
      index === editSolidIndex.value ? solid : s
    );
  };

  return (
    <div
      className={`w-screen md:w-96 px-2 ${
        solids.value.length === 0 ? "hidden" : ""
      }`}
    >
      <div class="pl-2 text-2xl font-semibold my-2">
        Solids
      </div>
      <div class="space-y-4 mb-4">
        {solids.value.map((solid, index) => (
          <Card
            onClick={() => {
              modalSolid.value = solid;
              editSolidIndex.value = index;
              isModalOpen.value = true;
            }}
          >
            <div
              class="font-semibold text-gray-700 text-lg mb-2"
              dangerouslySetInnerHTML={{
                __html: substanceNameParser(solid.name, "solid"),
              }}
            />
            <div class="flex justify-between text-gray-600">
              <div class="text-sm">Mass</div>
              <div class="text-sm">{solid.mass} g</div>
            </div>
            <div class="flex justify-between text-gray-600">
              <div class="text-sm">Molar Mass</div>
              <div class="text-sm">{solid.molarMass} g/mol</div>
            </div>
          </Card>
        ))}
      </div>
      <SolidModal
        solid={modalSolid}
        updateSolid={updateSolid}
        open={isModalOpen.value}
        closeModal={() => {
          isModalOpen.value = false;
        }}
      />
    </div>
  );
}
