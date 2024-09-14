import { Reaction } from "../utils/types.tsx";
import { formatNumber, substanceNameParser } from "../utils/helper.tsx";
import Card from "./Card.tsx";
import { Signal } from "@preact/signals";

interface Props {
  reaction?: Reaction;
  reactionSignal?: Signal<Reaction>;
}

export default function ReactionViewer({ reaction, reactionSignal }: Props) {
  const { reagents, products, constant } = reaction ?? reactionSignal?.value ??
    { reagents: [], products: [], constant: 0 };
  let r = "";
  for (const reagent of reagents) {
    r += `${reagent.amount == 1 ? "" : reagent.amount}${
      substanceNameParser(reagent.name, reagent.state)
    } + `;
  }
  r = r.slice(0, -3) + " ⇋ ";
  for (const product of products) {
    r += `${product.amount == 1 ? "" : product.amount}${
      substanceNameParser(product.name, product.state)
    } + `;
  }
  r = r.slice(0, -3);
  return (
    <Card>
      <div
        class="text-lg font-semibold text-gray-700"
        dangerouslySetInnerHTML={{ __html: r }}
      />
      <div class="text-sm text-gray-600">{formatNumber(constant)}</div>
    </Card>
  );
}
