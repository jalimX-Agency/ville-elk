import { Trash2 } from "lucide-react";

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
    <details className="admin-card mt-10 border-[#e8cfc4] p-4 sm:p-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-[#8f3d22]">
        <Trash2 className="h-4 w-4" />
        Supprimer {what}
      </summary>
      <form action={action} className="mt-3 flex flex-wrap items-center gap-4">
        <input type="hidden" name="id" value={id} />
        <p className="text-sm text-muted-foreground">Cette action est définitive, dans les quatre langues.</p>
        <button type="submit" className="admin-button bg-[#8f3d22] hover:bg-[#6f2e19]">
          Oui, supprimer définitivement
        </button>
      </form>
    </details>
  );
}
