<template>
  <div class="task-list">
    <TaskCard
      v-for="task in store.tasks.value"
      :key="task.id"
      :task="task"
      @task-updated="store.updateTask"
      @task-deleted="store.deleteTask"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import TaskCard from "./TaskCard.vue";
import { useTaskStore } from "../stores/taskStore.js";

const props = defineProps({
  initialTasks: {
    type: Array,
    default: () => [],
  },
  filter: {
    type: String,
    default: "all",
  },
});

const store = useTaskStore();

function onTaskAdded(e) {
  store.addTask(e.detail);
}

async function fetchTasks() {
  const apiUrl = import.meta.env.PUBLIC_API_URL;
  const res = await fetch(apiUrl);
  const data = await res.json();

  store.setTasks(
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  );
}

onMounted(() => {
  store.setFilter(props.filter);

  if (props.initialTasks?.length) {
    store.setTasks(
      [...props.initialTasks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
  }

  if (performance.getEntriesByType("navigation")[0]?.type === "navigate") {
    fetchTasks();
  }

  window.dispatchEvent(new Event("task-list-ready"));
  window.addEventListener("task-added", onTaskAdded);
});

onUnmounted(() => {
  window.removeEventListener("task-added", onTaskAdded);
});
</script>
