import { type Component, computed } from "vue";

import {
  AnthropicIcon,
  DeepseekIcon,
  GoogleIcon,
  OpenAIIcon,
  QwenIcon,
} from "./icons";

import { useConfigStore } from "@/stores/config";

export const useSelector = () => {
  const configStore = useConfigStore();

  const model = computed({
    get() {
      return configStore.model;
    },
    set(value: string) {
      configStore.model = value;
    },
  });

  const groups = computed(() => configStore.models);

  const idToItem = computed(() => {
    const map: Record<string, { id: string; name: string }> = {};
    groups.value.forEach((g) => {
      g.items.forEach((i) => {
        map[i.id] = { id: i.id, name: i.name };
      });
    });
    return map;
  });

  const idToGroup = computed(() => {
    const map: Record<string, string> = {};
    groups.value.forEach((g) => {
      g.items.forEach((i) => {
        map[i.id] = g.label;
      });
    });
    return map;
  });

  const iconByGroup: Record<string, Component> = {
    Anthropic: AnthropicIcon,
    OpenAI: OpenAIIcon,
    Google: GoogleIcon,
    DeepSeek: DeepseekIcon,
    Qwen: QwenIcon,
  };

  const iconByModelId = computed(() => {
    const map: Record<string, Component | undefined> = {};
    Object.keys(idToGroup.value).forEach((id) => {
      const group = idToGroup.value[id];
      map[id] = group !== undefined ? iconByGroup[group] : undefined;
    });
    return map;
  });

  const selected = computed(() => idToItem.value[model.value]);

  return { model, groups, iconByModelId, selected };
};
