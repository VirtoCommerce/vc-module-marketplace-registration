import { RouteRecordRaw } from "vue-router";
import Registration from "../pages/registration.vue";
import DemoRegistration from "../pages/demo.vue";
import whiteLogoImage from "../../../../public/assets/logo-white.svg";
import bgImage from "../../../../public/assets/background.jpg";

export const routes: RouteRecordRaw[] = [
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    props: () => ({
      logo: whiteLogoImage,
      background: bgImage,
    }),
  },
  {
    path: "/demo",
    name: "DemoRegistration",
    component: DemoRegistration,
  },
];
