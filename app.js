/* global window, document */

(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  if (!data) {
    console.error("PORTFOLIO_DATA is missing. Check that data.js is loaded before app.js.");
    return;
  }

  const elName = document.getElementById("name");
  const elContacts = document.getElementById("contacts");
  const elSidebarBlocks = document.getElementById("sidebarBlocks");
  const elCards = document.getElementById("cards");

  if (elName) {
    elName.innerHTML = data.person.nameHtml;
  }

  if (elContacts) {
    elContacts.replaceChildren(...data.contacts.map(createContactItem));
  }

  if (elSidebarBlocks) {
    elSidebarBlocks.replaceChildren(...data.sidebarBlocks.map(createSidebarBlock));
  }

  if (elCards) {
    elCards.replaceChildren(...data.cards.map(createCard));
  }

  function createIcon(iconId) {
    const span = document.createElement("span");
    span.className = "contact-icon";
    span.setAttribute("aria-hidden", "true");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("icon");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    // "xlink:href" works everywhere; modern browsers also accept plain "href".
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${iconId}`);

    svg.appendChild(use);
    span.appendChild(svg);
    return span;
  }

  function createContactItem(contact) {
    const li = document.createElement("li");
    li.className = "contact-item";

    const a = document.createElement("a");
    a.className = "contact-link";
    a.href = contact.href;

    if (contact.external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    a.appendChild(createIcon(contact.icon));

    const text = document.createElement("span");
    text.className = "contact-link-text";
    text.textContent = contact.text;
    a.appendChild(text);

    li.appendChild(a);
    return li;
  }

function appendCardText(container, textData) {
  if (!textData) {
    return;
  }

  const paragraphs = Array.isArray(textData)
    ? textData
    : String(textData).split(/\r?\n+/);

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      continue;
    }

    const p = document.createElement("p");
    p.className = "card-text";
    p.textContent = paragraph.trim();

    container.appendChild(p);
  }
}

function createSidebarBlock(block) {
  const wrap = document.createElement("div");
  wrap.className = "sidebar-block";

  for (const pText of block.paragraphs) {
    const p = document.createElement("p");
    p.textContent = pText;
    wrap.appendChild(p);
  }

  return wrap;
}
  function createCard(card) {
    const article = document.createElement("article");
    article.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";

    const img = document.createElement("img");
    img.src = card.image.src;
    img.alt = card.image.alt;
    img.loading = "lazy";
    thumb.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = card.title;

    body.appendChild(title);
    appendCardText(body, card.text);

    if (card.links && card.links.length > 0) {
      const linksP = document.createElement("p");
      linksP.className = "card-links";

      for (const link of card.links) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.label;

        if (link.external) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }

        linksP.appendChild(a);
      }

      body.appendChild(linksP);
    }

    article.appendChild(thumb);
    article.appendChild(body);

    return article;
  }
})();