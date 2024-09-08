import "./App.css";
import DynamicSettings from "./components/organisms/DynamicSettings/DynamicSettings";
import VoiceChatDisclosure from "./components/organisms/VoiceChatDisclosure/VoiceChatDisclosure";
import { Toaster } from "sonner";

const components = [
  <VoiceChatDisclosure />,
  <DynamicSettings />,
  "Coming Soon",
  "Coming Soon",
];

function App() {
  return (
    <html lang="en">
      <body>
        <main>
          <div className="app h-screen w-screen flex flex-wrap gap-2 p-2">
            {components.map((comp) => {
              return (
                <div className="aspect-square border flex items-center justify-center rounded-sm basis-1/3 flex-grow">
                  {comp}
                </div>
              );
            })}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}

export default App;
