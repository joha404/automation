import Calculator from "./components/Calculator";
import Howto from "./components/Howto";

const BettingCalculator = () => {
  return (
    <div className="min-h-[90vh] flex justify-center items-center w-full">
      <div className="w-full">
        <Calculator />
        <Howto />
      </div>
    </div>
  );
};

export default BettingCalculator;
