import { createRoot, type Root } from "react-dom/client";
import type { City } from "../types/applicationForm";
import { ApplicationFormModal } from "../components/ApplicationFormModal";

type Controller = {
  open: (city: City) => void;
  close: () => void;
};

function ensureContainer(): HTMLElement {
  const existing = document.getElementById("application-form-root");
  if (existing) return existing;
  const el = document.createElement("div");
  el.id = "application-form-root";
  document.body.appendChild(el);
  return el;
}

export function mountApplicationForm(): Controller {
  const container = ensureContainer();
  const root: Root = createRoot(container);

  let currentCity: City = "greenhills";
  let isOpen = false;

  const render = () => {
    root.render(
      <ApplicationFormModal
        city={currentCity}
        open={isOpen}
        onClose={() => {
          isOpen = false;
          render();
        }}
      />,
    );
  };

  render();

  return {
    open: (city) => {
      currentCity = city;
      isOpen = true;
      render();
    },
    close: () => {
      isOpen = false;
      render();
    },
  };
}

