import { renderApp } from "./render/app";
import "./styles/main.css";

document.documentElement.classList.add("js");

const root = document.querySelector<HTMLElement>("#app");

if (root) {
  renderApp(root);
}
