import * as locales from "./locales";
import { i18n } from "@vc-shell/framework";
import { Router } from "vue-router";
import { App } from "vue";
import { routes } from "./router";
import { useRegistrationForm } from "./composables/useRegistrationForm";
import { RegistrationButton } from "./components";

export default {
  install(app: App, options?: { router: Router }) {
    let routerInstance: Router;

    if (options && options.router) {
      const { router } = options;
      routerInstance = router;
    }

    routes.forEach((route) => {
      routerInstance.addRoute(route);
    });

    if (locales) {
      Object.entries(locales).forEach(([key, message]) => {
        // Merge locale messages, overwriting existing ones
        i18n.global.mergeLocaleMessage(key, message);
      });
    }
  },
  extensions: {
    inbound: {
      "registration-form": useRegistrationForm(),
    },
    outbound: {
      "login-after-form": [{ id: "RegistrationButton", component: RegistrationButton }],
    },
  },
};
