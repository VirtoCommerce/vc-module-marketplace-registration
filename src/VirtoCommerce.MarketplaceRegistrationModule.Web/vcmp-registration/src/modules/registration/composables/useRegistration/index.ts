import { computed, ref } from "vue";
import { useApiClient, useAsync, useLoading } from "@vc-shell/framework";
import {
  VcmpRegistrationRequestClient,
  ICreateRegistrationRequestCommand,
  CreateRegistrationRequestCommand,
  RegistrationRequest,
} from "@vcmp-registration/api/marketplaceregistration";

export default () => {
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

  const loading = useLoading(itemLoading);

  return {
    item: computed(() => item.value),
    loading: computed(() => loading.value),
    register,
  };
};
