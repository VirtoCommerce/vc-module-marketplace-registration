import { VcmpRegistrationRequestClient } from "../api_client/virtocommerce.marketplaceregistration";
import { VcmpCommonClient, VcmpSellerSecurityClient } from "../api_client/virtocommerce.marketplacevendor";
import { StateMachineClient, type StateMachineStateShort } from "../api_client/virtocommerce.statemachine";
import { REGISTRATION_REQUEST_TYPE } from "./types";

// The generated clients are plain fetch wrappers (same-origin cookie auth), so one instance each is enough.
// Marketplace Vendor and StateMachine clients cover what the legacy UI called through those modules' services.
export const api = {
  requests: new VcmpRegistrationRequestClient(),
  vendorCommon: new VcmpCommonClient(),
  sellers: new VcmpSellerSecurityClient(),
  stateMachine: new StateMachineClient(),
};

/** Message of a failed request, for showError. */
export const errorText = (e: unknown) => String((e as Error)?.message ?? e);

const states: Record<string, Promise<StateMachineStateShort[]>> = {};
/** States of the registration request state machine, localized; loaded once per locale, retried after a failure. */
export function registrationStates(locale: string): Promise<StateMachineStateShort[]> {
  states[locale] ??= api.stateMachine
    .getAllStates(REGISTRATION_REQUEST_TYPE, locale)
    .then((x) => x ?? [])
    .catch(() => {
      delete states[locale];
      return [];
    });
  return states[locale];
}

/**
 * The vendor portal's registration form (legacy correctRegistrationFormUrl): the RegistrationFormUrl setting,
 * made absolute against Marketplace Vendor's vendor portal url when it is relative. Undefined when not configured.
 */
export async function registrationFormUrl(): Promise<string | undefined> {
  const [settings, vendorSettings] = await Promise.all([
    api.requests.getSettings().catch(() => undefined),
    api.vendorCommon.getVcmpSettings().catch(() => undefined),
  ]);
  const formUrl = settings?.registrationFormUrl;
  if (!formUrl || formUrl.length <= 1) return undefined;
  if (/^https?:\/\//.test(formUrl)) return formUrl;
  const portalUrl = vendorSettings?.vendorPortalUrl;
  if (!portalUrl || portalUrl.length <= 1) return formUrl;
  return portalUrl.replace(/\/$/, "") + "/" + formUrl.replace(/^\//, "");
}

// The seeded transitions carry Font Awesome icons, which the Admin Shell doesn't load
const TRANSITION_ICONS: Record<string, string> = {
  "fa-check-circle": "lucide-circle-check",
  "fa-ellipsis-h": "lucide-ellipsis",
  "fa-times-circle": "lucide-circle-x",
};
/** Toolbar icon of a state machine transition: a Lucide icon as is, a known Font Awesome one mapped. */
export function transitionIcon(icon?: string) {
  if (icon?.startsWith("lucide-")) return icon;
  const fa = icon?.split(/\s+/).find((x) => x.startsWith("fa-"));
  return (fa && TRANSITION_ICONS[fa]) || "lucide-circle-arrow-right";
}
