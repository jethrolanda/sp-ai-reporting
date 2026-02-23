import { createRoot } from "@wordpress/element";
import RugbyChat from "./components/RugbyChat";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

const App = () => {
  return (
    <RugbyChat/>
  );
};
createRoot(document.getElementById("ai-prompt-frontend")).render(<App />);