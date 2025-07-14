import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/registration-requests",
    name: "RegistrationRequests",
    component: () => import("../pages/RegistrationRequestsList.vue"),
    meta: {
      requiresAuth: true,
      permissions: ["seller:registration:read"],
    },
  },
  {
    path: "/registration-requests/:id",
    name: "RegistrationRequestDetails",
    component: () => import("../pages/RegistrationRequestDetails.vue"),
    meta: {
      requiresAuth: true,
      permissions: ["seller:registration:read"],
    },
  },
];