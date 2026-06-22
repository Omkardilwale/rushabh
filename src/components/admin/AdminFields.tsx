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
