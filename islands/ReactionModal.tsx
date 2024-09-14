import { Reaction } from "../utils/types.tsx";
import databaseReactions from "../utils/database.tsx";
import ReactionViewer from "./ReactionViewer.tsx";
import Modal from "./Modal.tsx";
import { Signal } from "@preact/signals";

interface Props {
  open: boolean;
  isCustom: Signal<boolean>;
  closeModal: () => void;
  reaction: Signal<Reaction>;
  editing: boolean;
  setReaction: (reaction: Reaction | null) => void;
  constant: Signal<string>;
}

export default function ReactionModal(
  { open, closeModal, setReaction, isCustom, reaction, editing, constant }:
    Props,
) {
  return (
    <Modal
      title={isCustom.value ? "Edit Reaction" : "Select Reaction"}
      open={open}
      closeModal={closeModal}
    >
      {isCustom.value
        ? (
          <CustomReactionEditor
            reaction={reaction}
            editing={editing}
            setReaction={(r) => {
              setReaction(r);
              closeModal();
            }}
            constant={constant}
          />
        )
        : (
          <div>
            <div class="flex justify-center items-center space-x-2 py-2 mb-2">
              <div class="relative max-w-xs">
                <input
                  type="text"
                  placeholder="Search..."
                  class="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.415-1.415L21 21z"
                  />
                </svg>
              </div>
              <button
                class="w-52 px-5 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 font-medium"
                onClick={() => {
                  isCustom.value = true;
                }}
              >
                Create Custom
              </button>
            </div>
            <div class="space-y-4 mb-4 h-64 overflow-y-scroll">
              {databaseReactions.map((r, _) => (
                <div
                  onClick={() => {
                    setReaction(r);
                    closeModal();
                  }}
                >
                  <ReactionViewer reaction={r} />
                </div>
              ))}
            </div>
          </div>
        )}
    </Modal>
  );
}

interface CustomReactionEditorProps {
  reaction: Signal<Reaction>;
  editing: boolean;
  setReaction: (reaction: Reaction | null) => void;
  constant: Signal<string>;
}

function CustomReactionEditor(
  { reaction, setReaction, editing, constant }: CustomReactionEditorProps,
) {
  return (
    <div>
      <ReactionViewer reactionSignal={reaction} />

      <h3 class="font-semibold text-lg mb-2">Create Custom Reaction</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Reaction Constant
        </label>
        <input
          value={constant.value}
          type="number"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter reaction constant"
          autocomplete="off"
          onInput={(e) => {
            constant.value = (e.currentTarget as HTMLInputElement).value;
            const number = parseFloat(constant.value);
            if (isNaN(number)) return;
            reaction.value = { ...reaction.value, constant: number };
          }}
        />
      </div>

      <div class="mt-4">
        <h4 class="font-semibold">Reagents</h4>
        {reaction.value.reagents.map((reagent, index) => (
          <div class="space-y-4 mt-2">
            <div class="flex items-center space-x-4">
              <input
                autocomplete="off"
                type="text"
                class="block w-1/2 p-2 border border-gray-300 rounded-md"
                placeholder="Name"
                value={reagent.name}
                onInput={(e) => {
                  reaction.value = {
                    ...reaction.value,
                    reagents: reaction.value.reagents.map((r, i) =>
                      i === index
                        ? { ...r, name: (e.target as HTMLInputElement).value }
                        : r
                    ),
                  };
                }}
              />
              <input
                autocomplete="off"
                type="number"
                class="block w-1/4 p-2 border border-gray-300 rounded-md"
                placeholder="Amount"
                value={reagent.amount}
                onInput={(e) => {
                  const number = parseFloat(
                    (e.currentTarget as HTMLInputElement).value,
                  );
                  if (isNaN(number)) return;
                  reaction.value = {
                    ...reaction.value,
                    reagents: reaction.value.reagents.map((r, i) =>
                      i === index ? { ...r, amount: number } : r
                    ),
                  };
                }}
              />
              <select
                class="block w-1/4 p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  reaction.value = {
                    ...reaction.value,
                    reagents: reaction.value.reagents.map((r, i) =>
                      i === index
                        ? {
                          ...r,
                          state: (e.target as HTMLSelectElement).value as
                            | "solute"
                            | "liquid"
                            | "solid",
                        }
                        : r
                    ),
                  };
                }}
              >
                <option value="solute" selected={reagent.state === "solute"}>
                  Solute
                </option>
                <option value="liquid" selected={reagent.state === "liquid"}>
                  Liquid
                </option>
                <option value="solid" selected={reagent.state === "solid"}>
                  Solid
                </option>
              </select>
              <button
                class="text-red-500 hover:text-red-700"
                onClick={() => {
                  reaction.value = {
                    ...reaction.value,
                    reagents: reaction.value.reagents.filter((_, i) =>
                      i !== index
                    ),
                  };
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <button
          class="mt-4 flex items-center text-blue-500 hover:text-blue-700"
          onClick={() => {
            reaction.value = {
              ...reaction.value,
              reagents: [...reaction.value.reagents, {
                name: "",
                amount: 1,
                state: "solute",
              }],
            };
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Reagent
        </button>
      </div>

      <div class="mt-4">
        <h4 class="font-semibold">Products</h4>
        {reaction.value.products.map((product, index) => (
          <div class="space-y-4 mt-2">
            <div class="flex items-center space-x-4">
              <input
                type="text"
                class="block w-1/2 p-2 border border-gray-300 rounded-md"
                placeholder="Name"
                value={product.name}
                onInput={(e) => {
                  reaction.value = {
                    ...reaction.value,
                    products: reaction.value.products.map((r, i) =>
                      i === index
                        ? { ...r, name: (e.target as HTMLInputElement).value }
                        : r
                    ),
                  };
                }}
              />
              <input
                type="number"
                class="block w-1/4 p-2 border border-gray-300 rounded-md"
                placeholder="Amount"
                value={product.amount}
                onInput={(e) => {
                  const number = parseFloat(
                    (e.currentTarget as HTMLInputElement).value,
                  );
                  if (isNaN(number)) return;
                  reaction.value = {
                    ...reaction.value,
                    products: reaction.value.products.map((r, i) =>
                      i === index ? { ...r, amount: number } : r
                    ),
                  };
                }}
              />
              <select
                class="block w-1/4 p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  reaction.value = {
                    ...reaction.value,
                    products: reaction.value.products.map((r, i) =>
                      i === index
                        ? {
                          ...r,
                          state: (e.target as HTMLSelectElement).value as
                            | "solute"
                            | "liquid"
                            | "solid",
                        }
                        : r
                    ),
                  };
                }}
              >
                <option value="solute" selected={product.state === "solute"}>
                  Solute
                </option>
                <option value="liquid" selected={product.state === "liquid"}>
                  Liquid
                </option>
                <option value="solid" selected={product.state === "solid"}>
                  Solid
                </option>
              </select>
              <button
                class="text-red-500 hover:text-red-700"
                onClick={() => {
                  reaction.value = {
                    ...reaction.value,
                    products: reaction.value.products.filter((_, i) =>
                      i !== index
                    ),
                  };
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <button
          class="mt-4 flex items-center text-blue-500 hover:text-blue-700"
          onClick={() => {
            reaction.value = {
              ...reaction.value,
              products: [...reaction.value.products, {
                name: "",
                amount: 1,
                state: "solute",
              }],
            };
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </button>
      </div>

      <div class="mt-6 flex justify-end space-x-4">
        {editing && (
          <button
            class="px-5 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 font-medium"
            onClick={() => setReaction(null)}
          >
            Delete
          </button>
        )}
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          onClick={() => setReaction(reaction.value)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
