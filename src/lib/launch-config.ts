// Só habilite vendas depois de validar checkout, agenda e condições de participação.
export const launchConfig = {
  participantsPerRound: 4,
  minimumParticipants: 1,
  eventDate: "2026-11-28",
  eventStart: "13:00",
  eventEnd: "17:00",
  eventTimeZone: "America/Sao_Paulo",
  eventPlatform: "Zoom",
  refundEmail: "rafonteles@gmail.com",
  checkoutUrl: "",
  salesApproved: false,
  contactUrl:
    "https://wa.me/5585996983300?text=Quero%20solicitar%20uma%20entrevista%20para%20Os%20Ressurgentes%20e%20conhecer%20a%20agenda%20e%20as%20condicoes",
  instagram: [
    { label: "@heroi.me", url: "https://www.instagram.com/heroi.me/" },
    { label: "@richardfonteles1", url: "https://www.instagram.com/richardfonteles1/" },
  ],
};

export function approvedCheckoutUrl() {
  if (!launchConfig.salesApproved || !launchConfig.checkoutUrl) return null;
  try {
    const url = new URL(launchConfig.checkoutUrl);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
