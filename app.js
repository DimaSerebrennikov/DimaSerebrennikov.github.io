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

  function createGalleryImage(image, index, title) {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt || `${title} image ${index + 1}`;
    img.loading = "lazy";
    img.draggable = false;

    item.appendChild(img);
    return item;
  }

  function enableDragScroll(scroller) {
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    scroller.addEventListener("mousedown", function (event) {
      if (event.button !== 0) {
        return;
      }

      isDragging = true;
      startX = event.clientX;
      startScrollLeft = scroller.scrollLeft;
      scroller.classList.add("is-dragging");
      event.preventDefault();
    });

    window.addEventListener("mousemove", function (event) {
      if (!isDragging) {
        return;
      }

      const deltaX = event.clientX - startX;
      scroller.scrollLeft = startScrollLeft - deltaX;
    });

    function stopDrag() {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      scroller.classList.remove("is-dragging");
    }

    window.addEventListener("mouseup", stopDrag);
    scroller.addEventListener("mouseleave", stopDrag);
    window.addEventListener("blur", stopDrag);
  }

  function createCard(card) {
    const article = document.createElement("article");
    article.className = "card";

    const galleryWrap = document.createElement("div");
    galleryWrap.className = "card-gallery-wrap";

    const gallery = document.createElement("div");
    gallery.className = "card-gallery";
    gallery.setAttribute("aria-label", `${card.title} image gallery`);

    const images = Array.isArray(card.images) && card.images.length > 0
      ? card.images
      : (card.image ? [card.image] : []);

    gallery.replaceChildren(...images.map(function (image, index) {
      return createGalleryImage(image, index, card.title);
    }));

    enableDragScroll(gallery);
    galleryWrap.appendChild(gallery);

    if (images.length > 1) {
      const hint = document.createElement("div");
      hint.className = "card-gallery-hint";
      hint.setAttribute("aria-hidden", "true");
      hint.textContent = "↔";
      galleryWrap.appendChild(hint);
    }

    article.appendChild(galleryWrap);

    if (card.links && card.links.length > 0) {
      const footer = document.createElement("div");
      footer.className = "card-footer";

      const links = document.createElement("div");
      links.className = "card-links";

      for (const link of card.links) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.label;

        if (link.external) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }

        links.appendChild(a);
      }

      footer.appendChild(links);
      article.appendChild(footer);
    }

    return article;
  }
})();
