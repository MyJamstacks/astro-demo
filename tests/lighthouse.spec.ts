import {
  createLighthouseTest,
  connectToLighthouseFlow,
  generateLighthouseReportUsingFlow,
  getLighthouseReportPaths,
} from "@thecollege/playwright-lighthouse-flow";

const test = createLighthouseTest({
  login: async (page) => {},
});

test("Astro", async ({ page, port }) => {
  const route = "/";
  await page.goto(`http://localhost:4321${route}`);

  const flow = await connectToLighthouseFlow({
    port,
    route,
    config: {
      extends: "lighthouse:default",
      settings: {
        screenEmulation: {
          mobile: false,
          disabled: false,
          width: 1366,
          height: 768,
          deviceScaleFactor: 1,
        },
        formFactor: "desktop",
      },
    },
    flowName: "Astro Lighthouse Test",
  });

  await flow.navigate("http://localhost:4321/", { name: "All Tasks" });

  await flow.startTimespan({ name: "scroll to end" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await flow.endTimespan();

  await flow.startTimespan({ name: "add task" });
  await page.getByRole("textbox", { name: "New task..." }).fill("DELETE ME");
  await page.locator('select[name="category"]').selectOption("work");
  await page.locator('select[name="priority"]').selectOption("high");
  await page.getByRole("button", { name: "add" }).click();
  await page.waitForTimeout(1000);
  await flow.endTimespan();

  await flow.navigate("http://localhost:4321/active", {
    name: "Go To Active Tasks",
  });

  await flow.startTimespan({ name: "update task" });
  await page
    .locator(".task-card")
    .filter({ hasText: "DELETE ME" })
    .getByRole("checkbox")
    .check();
  await page.waitForTimeout(1000);
  await flow.endTimespan();

  await flow.navigate("http://localhost:4321/completed", {
    name: "Go To Completed Tasks",
  });

  await flow.startTimespan({ name: "delete task" });
  await page
    .locator(".task-card")
    .filter({ hasText: "DELETE ME" })
    .getByRole("button")
    .click();
  await page.waitForTimeout(1000);
  await flow.endTimespan();

  const reportPaths = getLighthouseReportPaths("report");
  await generateLighthouseReportUsingFlow(flow, reportPaths);
});
