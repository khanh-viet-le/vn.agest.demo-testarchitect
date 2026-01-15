export function extractNumbers(text: string): number[] {
  const matches = text.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?/g);

  return matches ? matches.map((n) => Number(n.replace(/,/g, ""))) : [];
}
