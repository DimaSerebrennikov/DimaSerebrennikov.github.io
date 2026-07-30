/* global window, document, navigator */

(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  const resourceList = document.getElementById("resourceList");
  const copyStatus = document.getElementById("copyStatus");

  if (!data || !resourceList || !copyStatus) {
    return;
  }

  const resourceItems = data.resources.map(createResourceItem);
  resourceItems.push(createEmailItem(data.email));
  resourceList.replaceChildren(...resourceItems);

  function createIcon(iconClasses, className) {
    const iconWrap = document.createElement("span");
    iconWrap.className = className;
    iconWrap.setAttribute("aria-hidden", "true");

    const icon = document.createElement("i");
    icon.classList.add(...iconClasses);
    iconWrap.appendChild(icon);

    return iconWrap;
  }

  function createResourceItem(resource, index) {
    const item = document.createElement("li");
    item.className = "resource-item";

    const card = document.createElement("div");
    card.className = "resource-card";

    const link = document.createElement("a");
    link.className = "resource-link";
    link.href = resource.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Open ${resource.name} in a new tab`);
    link.appendChild(createIcon(resource.iconClasses, "resource-icon"));

    const linkText = document.createElement("span");
    linkText.className = "resource-name";
    linkText.textContent = resource.name;
    link.appendChild(linkText);

    const descriptionId = `resource-description-${index}`;
    const descriptionShell = document.createElement("div");
    descriptionShell.className = "resource-description-shell";
    descriptionShell.id = descriptionId;
    descriptionShell.setAttribute("aria-hidden", "true");

    const description = document.createElement("div");
    description.className = "resource-description";

    const descriptionText = document.createElement("p");
    descriptionText.textContent = resource.description;
    description.appendChild(descriptionText);
    descriptionShell.appendChild(description);

    card.append(link, descriptionShell);

    const toggle = document.createElement("button");
    toggle.className = "side-button info-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-controls", descriptionId);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("aria-label", `Show details about ${resource.name}`);
    toggle.title = `Show details about ${resource.name}`;

    const questionMark = document.createElement("span");
    questionMark.className = "question-mark";
    questionMark.setAttribute("aria-hidden", "true");
    questionMark.textContent = "?";
    toggle.appendChild(questionMark);

    toggle.addEventListener("click", function () {
      const isOpen = item.classList.toggle("is-open");

      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-pressed", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        `${isOpen ? "Hide" : "Show"} details about ${resource.name}`
      );
      toggle.title = `${isOpen ? "Hide" : "Show"} details about ${resource.name}`;
      descriptionShell.setAttribute("aria-hidden", String(!isOpen));
    });

    item.append(card, toggle);
    return item;
  }

  function createEmailItem(email) {
    const item = document.createElement("li");
    item.className = "resource-item email-item";

    const emailField = document.createElement("div");
    emailField.className = "email-field";
    emailField.appendChild(
      createIcon(["fa-regular", "fa-envelope"], "resource-icon")
    );

    const label = document.createElement("label");
    label.className = "visually-hidden";
    label.htmlFor = "emailAddress";
    label.textContent = "Email address";

    const input = document.createElement("input");
    input.className = "email-input";
    input.id = "emailAddress";
    input.type = "email";
    input.value = email;
    input.readOnly = true;
    input.spellcheck = false;
    input.autocomplete = "email";

    input.addEventListener("click", function () {
      input.select();
    });

    emailField.addEventListener("click", function (event) {
      if (event.target !== input) {
        input.focus();
        input.select();
      }
    });

    emailField.append(label, input);

    const copyButton = document.createElement("button");
    copyButton.className = "side-button copy-button";
    copyButton.type = "button";
    copyButton.textContent = "Copy";
    copyButton.setAttribute("aria-label", "Copy email address");
    copyButton.title = "Copy email address";

    let resetTimer;

    copyButton.addEventListener("click", async function () {
      window.clearTimeout(resetTimer);

      try {
        await copyEmail(email, input);
        copyButton.classList.remove("is-error");
        copyButton.classList.add("is-success");
        copyButton.textContent = "Copied";
        copyButton.setAttribute("aria-label", "Email address copied");
        copyStatus.textContent = "Email address copied to clipboard.";
      } catch (error) {
        input.focus();
        input.select();
        copyButton.classList.remove("is-success");
        copyButton.classList.add("is-error");
        copyButton.textContent = "Select";
        copyButton.setAttribute("aria-label", "Email selected; press Control C to copy");
        copyStatus.textContent = "The email is selected. Press Control C to copy it.";
      }

      resetTimer = window.setTimeout(function () {
        copyButton.classList.remove("is-success", "is-error");
        copyButton.textContent = "Copy";
        copyButton.setAttribute("aria-label", "Copy email address");
        copyStatus.textContent = "";
      }, 2200);
    });

    item.append(emailField, copyButton);
    return item;
  }

  async function copyEmail(email, input) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
      return;
    }

    input.focus();
    input.select();

    if (!document.execCommand("copy")) {
      throw new Error("Copy command was unavailable.");
    }
  }
})();
