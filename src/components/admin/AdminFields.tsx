"use client";

import { useRef, useState } from "react";

/** MongoDB BSON document hard limit (16MB). All site content lives in one document. */
export const MONGO_DOC_LIMIT_BYTES = 16 * 1024 * 1024;
/** Max size for a single uploaded image (base64 inflates ~33%, many images share one doc). */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function byteSize(str: string): number {
  if (typeof Blob !== "undefined") return new Blob([str]).size;
  return str.length;
}

function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)}MB`;
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isUploaded = value.startsWith("data:");

  async function handleFile(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError(
        `Image is ${formatMb(file.size)} — max ${formatMb(MAX_IMAGE_BYTES)}. ` +
          `Images are stored as base64 inside one MongoDB document (16MB limit), so keep them small or use a URL.`,
      );
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      if (byteSize(dataUrl) > MONGO_DOC_LIMIT_BYTES) {
        setError("Encoded image is too large to store. Choose a smaller image.");
        return;
      }

      onChange(dataUrl);
    } catch {
      setError("Could not read that file. Try again or paste a URL.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="text-sm">
      <span className="font-medium text-maroon">{label}</span>
      <div className="mt-1.5 flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gold/25 bg-cream">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-center text-[10px] text-foreground/40">
              No image
            </span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={isUploaded ? "" : value}
            placeholder={isUploaded ? "Uploaded image (base64 stored)" : "Paste image URL"}
            onChange={(e) => onChange(e.target.value)}
            disabled={isUploaded}
            className="w-full rounded-lg border border-gold/25 bg-white px-3 py-2 outline-none focus:border-maroon disabled:bg-cream/60 disabled:text-foreground/50"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded-full border border-maroon/25 bg-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-maroon transition-colors hover:bg-white disabled:opacity-60"
            >
              {busy ? "Uploading…" : isUploaded ? "Replace image" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setError("");
                }}
                className="text-xs font-semibold uppercase tracking-wider text-red-700"
              >
                Clear
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
                e.target.value = "";
              }}
            />
          </div>

          <p className="text-[11px] text-foreground/50">
            Upload an image (stored as base64, max {formatMb(MAX_IMAGE_BYTES)}) or paste a URL.
          </p>
          {error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-maroon">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-3 py-2 text-sm outline-none focus:border-maroon"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-maroon">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-3 py-2 text-sm outline-none focus:border-maroon"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-maroon">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-3 py-2 text-sm outline-none focus:border-maroon"
      />
    </label>
  );
}

export function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gold/20 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-maroon">{title}</h3>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-maroon/25 bg-cream px-4 py-2 text-xs font-semibold uppercase tracking-wider text-maroon transition-colors hover:border-maroon hover:bg-white"
    >
      + {label}
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 transition-colors hover:bg-red-100"
    >
      Remove
    </button>
  );
}

export function ItemCard({
  title,
  onRemove,
  canRemove = true,
  children,
}: {
  title: string;
  onRemove?: () => void;
  canRemove?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gold/15 bg-ivory/40 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-maroon">{title}</p>
        {canRemove && onRemove && <RemoveButton onClick={onRemove} />}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function LinkRowEditor({
  link,
  onChange,
  onRemove,
  canRemove = true,
}: {
  link: { label: string; href: string };
  onChange: (next: { label: string; href: string }) => void;
  onRemove?: () => void;
  canRemove?: boolean;
}) {
  return (
    <ItemCard
      title={link.label || "New link"}
      onRemove={onRemove}
      canRemove={canRemove}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <Field
          label="Label"
          value={link.label}
          onChange={(v) => onChange({ ...link, label: v })}
        />
        <Field
          label="Href"
          value={link.href}
          onChange={(v) => onChange({ ...link, href: v })}
        />
      </div>
    </ItemCard>
  );
}
