/** Menü fiyatlarını Türk Lirası olarak gösterir (PDF menü panosu). */
export function formatPrice(amount: number): string {
  const rounded = Math.round(amount);
  const display = rounded === amount ? String(rounded) : amount.toFixed(2);
  return `${display} ₺`;
}
