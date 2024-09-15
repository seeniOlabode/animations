import "./App.css";
import DynamicSettings from "./components/organisms/DynamicSettings/DynamicSettings";
import VoiceChatDisclosure from "./components/organisms/VoiceChatDisclosure/VoiceChatDisclosure";
import { Toaster } from "sonner";
import InteractiveCoinSwap from "./components/organisms/InteractiveCoinSwap/InteractiveCoinSwap";

const components = [<VoiceChatDisclosure />, <DynamicSettings />];

function App() {
  return (
    <>
      <main>
        <div className="app h-screen w-screen flex flex-wrap gap-2 p-2 components-container">
          {components.map((comp, i) => {
            return (
              <div
                className="aspect-square border flex items-center justify-center rounded-sm xl:basis-1/4 md:basis-1/3 flex-grow basis-full single-component"
                key={i}
              >
                {comp}
              </div>
            );
          })}
          <div className="aspect-square  border flex items-center justify-center rounded-sm xl:basis-1/4 md:basis-1/3 flex-grow basis-full single-component"></div>
          <div className="aspect-square  border flex items-center justify-center rounded-sm xl:basis-1/4 md:basis-1/3 flex-grow basis-full single-component"></div>
        </div>
      </main>
      <Toaster />
    </>
  );
}

// function App() {
//   return <InteractiveCoinSwap />;
// }

export default App;
