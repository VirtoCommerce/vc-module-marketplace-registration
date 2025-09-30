import * as locales from "./locales";
import { i18n, useExtensionData, useExtensionSlot } from "@vc-shell/framework";
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

    const { addComponent } = useExtensionSlot("login-after-form");

    addComponent({
      id: "registration-button",
      component: RegistrationButton,
      props: {
        text: "Register",
      },
      priority: 10,
    });

    const { updateData } = useExtensionData("registration-form");

    updateData({
      fields: [
        {
          name: "firstName",
          type: "text",
          component: "VcInput",
          label: "VCMP_VENDOR_REGISTRATION.LABELS.FIRST_NAME",
          placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.FIRST_NAME",
          required: true,
          rules: "required",
          priority: 10,
        },
        {
          name: "lastName",
          type: "text",
          component: "VcInput",
          label: "VCMP_VENDOR_REGISTRATION.LABELS.LAST_NAME",
          placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.LAST_NAME",
          required: true,
          rules: "required",
          priority: 20,
        },
        {
          name: "organizationName",
          type: "text",
          component: "VcInput",
          label: "VCMP_VENDOR_REGISTRATION.LABELS.ORGANIZATION",
          placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.ORGANIZATION",
          required: true,
          rules: "required",
          priority: 30,
        },
        {
          name: "contactEmail",
          type: "email",
          component: "VcInput",
          label: "VCMP_VENDOR_REGISTRATION.LABELS.EMAIL",
          placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.EMAIL",
          hint: "VCMP_VENDOR_REGISTRATION.HINTS.EMAIL",
          required: true,
          rules: "emailWithServerValidation",
          priority: 40,
        },
        {
          name: "contactPhone",
          type: "tel",
          component: "VcInput",
          label: "VCMP_VENDOR_REGISTRATION.LABELS.PHONE",
          placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.PHONE",
          rules: "phone",
          priority: 50,
        },
      ],
    });
  },
};
