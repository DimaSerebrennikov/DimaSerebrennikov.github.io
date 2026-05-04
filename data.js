/* global window */

function createRepeatedImages(src, alt, count) {
  return Array.from({ length: count }, function (_, index) {
    return {
      src: src,
      alt: `${alt} ${index + 1}`
    };
  });
}

window.PORTFOLIO_DATA = {
  person: {
    nameHtml: "Dmytro<br>Serebrennikov"
  },

  contacts: [
    {
      kind: "telegram",
      icon: "i-telegram",
      href: "https://t.me/dima_serebrennikov",
      text: "Telegram",
      external: true
    },
    {
      kind: "linkedin",
      icon: "i-linkedin",
      href: "https://www.linkedin.com/in/dmytro-serebrennikov-74784a3a7/",
      text: "LinkedIn",
      external: true
    }
  ],

  sidebarBlocks: [
    {
      paragraphs: [
        "Links to all my materials are in this portfolio. dmytroserebrennikov@gmail.com"
      ]
    }
  ],

  cards: [
    {
      title: "Tool development",
              images: [
          { src: "img/Tool0.jpg", alt: "Tool 0" },
          { src: "img/Tool1.jpg", alt: "Tool 1" },
          { src: "img/Tool2.jpg", alt: "Tool 1" },
          { src: "img/Tool3.jpg", alt: "Tool 1" },
          { src: "img/Tool4.jpg", alt: "Tool 1" },
          { src: "img/Tool5.jpg", alt: "Tool 1" },
        ],
      links: [
        { href: "https://www.patreon.com/cw/DimaSerebrennikov", label: "Patreon", external: true },
        { href: "https://www.youtube.com/@dima_serebrennikov", label: "YouTube", external: true },
        { href: "https://www.reddit.com/u/DimaSerebrennikov/s/AXz3Sspb8o", label: "Reddit", external: true },
        { href: "https://www.instagram.com/dima_serebrennnikov?igsh=YXlwNXE0bXp1Yndp", label: "Instagram", external: true },
        { href: "https://www.tiktok.com/@dima.serebrenniko7?_r=1&_t=ZS-94AqnVVat4G", label: "Tiktok", external: true },
        { href: "https://x.com/dima_serebrenni", label: "Twitter", external: true }
      ]
    },
    {
      title: "Hypercasual game development",
                    images: [
          { src: "img/Game0.jpg", alt: "Tool 0" },
          { src: "img/Game1.jpg", alt: "Tool 1" },
          { src: "img/Game2.png", alt: "Tool 1" },
          { src: "img/Game3.jpg", alt: "Tool 1" },
          { src: "img/Game4.jpg", alt: "Tool 1" },
          { src: "img/Game5.jpg", alt: "Tool 1" },
        ],
      links: [
        { href: "https://dimaserebrennikov.itch.io/", label: "Itch.io", external: true },
        { href: "https://play.google.com/store/apps/dev?id=5035107287525947877", label: "Play Market", external: true },
        { href: "https://github.com/DimaSerebrennikov", label: "GitHub but I don't like free posting", external: true }
      ]
    },
    {
      title: "Work at Arthub",
                    images: [
          { src: "img/Vector0.jpg", alt: "Tool 0" },
          { src: "img/Vector1.jpg", alt: "Tool 1" },
          { src: "img/Vector2.jpg", alt: "Tool 1" },
          { src: "img/Vector3.jpg", alt: "Tool 1" }
        ],
      links: [
        {
          href: "https://www.shutterstock.com/ru/g/Denys+Serebrennikov",
          label: "Shutterstock",
          external: true
        },
                {
          href: "https://www.shutterstock.com/ru/g/ArtHub01",
          label: "Arthub",
          external: true
        },
      ]
    }
  ]
};
