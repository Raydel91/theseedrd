/** URL de iframe embed de Google Maps a partir de una dirección (sin API key). */
export function googleMapsEmbedFromAddress(address: string): string {
  const q = encodeURIComponent(address.trim())
  return `https://maps.google.com/maps?q=${q}&output=embed`
}
