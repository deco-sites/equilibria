import { Reaction, State } from "./types.tsx";

export function substanceNameParser(name: string, state: State = "solute") {
  const regex = /([\^\_])(\{([0-9+\-a-zA-Z\(\)]*)\}|([0-9+\-a-zA-Z\(\)]))/gm;
  let parsed = name;
  while (true) {
    const result = regex.exec(parsed);
    if (!result) break;
    const match = result[0];
    const value = result[3] || result[4];
    const scriptType = result[1] === "^" ? "sup" : "sub";
    parsed = parsed.replace(match, `<${scriptType}>${value}</${scriptType}>`);
  }
  if (state === "solid") parsed += "<sub>(s)</sub>";
  if (state === "liquid") parsed += "<sub>(l)</sub>";
  return parsed;
}

export function isSameSubstance(a: string, b: string): boolean {
  return substanceNameParser(a) === substanceNameParser(b);
}

export function formatNumber(value: number): string {
  const formattedNumber = value.toPrecision(3);
  if (formattedNumber === "0.00") return "0";
  if (Math.abs(value) < 1e-2 || Math.abs(value) >= 1e2) {
    return value.toExponential(2);
  }
  return formattedNumber;
}

interface SubstanceName {
  name: string;
  parsedName: string;
}

export function substances(reactions: Reaction[]): [string[], string[]] {
  const solutes: SubstanceName[] = [];
  const solids: SubstanceName[] = [];
  for (const reaction of reactions) {
    const substances = [...reaction.reagents, ...reaction.products];
    for (const substance of substances) {
      if (substance.state === "solute") {
        solutes.push({
          name: substance.name,
          parsedName: substanceNameParser(substance.name, substance.state),
        });
      } else if (substance.state === "solid") {
        solids.push({
          name: substance.name,
          parsedName: substanceNameParser(substance.name, substance.state),
        });
      }
    }
  }
  return [
    solutes.filter((solute, index, self) =>
      self.findIndex((s) => s.parsedName === solute.parsedName) === index
    ).map((s) => s.name),
    solids.filter((solid, index, self) =>
      self.findIndex((s) => s.parsedName === solid.parsedName) === index
    ).map((s) => s.name),
  ];
}
