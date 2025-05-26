const visit = async (page) => {
  await page.goto("", { waitUntil: "networkidle" });

  await page.addMilestone("View all tasks");
  await page.waitForSelector("#task-list", { state: "visible" });
  await page.scrollToEnd();

  await page.addMilestone("Add task");
  await page.getByRole("textbox", { name: "New task..." }).click();
  await page.getByRole("textbox", { name: "New task..." }).fill("DELETE ME");
  await page.locator('select[name="category"]').selectOption("work");
  await page.locator('select[name="priority"]').selectOption("high");
  await page.getByRole("button", { name: "add" }).click();
  await page.waitForNetworkIdle();

  await page.addMilestone("Go to /active");
  await page.getByRole("link", { name: "active" }).click();
  await page.waitForSelector("#task-list", { state: "visible" });
  await page.waitForNetworkIdle();

  await page.addMilestone("Update task");
  await page
    .locator("astro-island")
    .filter({ hasText: "DELETE ME" })
    .waitFor({ state: "visible" });
  await page
    .locator("astro-island")
    .filter({ hasText: "DELETE ME" })
    .getByRole("checkbox")
    .check();
  await page.waitForNetworkIdle();

  await page.addMilestone("Go to /completed");
  await page.getByRole("link", { name: "completed" }).click();
  await page.waitForSelector("#task-list", { state: "visible" });
  await page.waitForNetworkIdle();

  await page.addMilestone("Delete task");
  await page
    .locator("astro-island")
    .filter({ hasText: "DELETE ME" })
    .getByRole("button")
    .click();
  await page.waitForNetworkIdle();
};

module.exports = visit;
