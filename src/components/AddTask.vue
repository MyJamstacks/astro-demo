<template>
  <form @submit.prevent="submitTask" class="add-task-form">
    <img src="/category.svg" alt="category icon" />
    <select name="category" v-model="category">
      <option value="general">general</option>
      <option value="family">family</option>
      <option value="finances">finances</option>
      <option value="health">health</option>
      <option value="hobbies">hobbies</option>
      <option value="household">household</option>
      <option value="learning">learning</option>
      <option value="personal">personal</option>
      <option value="shopping">shopping</option>
      <option value="work">work</option>
    </select>
    <img src="/priority.svg" alt="priority icon" />
    <select name="priority" v-model="priority">
      <option value="none">none</option>
      <option value="low">low</option>
      <option value="medium">medium</option>
      <option value="high">high</option>
    </select>
    <input
      name="title"
      v-model="title"
      type="text"
      placeholder="New task..."
      required
    />
    <button class="button active" type="submit">add</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";

const title = ref("");
const priority = ref("none");
const category = ref("general");

let isTaskListReady = false;

onMounted(() => {
  window.addEventListener("task-list-ready", () => {
    isTaskListReady = true;
  });
});

async function submitTask() {
  const newTask = {
    id: Math.random().toString().slice(2, 5),
    createdAt: new Date().toISOString(),
    title: title.value,
    category: category.value,
    priority: priority.value,
    complete: false,
  };

  const apiUrl = import.meta.env.PUBLIC_API_URL;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });

  const savedTask = await res.json();

  if (isTaskListReady) {
    window.dispatchEvent(new CustomEvent("task-added", { detail: savedTask }));
  }

  title.value = "";
  priority.value = "none";
  category.value = "general";
}
</script>
