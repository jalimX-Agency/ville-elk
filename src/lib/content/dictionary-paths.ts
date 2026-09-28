/**
 * The dictionary as a flat list of editable fields, and the reverse: writing a
 * value back at a dot path. Shared by the site (to apply the owner's changes)
 * and the dashboard (to list what can be changed).
 */

export type FieldKind = "text" | "list";
export type Field = { path: string; kind: FieldKind };

type Tree = { [key: string]: unknown };

/** Every string, and every list of strings, in the dictionary. */
export function flatten(tree: unknown, prefix = ""): Field[] {
  if (typeof tree === "string") return [{ path: prefix, kind: "text" }];
  if (Array.isArray(tree)) {
    if (tree.every((item) => typeof item === "string")) return [{ path: prefix, kind: "list" }];
    return tree.flatMap((item, index) => flatten(item, prefix ? `${prefix}.${index}` : String(index)));
  }
  if (tree && typeof tree === "object") {
    return Object.entries(tree as Tree).flatMap(([key, value]) =>
      flatten(value, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [];
}

export function getAt(tree: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => {
    if (node === null || node === undefined) return undefined;
    return (node as Tree)[key];
  }, tree);
}

/**
 * Writes a value at a path that already exists, and only if it has the same
 * shape as what is there — a stored change can never add a field the pages do
 * not read, or turn a list into a string and break a page.
 */
export function setAt(tree: unknown, path: string, value: unknown): boolean {
  const keys = path.split(".");
  const last = keys.pop();
  if (last === undefined) return false;
  const parent = keys.reduce<unknown>((node, key) => {
    if (node === null || node === undefined) return undefined;
    return (node as Tree)[key];
  }, tree);
  if (!parent || typeof parent !== "object") return false;

  const current = (parent as Tree)[last];
  const sameShape =
    (typeof current === "string" && typeof value === "string") ||
    (Array.isArray(current) &&
      current.every((item) => typeof item === "string") &&
      Array.isArray(value) &&
      value.every((item) => typeof item === "string"));
  if (!sameShape) return false;

  (parent as Tree)[last] = value;
  return true;
}
