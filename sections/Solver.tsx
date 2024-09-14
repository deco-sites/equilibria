import EquilibriumSolver from "../islands/EquilibriumSolver.tsx"

export default function Solver() {
  return (
    <div>
      <div class="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 p-4 shadow-lg flex justify-center items-center">
        Equilibrium Solver
      </div>
      <div class="flex justify-center pt-4">
        <EquilibriumSolver />
      </div>
    </div>
  );
}
