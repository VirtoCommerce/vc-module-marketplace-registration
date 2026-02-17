import * as locales from "./locales";
import { i18n, useExtensionPoint } from "@vc-shell/framework";
import { Router } from "vue-router";
import { App } from "vue";
import { routes } from "./router";
import { RegistrationButton } from "./components";

export default {
  install(app: App, options?: { router: Router }) {
    let routerInstance: Router;

    if (options && options.router) {
      const { router } = options;
      routerInstance = router;
    }

    routes.forEach((route) => {
      if (route.name === "DemoRegistration") {
        return;
      }
      routerInstance.addRoute(route);
    });

    if (locales) {
      Object.entries(locales).forEach(([key, message]) => {
        // Merge locale messages, overwriting existing ones
        i18n.global.mergeLocaleMessage(key, message);
      });
    }

    const { add } = useExtensionPoint("auth:after-form");

    add({
      id: "registration-button",
      component: RegistrationButton,
      props: {
        text: "Register",
        variant: "secondary",
      },
      priority: 10,
      meta: { type: "action", intent: "navigate" },
    });
  },
};
