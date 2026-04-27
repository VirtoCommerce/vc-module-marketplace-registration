import { computed, ref, ComputedRef } from "vue";
import { useApiClient, useAsync, useLoading } from "@vc-shell/framework";
import {
  VcmpRegistrationRequestClient,
  CreateRegistrationRequestCommand,
  RegistrationRequest,
  ValidationFailure,
} from "@vcmp-registration/api/marketplaceregistration";

export interface IUseRegistration {
  item: ComputedRef<RegistrationRequest | null>;
  loading: ComputedRef<boolean>;
  validationLoading: ComputedRef<boolean>;
  register: (payload: CreateRegistrationRequestCommand) => Promise<RegistrationRequest>;
  validateRegistrationRequest: (query: RegistrationRequest) => Promise<ValidationFailure[]>;
}

export default (): IUseRegistration => {
  const { getApiClient } = useApiClient(VcmpRegistrationRequestClient);

  const item = ref<RegistrationRequest | null>(null);

  const { loading: itemLoading, action: register } = useAsync<CreateRegistrationRequestCommand, RegistrationRequest>(
    async (payload) => {
      const client = await getApiClient();
      return client.createRegistrationRequest(payload);
    },
  );

  const { loading: validationLoading, action: validateRegistrationRequest } = useAsync<
    RegistrationRequest,
    ValidationFailure[]
  >(async (query) => {
    const client = await getApiClient();
    return client.validateRegistrationRequest({ registrationRequest: query });
  });

  const loading = useLoading(itemLoading);

  return {
    item: computed(() => item.value),
    loading: computed(() => loading.value),
    validationLoading: computed(() => validationLoading.value),
    register,
    validateRegistrationRequest,
  };
};
