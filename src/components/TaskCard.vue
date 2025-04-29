<template>
  <div :class="['task-card', task.priority, { 'task-complete': complete }]">
    <img
      :src="`/${task.category}.svg`"
      :alt="task.category"
      class="category-icon"
    />
    <div class="task-info">
      <strong>{{ task.title }}</strong>
      <div class="task-meta">Created: {{ formatDate(task.createdAt) }}</div>
    </div>
    <input
      name="task-checkbox"
      type="checkbox"
      class="task-checkbox"
      v-model="complete"
    />
    <button class="delete-button" @click="deleteTask">✖</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({ task: Object });
const emit = defineEmits(["task-updated"]);

const complete = ref(props.task.complete);

watch(complete, async (newVal) => {
  await fetch(`http://localhost:3001/tasks/${props.task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ complete: newVal }),
  });
  emit("task-updated", { ...props.task, complete: newVal });
});

async function deleteTask() {
  const res = await fetch(`http://localhost:3001/tasks/${props.task.id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    // only dispatch once the server really deleted it:
    window.dispatchEvent(
      new CustomEvent("task-deleted", { detail: props.task.id })
    );
  } else {
    console.error("Failed to delete task:", res.status);
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const m = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][d.getMonth()];
  return `${dd} ${m} ${d.getFullYear()}`;
}
</script>
