import { Check, Loader2 } from "lucide-react";

/**
 * The save button, pinned to the bottom of long screens so it is always in
 * reach, with the result of the last save next to it.
 */
export function SaveBar({
  pending,
  state,
  label = "Enregistrer et publier",
  hint,
}: {
  pending: boolean;
  state: { error?: string; saved?: boolean };
  label?: string;
  hint?: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-border bg-[var(--admin-bg)]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="submit" disabled={pending} className="admin-button">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Enregistrement…" : label}
        </button>
        {state.error && !pending && (
          <p role="alert" className="text-sm font-medium text-[#8f3d22]">
            {state.error}
          </p>
        )}
        {state.saved && !pending && (
          <p role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2d5a3a]">
            <Check className="h-4 w-4" /> Enregistré — le site est à jour.
          </p>
        )}
        {hint && !state.error && !(state.saved && !pending) && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}
