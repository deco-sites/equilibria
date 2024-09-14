interface Props {
  onClick?: () => void;
}

export default function AddButton({ onClick }: Props) {
  return (
    <button
      class="w-full py-2 bg-gray-300 rounded-lg text-lg font-semibold text-gray-600 hover:bg-gray-400"
      onClick={onClick}
    >
      +
    </button>
  );
}
