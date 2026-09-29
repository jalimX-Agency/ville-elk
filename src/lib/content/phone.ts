/** "33627874284" → "+33 6 27 87 42 84", the way a French or Moroccan number is read aloud. */
export function formatPhone(digits: string): string {
  const code = ["212", "33"].find((c) => digits.startsWith(c));
  if (!code) return `+${digits}`;
  const rest = digits.slice(code.length);
  return `+${code} ${rest.slice(0, 1)} ${rest.slice(1).replace(/(\d{2})(?=\d)/g, "$1 ")}`;
}
