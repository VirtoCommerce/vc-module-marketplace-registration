import { usePopup } from "@vc-shell/framework";
import { markRaw } from "vue";
import DeclineDialog from "../components/DeclineDialog.vue";

/** Opens the decline dialog; resolves the entered reason, or false when dismissed. */
export function useDeclinePrompt() {
  let resolve: ((value: string | false) => void) | undefined;
  const settle = (value: string | false) => {
    resolve?.(value);
    resolve = undefined;
    popup.close();
  };
  const popup = usePopup({
    component: markRaw(DeclineDialog),
    emits: { onConfirm: (reason: string) => settle(reason), onClose: () => settle(false) },
  });
  return () =>
    new Promise<string | false>((r) => {
      resolve = r;
      popup.open();
    });
}
