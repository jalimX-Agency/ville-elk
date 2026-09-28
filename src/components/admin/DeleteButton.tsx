/**
 * A deletion that asks twice: the first click only opens the confirmation.
 * Works without JavaScript, since it is a native <details> and a form.
 */
export function DeleteButton({
  action,
  id,
  what,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  what: string;
}) {
  return (
    <details className="mt-16 border-t border-border pt-6">
      <summary className="cursor-pointer text-sm text-[var(--terracotta-dark)]">Supprimer {what}</summary>
      <form action={action} className="mt-4 flex flex-wrap items-center gap-4">
        <input type="hidden" name="id" value={id} />
        <p className="text-sm text-muted-foreground">
          Cette action est définitive, dans les quatre langues.
        </p>
        <button type="submit" className="admin-button bg-[var(--terracotta-dark)]">
          Oui, supprimer
        </button>
      </form>
    </details>
  );
}
