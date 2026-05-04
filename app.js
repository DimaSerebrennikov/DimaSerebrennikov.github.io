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


  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getMaxScrollLeft(scroller) {
    return Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  }

  function getGalleryWrap(scroller) {
    return scroller.parentElement;
  }

  const galleryGlowMaxPullDistance = 90;

  function setGalleryDragOffset(scroller, dragOffset) {
    scroller.style.setProperty("--gallery-drag-offset", `${dragOffset.toFixed(2)}px`);
  }

  function getGalleryGlowStrength(pullDistance) {
    const progress = clamp(pullDistance / galleryGlowMaxPullDistance, 0, 1);

    return progress * progress * (3 - 2 * progress);
  }

  function setGalleryEdgeGlow(scroller, leftGlow, rightGlow) {
    const galleryWrap = getGalleryWrap(scroller);

    if (!galleryWrap) {
      return;
    }

    galleryWrap.style.setProperty("--gallery-left-edge-opacity", leftGlow.toFixed(3));
    galleryWrap.style.setProperty("--gallery-right-edge-opacity", rightGlow.toFixed(3));
  }

  function setGalleryEdgeDragging(scroller, isEdgeDragging) {
    const galleryWrap = getGalleryWrap(scroller);

    if (!galleryWrap) {
      return;
    }

    galleryWrap.classList.toggle("is-edge-dragging", isEdgeDragging);
  }

  function updateGalleryDragFeedback(scroller, targetScrollLeft) {
    const maxScrollLeft = getMaxScrollLeft(scroller);
    const leftPullDistance = Math.max(0, -targetScrollLeft);
    const rightPullDistance = Math.max(0, targetScrollLeft - maxScrollLeft);
    const dragOffset = clamp((leftPullDistance - rightPullDistance) * 0.12, -14, 14);

    setGalleryDragOffset(scroller, dragOffset);
    setGalleryEdgeGlow(
      scroller,
      getGalleryGlowStrength(leftPullDistance),
      getGalleryGlowStrength(rightPullDistance)
    );
  }

  function resetGalleryDragFeedback(scroller) {
    setGalleryDragOffset(scroller, 0);
    setGalleryEdgeDragging(scroller, false);
    setGalleryEdgeGlow(scroller, 0, 0);
  }

  function enableDragScroll(scroller) {
    let isDragging = false;
    let activePointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    scroller.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      isDragging = true;
      activePointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = scroller.scrollLeft;
      scroller.classList.add("is-dragging");

      resetGalleryDragFeedback(scroller);
      setGalleryEdgeDragging(scroller, true);

      if (scroller.setPointerCapture) {
        scroller.setPointerCapture(activePointerId);
      }

      event.preventDefault();
    });

    scroller.addEventListener("pointermove", function (event) {
      if (!isDragging || event.pointerId !== activePointerId) {
        return;
      }

      const deltaX = event.clientX - startX;
      const targetScrollLeft = startScrollLeft - deltaX;
      const maxScrollLeft = getMaxScrollLeft(scroller);

      scroller.scrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft));

      updateGalleryDragFeedback(scroller, targetScrollLeft);
      event.preventDefault();
    });

    function stopDrag(event) {
      if (!isDragging) {
        return;
      }

      if (event && event.pointerId !== activePointerId) {
        return;
      }

      if (activePointerId !== null && scroller.hasPointerCapture && scroller.hasPointerCapture(activePointerId)) {
        scroller.releasePointerCapture(activePointerId);
      }

      isDragging = false;
      activePointerId = null;
      scroller.classList.remove("is-dragging");
      resetGalleryDragFeedback(scroller);
    }

    scroller.addEventListener("pointerup", stopDrag);
    scroller.addEventListener("pointercancel", stopDrag);
    scroller.addEventListener("lostpointercapture", stopDrag);
    window.addEventListener("blur", function () {
      stopDrag();
    });
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

    const galleryNodes = images.map(function (image, index) {
      return createGalleryImage(image, index, card.title);
    });

    if (images.length > 1) {
      galleryWrap.classList.add("has-edge-gradient");
    }

    gallery.replaceChildren(...galleryNodes);

    enableDragScroll(gallery);
    galleryWrap.appendChild(gallery);

    if (images.length > 1) {
      const hint = document.createElement("div");
      hint.className = "card-gallery-hint";
      hint.setAttribute("aria-hidden", "true");

      const hintIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      hintIcon.setAttribute("viewBox", "0 0 24 24");
      hintIcon.setAttribute("focusable", "false");

      const hintPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      hintPath.setAttribute("d", "M5 12h14M9 8l-4 4 4 4M15 8l4 4-4 4");
      hintPath.setAttribute("fill", "none");
      hintPath.setAttribute("stroke", "currentColor");
      hintPath.setAttribute("stroke-width", "2");
      hintPath.setAttribute("stroke-linecap", "round");
      hintPath.setAttribute("stroke-linejoin", "round");

      hintIcon.appendChild(hintPath);
      hint.appendChild(hintIcon);
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
