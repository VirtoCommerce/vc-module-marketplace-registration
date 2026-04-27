import { computed, ref, ComputedRef } from "vue";
import { useApiClient, useAsync, useLoading } from "@vc-shell/framework";
import {
  VcmpRegistrationRequestClient,
  CreateRegistrationRequestCommand,
  RegistrationRequest,
  ValidateRegistrationRequestQuery,
  ValidationFailure,
} from "@vcmp-registration/api/marketplaceregistration";

export interface IUseRegistration {
  item: ComputedRef<RegistrationRequest | null>;
  loading: ComputedRef<boolean>;
  validateEmailLoading: ComputedRef<boolean>;
  register: (payload: CreateRegistrationRequestCommand) => Promise<RegistrationRequest>;
  validateEmail: (query: RegistrationRequest) => Promise<ValidationFailure[]>;
}

export default (): IUseRegistration => {
  const { getApiClient } = useApiClient(VcmpRegistrationRequestClient);

  const item = ref<RegistrationRequest | null>(null);

  const { loading: itemLoading, action: register } = useAsync<CreateRegistrationRequestCommand, RegistrationRequest>(
    async (payload) => {
      const client = await getApiClient();
      const command = {
        ...payload,
      } as CreateRegistrationRequestCommand;
      const result = await client.createRegistrationRequest(command);

      return result;
    },
  );

  const { loading: validateEmailLoading, action: validateEmail } = useAsync<RegistrationRequest, ValidationFailure[]>(
    async (query) => {
      const client = await getApiClient();

      const command = {
        registrationRequest: {
          ...query,
        } as RegistrationRequest,
      } as ValidateRegistrationRequestQuery;
      return client.validateRegistrationRequest(command);
    },
  );

  const loading = useLoading(itemLoading);

  return {
    item: computed(() => item.value),
    loading: computed(() => loading.value),
    validateEmailLoading: computed(() => validateEmailLoading.value),
    register,
    validateEmail,
  };
};
