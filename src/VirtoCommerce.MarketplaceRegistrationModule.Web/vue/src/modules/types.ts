// Blade options; type aliases, not interfaces, so they fit openBlade's Record<string, unknown> options

/** Backend ModuleConstants.Security.Permissions */
export const PERMISSIONS = {
  READ: "seller:registration:read",
  UPDATE: "seller:registration:update",
} as const;

/** State machine entity type of a registration request (backend ModuleConstants.StateMachineObjectType) */
export const REGISTRATION_REQUEST_TYPE = "VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest";

/** MarketplaceRegistrationRequests opened from a push notification: the request to open (legacy blade.notification) */
export type RegistrationRequestsOptions = {
  openId?: string;
};

/** Options of Marketplace Vendor's MarketplaceSellerAdd blade (its SellerAddOptions) */
export type SellerAddOptions = {
  command?: {
    sellerName?: string;
    ownerDetails?: { firstName?: string; lastName?: string; email?: string };
  };
  onCreated?: () => Promise<unknown> | void;
};

/** Backend RegistrationRequestPushNotification; no endpoint returns it, so the client has no type for it */
export type RegistrationRequestPushNotification = {
  title?: string;
  description?: string;
  registrationRequestId?: string;
};
