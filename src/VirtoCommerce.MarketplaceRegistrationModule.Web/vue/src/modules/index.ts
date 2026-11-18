import * as blades from "./pages";
import * as locales from "./locales";
import { defineAppModule } from "@vc-shell/framework";
import { markRaw } from "vue";
import RegistrationRequestNotification from "./components/RegistrationRequestNotification.vue";

export default defineAppModule({
  blades,
  locales,
  notifications: {
    // a new request was filed (legacy pushNotificationTemplateResolver for RegistrationRequestPushNotification)
    RegistrationRequestPushNotification: {
      template: markRaw(RegistrationRequestNotification),
      toast: { mode: "auto" },
    },
  },
});

export * from "./pages";
