import "./App.css";
import DynamicSettings from "./components/organisms/DynamicSettings/DynamicSettings";
import VoiceChatDisclosure from "./components/organisms/VoiceChatDisclosure/VoiceChatDisclosure";
import { Toaster } from "sonner";
import InteractiveCoinSwap from "./components/organisms/InteractiveCoinSwap/InteractiveCoinSwap";
import Slo from "./assets/images/slo.png";

const components = [<VoiceChatDisclosure />, <DynamicSettings />];

function App() {
  return (
    <>
      <main>
        <div className="header-container p-2 pb-0">
          <header className=" text-xl font-medium heading rounded-md pr-4 pl-2">
            <a
              href="https://x.com/bodeslomo"
              target="_blank"
              rel="noreferrer"
              className="slo"
            >
              <img className="slo-image" alt="A bitmoji of Slo" src={Slo} />
              Slo
            </a>

            <ul className="links flex ml-auto">
              <li className="">
                <a
                  href="https://read.cv/bodeslomo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
              </li>
              <li className="">
                <a
                  href="https://x.com/bodeslomo"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  Twitter
                </a>
              </li>
              <li className="">
                <a
                  href="https://github.com/seeniolabode"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </li>
            </ul>
          </header>
        </div>
        <div className="app gap-2 p-2 components-container">
          {components.map((comp, i) => {
            return (
              <div
                className="aspect-square border flex items-center justify-center rounded-sm single-component"
                key={i}
              >
                {comp}
              </div>
            );
          })}
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
