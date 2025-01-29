import { RouteRecordRaw } from "vue-router";
import Registration from "../pages/registration.vue";
// eslint-disable-next-line import/no-unresolved
import whiteLogoImage from "/assets/logo-white.svg";
// eslint-disable-next-line import/no-unresolved
import bgImage from "/assets/background.jpg";

export const routes: RouteRecordRaw[] = [
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    props: (route) => ({
      logo: whiteLogoImage,
      background: bgImage,
    }),
  },
];
