import { useId, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  verify: (password: string) => Promise<boolean>;
};

export function EditPasswordModal({ open, onClose, onSuccess, verify }: Props) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const ok = await verify(password);
      if (ok) {
        setPassword("");
        onSuccess();
        onClose();
      } else {
        setError("That password did not match.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={id}>
        <h2 id={id}>Unlock edit mode</h2>
        <p className="small">Enter the owner password to update content on this device.</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor={`${id}-pw`}>Password</label>
            <input
              id={`${id}-pw`}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
            />
          </div>
          {error ? (
            <p className="small" style={{ color: "var(--danger)", marginTop: "-0.5rem" }}>
              {error}
            </p>
          ) : null}
          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={onClose} disabled={pending}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={pending || !password}>
              {pending ? "Checking…" : "Unlock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
