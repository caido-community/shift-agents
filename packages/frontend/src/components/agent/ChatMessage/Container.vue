<script setup lang="ts">
import { toRefs } from "vue";

import { ChatMessageAssistant } from "./Assistant";
import { ChatMessageUser } from "./User";

import type { CustomUIMessage } from "@/agents/types";

const props = defineProps<{ message: CustomUIMessage }>();

const { message } = toRefs(props);
</script>

<template>
  <ChatMessageUser
    v-if="message.role === 'user'"
    :message="message as CustomUIMessage & { role: 'user' }"
  />
  <ChatMessageAssistant
    v-else-if="message.role === 'assistant'"
    :message="message as CustomUIMessage & { role: 'assistant' }"
  />
  <div v-else>Unknown role: {{ message.role }}</div>
</template>
