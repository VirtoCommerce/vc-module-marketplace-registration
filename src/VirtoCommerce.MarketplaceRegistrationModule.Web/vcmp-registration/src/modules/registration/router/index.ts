import { RouteRecordRaw } from "vue-router";
import Registration from "../pages/registration.vue";
import DemoRegistration from "../pages/demo.vue";
import whiteLogoImage from "../../../../public/assets/logo-white.svg";

export const routes: RouteRecordRaw[] = [
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    props: () => ({
      logo: whiteLogoImage,
    }),
  },
  {
    path: "/demo",
    name: "DemoRegistration",
    component: DemoRegistration,
  },
];
