import assert from "node:assert/strict";
import test from "node:test";

import worker from "../dist/server/index.js";

const expectedResources = [
  "Patreon",
  "Twitter",
  "YouTube",
  "TikTok",
  "Instagram",
  "LinkedIn",
  "Telegram"
];

test("serves the simplified link page", async () => {
  const response = await worker.fetch(new Request("https://portfolio.test/"));
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(html, /id="resourceList"/);
  assert.doesNotMatch(html, /<img\b/i);
  assert.doesNotMatch(html, /<h[1-6]\b/i);
});

test("serves the interaction code and all resource data", async () => {
  const [appResponse, dataResponse] = await Promise.all([
    worker.fetch(new Request("https://portfolio.test/app.js")),
    worker.fetch(new Request("https://portfolio.test/data.js"))
  ]);

  const appSource = await appResponse.text();
  const dataSource = await dataResponse.text();

  assert.equal(appResponse.status, 200);
  assert.equal(dataResponse.status, 200);
  assert.match(appSource, /aria-expanded/);
  assert.match(appSource, /navigator\.clipboard/);
  assert.match(dataSource, /dmytroserebrennikov@gmail\.com/);

  for (const resourceName of expectedResources) {
    assert.match(dataSource, new RegExp(`name: "${resourceName}"`));
  }
});

test("returns useful HTTP statuses", async () => {
  const missingResponse = await worker.fetch(
    new Request("https://portfolio.test/missing")
  );
  const methodResponse = await worker.fetch(
    new Request("https://portfolio.test/", { method: "POST" })
  );

  assert.equal(missingResponse.status, 404);
  assert.equal(methodResponse.status, 405);
});

