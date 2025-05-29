<!-- <template>
  <div class="task-list">
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      client:visible
      @task-updated="onUpdateTask"
      @task-deleted="onDeleteTask"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TaskCard from "./TaskCard.vue";

const props = defineProps({
  initialTasks: Array,
  filter: String,
});

const tasks = ref(
  [...props.initialTasks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
);

function onAddTask(newTask) {
  if (props.filter === "active" && newTask.complete) return;
  if (props.filter === "completed" && !newTask.complete) return;
  tasks.value.unshift(newTask);
}

function onUpdateTask(updated) {
  const i = tasks.value.findIndex((t) => t.id === updated.id);
  if (i !== -1) tasks.value[i] = updated;
  if (
    (props.filter === "active" && updated.complete) ||
    (props.filter === "completed" && !updated.complete)
  ) {
    tasks.value.splice(i, 1);
  }
}
function onDeleteTask(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id);
}
onMounted(() => {
  window.addEventListener("task-added", (e) => onAddTask(e.detail));
});
onUnmounted(() => {
  window.removeEventListener("task-added", onAddTask);
});
</script> -->
