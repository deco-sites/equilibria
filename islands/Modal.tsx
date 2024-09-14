interface Props {
  title: string;
  open: boolean;
  closeModal: () => void;
  children: preact.ComponentChildren;
}

export default function Modal({ title, open, closeModal, children }: Props) {
  return (
    <div
      className={`px-2 fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 ${
        open ? "" : "hidden"
      }`}
    >
      <div class="bg-gray-200 w-full max-w-lg p-6 rounded-xl shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-800">{title}</h3>
          <button
            class="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
