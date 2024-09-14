import { formatNumber, substanceNameParser } from "../utils/helper.tsx";
import { Concentrations, Masses } from "../utils/solver.tsx";
import Card from "./Card.tsx";
import { Signal, useSignal } from "@preact/signals";

interface Props {
  concentrations: Signal<Concentrations>;
  masses: Signal<Masses>;
}

function SoluteCard(
  { solute, concentration }: { solute: string; concentration: number },
) {
  const showLogarithm = useSignal<boolean>(false);
  return (
    <Card
      onClick={() => {
        showLogarithm.value = !showLogarithm.value;
      }}
    >
      <div class="flex justify-between">
        <div
          class="text-lg font-semibold text-gray-700"
          dangerouslySetInnerHTML={{
            __html: `${showLogarithm.value ? "p" : ""}[${
              substanceNameParser(solute)
            }]`,
          }}
        />
        <div class="text-lg text-gray-500">
          {showLogarithm.value
            ? formatNumber(-Math.log10(concentration))
            : formatNumber(concentration)}
          {showLogarithm.value ? "" : " M"}
        </div>
      </div>
    </Card>
  );
}

export default function EndState({ concentrations, masses }: Props) {
  return (
    <div class="w-screen md:w-96 px-2">
      <div class="pl-2 text-2xl font-semibold my-2">
        Solutes
      </div>
      <div class="space-y-4 mb-4">
        {Object.entries(concentrations.value).map(([solute, concentration]) => (
          <SoluteCard solute={solute} concentration={concentration} />
        ))}
      </div>
      <div class="pl-2 text-2xl font-semibold my-2">
        Solids
      </div>
      <div class="space-y-4 mb-4">
        {Object.entries(masses.value).map(([solid, mass]) => (
          <Card>
            <div class="flex justify-between">
              <div
                class="text-lg font-semibold text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: substanceNameParser(solid, "solid"),
                }}
              />
              <div class="text-lg text-gray-500">{formatNumber(mass)} g</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
