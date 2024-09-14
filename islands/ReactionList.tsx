import ReactionModal from "../islands/ReactionModal.tsx";
import { Reaction } from "../utils/types.tsx";
import AddButton from "./AddButton.tsx";
import ReactionViewer from "./ReactionViewer.tsx";
import { Signal, useSignal } from "@preact/signals";

export interface Props {
  reactions: Signal<Reaction[]>;
}

export default function ReactionList(
  { reactions }: Props,
) {
  const isReactionModalOpen = useSignal<boolean>(false);
  const modalReaction = useSignal<Reaction>({
    reagents: [],
    products: [],
    constant: 0,
  });
  const editReactionIndex = useSignal<number>(-1);
  const isCustomReaction = useSignal<boolean>(false);
  const rawConstantInput = useSignal<string>("");

  const setReaction = (reaction: Reaction | null) => {
    if (editReactionIndex.value === -1) {
      if (reaction === null) return;
      reactions.value = [...reactions.value, reaction];
    } else if (reaction === null) {
      reactions.value = reactions.value.filter((_, index) =>
        index !== editReactionIndex.value
      );
    } else {
      reactions.value = reactions.value.map((r, index) =>
        index === editReactionIndex.value ? reaction : r
      );
    }
  };

  return (
    <div class="w-screen md:w-96 px-2">
      <div class="pl-2 text-2xl font-semibold my-2">
        Reactions
      </div>
      <div class="space-y-4 mb-4">
        {reactions.value.map((reaction, index) => (
          <div
            onClick={() => {
              modalReaction.value = reaction;
              editReactionIndex.value = index;
              isCustomReaction.value = true;
              isReactionModalOpen.value = true;
              rawConstantInput.value = reaction.constant.toString();
            }}
          >
            <ReactionViewer reaction={reaction} />
          </div>
        ))}
      </div>
      <AddButton
        onClick={() => {
          modalReaction.value = { reagents: [], products: [], constant: 0 };
          isCustomReaction.value = false;
          editReactionIndex.value = -1;
          isReactionModalOpen.value = true;
          rawConstantInput.value = "";
        }}
      />
      <ReactionModal
        isCustom={isCustomReaction}
        reaction={modalReaction}
        setReaction={setReaction}
        open={isReactionModalOpen.value}
        closeModal={() => {
          isReactionModalOpen.value = false;
        }}
        editing={editReactionIndex.value !== -1}
        constant={rawConstantInput}
      />
    </div>
  );
}
