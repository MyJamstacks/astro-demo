import { createApp, h } from "vue";

// import {
//   createApp,
//   h,
// } from "https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.esm-browser.js";
// /**

/**
 * @param {object} Component
 * @param {object} props
 * @param {Element} container
 */
export function patchDom(Component, props, container) {
  const app = createApp({
    render: () => h(Component, props),
  });
  app.mount(container);
}

/**
 * @param {string|null} filter
 */
export function setupTaskEvents(filter = null) {
  const listEl = document.getElementById("task-list");
  if (!listEl) return;

  window.addEventListener("task-added", async (e) => {
    const task = e.detail;

    if (filter === "active" && task.complete) return;
    if (filter === "completed" && !task.complete) return;

    const wrapper = document.createElement("div");
    wrapper.dataset.taskId = task.id;
    listEl.prepend(wrapper);

    const { default: TaskCard } = await import("../components/TaskCard.vue");
    patchDom(TaskCard, { task }, wrapper);
  });

  window.addEventListener("task-deleted", (e) => {
    const id = e.detail;
    const node = listEl.querySelector(`[data-task-id="${id}"]`);
    if (node) node.remove();
  });
}
