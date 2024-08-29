interface Substance {
  name: string;
  amount: number;
  state: "solid" | "liquid" | "solute";
}

interface Reaction {
  reagents: Substance[];
  products: Substance[];
  constant: number;
}

interface Props {
  reactions: Reaction[];
}

const example: Reaction = {
  reagents: [{ name: "AgCl", amount: 1, state: "solid" }],
  products: [{ name: "Ag+", amount: 1, state: "solute" }, { name: "Cl-", amount: 1, state: "solute" }],
  constant: 1.8e-10,
};

export default function Section({ reactions = [example] }: Props) {
  console.log(reactions)
  return (
    <div>
      {reactions.forEach(reaction => {
        return (<div>{reaction.constant}</div>);
      })}
    </div>
  );
}