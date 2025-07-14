import * as locales from "./locales";
import { i18n } from "@vc-shell/framework";
import { Router } from "vue-router";
import { App } from "vue";
import { routes } from "./router";
import { useRegistrationRequests } from "./composables/useRegistrationRequests";
import { useRegistrationFilters } from "./composables/useRegistrationFilters";

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
        i18n.global.mergeLocaleMessage(key, message);
      });
    }
  },
  extensions: {
    inbound: {
      "registration-requests": useRegistrationRequests(),
      "registration-filters": useRegistrationFilters(),
    },
    outbound: {
      "main-menu": [
        {
          id: "registrationRequests",
          title: "VCMP_ADMIN.MENU.REGISTRATION_REQUESTS",
          icon: "fas fa-address-card",
          path: "/registration-requests",
          priority: 100,
          permission: "seller:registration:read",
        },
      ],
    },
  },
};