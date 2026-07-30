import assert from "node:assert/strict";
import test from "node:test";

import worker from "../dist/server/index.js";

const expectedResources = [
  "Patreon",
  "YouTube",
  "Creative Commons materials",
  "Twitter",
  "Instagram",
  "TikTok",
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
  const [appResponse, dataResponse, styleResponse] = await Promise.all([
    worker.fetch(new Request("https://portfolio.test/app.js")),
    worker.fetch(new Request("https://portfolio.test/data.js")),
    worker.fetch(new Request("https://portfolio.test/style.css"))
  ]);

  const appSource = await appResponse.text();
  const dataSource = await dataResponse.text();
  const styleSource = await styleResponse.text();

  assert.equal(appResponse.status, 200);
  assert.equal(dataResponse.status, 200);
  assert.equal(styleResponse.status, 200);
  assert.match(appSource, /aria-expanded/);
  assert.match(appSource, /navigator\.clipboard/);
  assert.match(dataSource, /dmytroserebrennikov@gmail\.com/);
  assert.match(dataSource, /fa-google-drive/);
  assert.match(dataSource, /1ol3xviH_0FlgLQaBy66r8Om9Emwu-STf/);
  assert.match(styleSource, /place-items:\s*start center/);
  assert.match(styleSource, /--closed-shell-height:\s*43\.05rem/);
  assert.match(styleSource, /scrollbar-gutter:\s*stable both-edges/);

  for (const resourceName of expectedResources) {
    assert.match(dataSource, new RegExp(`name: "${resourceName}"`));
  }

  const descriptionLines = dataSource.match(/description: ".*"/g) ?? [];
  assert.equal(descriptionLines.length, expectedResources.length);

  for (const descriptionLine of descriptionLines) {
    assert.doesNotMatch(descriptionLine, /[-–—]/);
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
