import CommonParagraph from "@/components/texts/CommonParagraph";
import Chatroom from "./components/Chatroom";
import Scoreboard from "./components/Scoreboard";
import { useTheme } from "@/hooks/custom/useTheme";

const SportsHub = () => {
  const { theme } = useTheme();
  return (
    <div>
      {/* <Scoreboard /> */}
      <Chatroom />

      {/* <div
        className={`rounded-lg shadow-sm flex flex-col mt-10 ${
          theme === "dark" ? "bg-darkBlack" : "bg-white"
        }`}
      >
        <div className="h-[500px] w-full flex justify-center items-center">
          <CommonParagraph
            variant="larger"
            className="opacity-80 text-wrap text-center py-10 text-6xl"
          >
            Chat Room Coming Soon
          </CommonParagraph>
        </div>
      </div> */}
    </div>
  );
};

export default SportsHub;
