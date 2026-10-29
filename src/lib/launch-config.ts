// Só habilite vendas depois de validar checkout, agenda e condições de participação.
export const launchConfig = {
  price: 250,
  targetPrice: 697,
  rounds: 10,
  participantsPerRound: 4,
  checkoutUrl: "",
  salesApproved: false,
  contactUrl:
    "https://wa.me/5585996983300?text=Quero%20conhecer%20o%20piloto%20Os%20Ressurgentes%20para%20homens%20e%20mulheres",
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
