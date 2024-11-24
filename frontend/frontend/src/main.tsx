import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { store } from "@/store.ts";
import "./index.css";
import App from "./app/App.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
