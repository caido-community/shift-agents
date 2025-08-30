import { Classic } from "@caido/primevue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import { createApp } from "vue";

import { SDKPlugin } from "./plugins/sdk";
import "./styles/index.css";
import type { FrontendSDK } from "./types";
import App from "./views/App.vue";

import { setupAgents } from "@/agents";
import { createDOMManager } from "@/dom";
import { setupFloat } from "@/float";
import { setupRenaming } from "@/renaming";
import { useAgentsStore } from "@/stores/agents";
import { useConfigStore } from "@/stores/config";

export const init = (sdk: FrontendSDK) => {
  const app = createApp(App);

  app.use(PrimeVue, {
    unstyled: true,
    pt: Classic,
  });

  app.directive("tooltip", Tooltip);

  const pinia = createPinia();
  app.use(pinia);

  app.use(SDKPlugin, sdk);

  const root = document.createElement("div");
  Object.assign(root.style, {
    height: "100%",
    width: "100%",
  });

  root.id = `plugin--shift`;

  app.mount(root);

  sdk.navigation.addPage("/shift", {
    body: root,
  });

  sdk.sidebar.registerItem("Shift", "/shift", {
    icon: "fas fa-robot",
  });

  setupAgents(sdk);
  setupFloat(sdk);
  setupRenaming(sdk);

  sdk.commands.register("shift:add-to-memory", {
    name: "Add to memory",
    run: () => {
      const configStore = useConfigStore();

      const selection = window.getSelection();
      if (selection === null) return;

      const text = selection.toString();
      if (text.length === 0) return;

      configStore.memory += "\n" + text;

      sdk.window.showToast(`Text has been saved to your Shift memory`, {
        variant: "info",
      });
    },
  });

  sdk.shortcuts.register("shift:add-to-memory", ["shift", "m"]);

  const domManager = createDOMManager(sdk);
  domManager.drawer.start();
  domManager.session.start();

  domManager.session.onSelected((sessionId) => {
    const agentStore = useAgentsStore();
    if (sessionId !== undefined) {
      agentStore.selectAgent(sessionId);
    }
  });
};
