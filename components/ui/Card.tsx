interface Props {
  onClick?: () => void;
  children: preact.ComponentChildren;
}

export default function Card({ children, onClick }: Props) {
  return (
    <div
      class="bg-white p-4 rounded-lg shadow hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
