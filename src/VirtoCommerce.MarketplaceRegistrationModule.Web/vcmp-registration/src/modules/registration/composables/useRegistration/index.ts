import { computed, ref, ComputedRef } from "vue";
import { useApiClient, useAsync, useLoading } from "@vc-shell/framework";
import {
  VcmpRegistrationRequestClient,
  ICreateRegistrationRequestCommand,
  CreateRegistrationRequestCommand,
  RegistrationRequest,
  ValidateRegistrationRequestQuery,
  IRegistrationRequest,
  ValidationFailure,
} from "@vcmp-registration/api/marketplaceregistration";

export interface IUseRegistration {
  item: ComputedRef<RegistrationRequest | null>;
  loading: ComputedRef<boolean>;
  validateEmailLoading: ComputedRef<boolean>;
  register: (payload: ICreateRegistrationRequestCommand) => Promise<RegistrationRequest>;
  validateEmail: (query: IRegistrationRequest) => Promise<ValidationFailure[]>;
}

export default (): IUseRegistration => {
  const { getApiClient } = useApiClient(VcmpRegistrationRequestClient);

  const item = ref<RegistrationRequest | null>(null);

  const { loading: itemLoading, action: register } = useAsync<ICreateRegistrationRequestCommand, RegistrationRequest>(
    async (payload) => {
      const client = await getApiClient();
      const command = new CreateRegistrationRequestCommand(payload);
      const result = await client.createRegistrationRequest(command);

      return result;
    },
  );

  const {loading: validateEmailLoading, action: validateEmail} = useAsync<IRegistrationRequest, ValidationFailure[]>(
    async (query) => {
      const client = await getApiClient();

      const command = new ValidateRegistrationRequestQuery({
        registrationRequest: new RegistrationRequest(query)
      })
      return client.validateRegistrationRequest(command);
    },
  );

  const loading = useLoading(itemLoading);

  return {
    item: computed(() => item.value),
    loading: computed(() => loading.value),
    validateEmailLoading: computed(() => validateEmailLoading.value),
    register,
    validateEmail
  };
};
