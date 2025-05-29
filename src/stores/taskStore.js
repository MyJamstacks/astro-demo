import { reactive, readonly, computed } from "vue";

let _store;

export function useTaskStore() {
  if (_store) return _store;

  const state = reactive({
    tasks: [],
    filter: "all",
  });

  function applyFilter(list, filter) {
    if (filter === "active") return list.filter((t) => !t.complete);
    if (filter === "completed") return list.filter((t) => t.complete);
    return list;
  }

  function setTasks(newTasks) {
    state.tasks = newTasks.filter((t) => t && t.id);
  }

  function addTask(task) {
    if (
      (state.filter === "active" && task.complete) ||
      (state.filter === "completed" && !task.complete)
    )
      return;
    state.tasks.unshift(task);
  }

  function updateTask(updated) {
    const i = state.tasks.findIndex((t) => t.id === updated.id);
    if (i !== -1) state.tasks[i] = updated;
    if (
      (state.filter === "active" && updated.complete) ||
      (state.filter === "completed" && !updated.complete)
    ) {
      state.tasks.splice(i, 1);
    }
  }

  function deleteTask(id) {
    const i = state.tasks.findIndex((t) => t.id === id);
    if (i !== -1) state.tasks.splice(i, 1);
  }

  function setFilter(value) {
    state.filter = value;
  }

  const filteredTasks = computed(() => applyFilter(state.tasks, state.filter));

  _store = {
    tasks: filteredTasks,
    rawTasks: readonly(state.tasks),
    filter: computed(() => state.filter),
    setFilter,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
  };

  return _store;
}
