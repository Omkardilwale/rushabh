"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  emptyCategory,
  emptyCollection,
  emptyConsultationOption,
  emptyHeroSlide,
  emptyHeroStat,
  emptyOccasion,
  emptyProduct,
  emptyTestimonial,
  emptyTrustFeature,
  nextProductId,
} from "@/components/admin/admin-templates";
import {
  canSyncRates,
  estimatedMonthlySyncs,
  GOLDAPI_CALLS_PER_SYNC,
  GOLDAPI_MIN_SYNC_INTERVAL_HOURS,
  GOLDAPI_MONTHLY_LIMIT,
} from "@/lib/rates/goldapi";
import {
  AddButton,
  byteSize,
  Field,
  ImageField,
  ItemCard,
  MONGO_DOC_LIMIT_BYTES,
  SectionCard,
  SelectField,
  TextArea,
  VERCEL_PAYLOAD_LIMIT_BYTES,
} from "@/components/admin/AdminFields";
import { useSiteContent } from "@/context/ContentContext";
import { computeProductPrice, formatPrice, getProductUnit } from "@/lib/data";
import type { ProductRateType, SiteContent } from "@/lib/content/types";

const rateTypeOptions: { value: ProductRateType; label: string }[] = [
  { value: "gold24k", label: "24K Gold (live rate × weight in g)" },
  { value: "gold22k", label: "22K Gold (live rate × weight in g)" },
  { value: "gold18k", label: "18K Gold (live rate × weight in g)" },
  { value: "silver", label: "Silver 999 (live rate × weight in g)" },
  { value: "diamond", label: "Diamond (rate × weight in carats)" },
  { value: "none", label: "Manual — use base price below" },
];

const tabs = [
  { id: "site", label: "Site & Contact" },
  { id: "store", label: "Store & Rates" },
  { id: "hero", label: "Hero" },
  { id: "catalog", label: "Catalog" },
  { id: "marketing", label: "Marketing" },
  { id: "shop", label: "Shop Page" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, i) => i !== index);
}

export function AdminDashboard() {
  const router = useRouter();
  const { content: liveContent, updateContent, refresh } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(liveContent);
  const [tab, setTab] = useState<TabId>("site");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [ratesSyncing, setRatesSyncing] = useState(false);
  const [ratesSyncMessage, setRatesSyncMessage] = useState("");

  useEffect(() => {
    setDraft(liveContent);
  }, [liveContent]);

  const patch = useCallback(
    <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  async function handleSave() {
    setMessage("");

    const payload = JSON.stringify(draft);
    const size = byteSize(payload);
    if (size > MONGO_DOC_LIMIT_BYTES) {
      setMessage(
        `Content is ${(size / 1024 / 1024).toFixed(1)}MB, over MongoDB's 16MB document limit. ` +
          `Remove or shrink some uploaded images, or use image URLs instead.`,
      );
      return;
    }
    if (size > VERCEL_PAYLOAD_LIMIT_BYTES) {
      setMessage(
        `Content is ${(size / 1024 / 1024).toFixed(1)}MB — too large to save (${(VERCEL_PAYLOAD_LIMIT_BYTES / 1024 / 1024).toFixed(0)}MB server limit). ` +
          `Replace some uploaded images with URLs, or remove unused images, then save again.`,
      );
      return;
    }

    setSaving(true);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    setSaving(false);
    if (!res.ok) {
      if (res.status === 413) {
        setMessage(
          "Save failed: request too large for the server. Use fewer/smaller uploaded images or paste image URLs instead.",
        );
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setMessage(data.error ?? "Save failed");
      return;
    }
    const data = (await res.json()) as { content: SiteContent };
    updateContent(data.content);
    await refresh();
    setMessage("Saved successfully. Changes are live.");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const ratesThrottle = canSyncRates(draft.store.ratesLastSyncedAt);

  async function handleSyncRates() {
    setRatesSyncing(true);
    setRatesSyncMessage("");
    try {
      const res = await fetch("/api/rates/sync?force=1", { method: "POST" });
      const data = (await res.json()) as {
        error?: string;
        skipped?: boolean;
        reason?: string;
        content?: SiteContent["store"];
      };
      if (!res.ok) {
        setRatesSyncMessage(data.error ?? "Sync failed");
        return;
      }
      if (data.skipped) {
        setRatesSyncMessage(data.reason ?? "Sync skipped");
        return;
      }
      if (data.content) {
        setDraft((prev) => ({ ...prev, store: data.content! }));
        updateContent({ ...liveContent, store: data.content });
      }
      await refresh();
      setRatesSyncMessage("Rates synced from GoldAPI.io.");
    } catch {
      setRatesSyncMessage("Sync failed — check GOLDAPI_KEY in env.");
    } finally {
      setRatesSyncing(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Rushabh Admin
            </p>
            <h1 className="font-serif text-2xl text-maroon">Website Manager</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="rounded-full border border-maroon/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-maroon hover:bg-cream"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-full border border-maroon/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-maroon hover:bg-cream"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-full gold-gradient px-6 py-2 text-xs font-semibold uppercase tracking-wider text-maroon-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save all changes"}
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 lg:px-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                tab === t.id
                  ? "bg-maroon text-white"
                  : "bg-white text-maroon hover:bg-cream"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-8">
        {message && (
          <p
            className={`rounded-lg px-4 py-3 text-sm ${
              message.includes("failed")
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-800"
            }`}
          >
            {message}
          </p>
        )}

        {tab === "site" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Brand">
              <Field label="Site name" value={draft.site.name} onChange={(v) => patch("site", { ...draft.site, name: v })} />
              <Field label="Short name" value={draft.site.shortName} onChange={(v) => patch("site", { ...draft.site, shortName: v })} />
              <Field label="Tagline" value={draft.site.tagline} onChange={(v) => patch("site", { ...draft.site, tagline: v })} />
              <Field label="Site URL" value={draft.site.url} onChange={(v) => patch("site", { ...draft.site, url: v })} />
              <Field label="Logo letter" value={draft.site.logoLetter} onChange={(v) => patch("site", { ...draft.site, logoLetter: v })} />
              <TextArea label="SEO description" value={draft.site.description} onChange={(v) => patch("site", { ...draft.site, description: v })} rows={4} />
              <TextArea label="Brand blurb (footer)" value={draft.site.brandBlurb} onChange={(v) => patch("site", { ...draft.site, brandBlurb: v })} rows={3} />
            </SectionCard>
            <SectionCard title="Contact">
              <Field label="Enquiry email" value={draft.contact.enquiryEmail} onChange={(v) => patch("contact", { ...draft.contact, enquiryEmail: v })} />
              <Field label="WhatsApp number" value={draft.contact.whatsappNumber} onChange={(v) => patch("contact", { ...draft.contact, whatsappNumber: v })} />
              <Field label="Phone (optional)" value={draft.contact.contactPhone} onChange={(v) => patch("contact", { ...draft.contact, contactPhone: v })} />
            </SectionCard>
          </div>
        )}

        {tab === "store" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Metal rates"
              action={
                <button
                  type="button"
                  disabled={ratesSyncing || !ratesThrottle.allowed}
                  onClick={() => void handleSyncRates()}
                  className="rounded-full border border-maroon/25 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-maroon hover:bg-cream disabled:opacity-60"
                  title={
                    !ratesThrottle.allowed
                      ? ratesThrottle.reason
                      : undefined
                  }
                >
                  {ratesSyncing
                    ? "Syncing…"
                    : !ratesThrottle.allowed
                      ? `Wait ${ratesThrottle.hoursRemaining}h`
                      : "Sync now"}
                </button>
              }
            >
              <label className="block text-sm">
                <span className="font-medium text-maroon">Rate source</span>
                <select
                  value={draft.store.ratesMode}
                  onChange={(e) =>
                    patch("store", {
                      ...draft.store,
                      ratesMode: e.target.value as "manual" | "auto",
                    })
                  }
                  className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-3 py-2 text-sm outline-none focus:border-maroon"
                >
                  <option value="manual">Manual — you edit rates below</option>
                  <option value="auto">Auto — GoldAPI daily sync + manual Sync now</option>
                </select>
              </label>
              <p className="text-xs text-foreground/55">
                GoldAPI.io free tier: {GOLDAPI_MONTHLY_LIMIT} calls/month (
                {GOLDAPI_CALLS_PER_SYNC} per sync ≈ {estimatedMonthlySyncs()} syncs max).
                Auto mode syncs once daily at ~10:30 AM IST, throttled to 1 sync every{" "}
                {GOLDAPI_MIN_SYNC_INTERVAL_HOURS}h. Sign up at{" "}
                <a
                  href="https://www.goldapi.io/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-maroon underline"
                >
                  goldapi.io
                </a>{" "}
                and add <code className="text-[11px]">GOLDAPI_KEY</code> to env.
                {draft.store.ratesLastSyncedAt && (
                  <>
                    {" "}
                    Last sync:{" "}
                    {new Date(draft.store.ratesLastSyncedAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                    {!ratesThrottle.allowed && (
                      <> — next sync in ~{ratesThrottle.hoursRemaining}h</>
                    )}
                  </>
                )}
              </p>
              {ratesSyncMessage && (
                <p
                  className={`text-xs ${
                    ratesSyncMessage.includes("failed") || ratesSyncMessage.includes("error")
                      ? "text-red-600"
                      : "text-green-700"
                  }`}
                >
                  {ratesSyncMessage}
                </p>
              )}
              <Field
                label="24K gold (₹/g)"
                type="number"
                value={draft.store.goldRate.rate24k}
                onChange={(v) =>
                  patch("store", {
                    ...draft.store,
                    goldRate: { ...draft.store.goldRate, rate24k: Number(v) },
                  })
                }
              />
              <Field
                label="22K gold (₹/g)"
                type="number"
                value={draft.store.goldRate.rate22k}
                onChange={(v) =>
                  patch("store", {
                    ...draft.store,
                    goldRate: { ...draft.store.goldRate, rate22k: Number(v) },
                  })
                }
              />
              <Field
                label="18K gold (₹/g)"
                type="number"
                value={draft.store.goldRate.rate18k}
                onChange={(v) =>
                  patch("store", {
                    ...draft.store,
                    goldRate: { ...draft.store.goldRate, rate18k: Number(v) },
                  })
                }
              />
              <Field
                label="Silver 999 (₹/g)"
                type="number"
                value={draft.store.silverRate.rate999}
                onChange={(v) =>
                  patch("store", {
                    ...draft.store,
                    silverRate: { ...draft.store.silverRate, rate999: Number(v) },
                  })
                }
              />
              <Field
                label="Diamond (₹/carat)"
                type="number"
                value={draft.store.diamondRate.ratePerCarat}
                onChange={(v) =>
                  patch("store", {
                    ...draft.store,
                    diamondRate: {
                      ...draft.store.diamondRate,
                      ratePerCarat: Number(v),
                    },
                  })
                }
              />
              <Field
                label="Rates updated label"
                value={draft.store.goldRate.updatedAt}
                onChange={(v) =>
                  patch("store", {
                    ...draft.store,
                    goldRate: { ...draft.store.goldRate, updatedAt: v },
                    silverRate: { ...draft.store.silverRate, updatedAt: v },
                  })
                }
              />
              <Field
                label="Diamond ticker line (manual)"
                value={draft.store.diamondRateLabel}
                onChange={(v) =>
                  patch("store", { ...draft.store, diamondRateLabel: v })
                }
              />
            </SectionCard>
            <SectionCard title="Promo & shipping">
              <Field label="Promo code" value={draft.store.promo.code} onChange={(v) => patch("store", { ...draft.store, promo: { ...draft.store.promo, code: v } })} />
              <Field label="Discount (₹)" type="number" value={draft.store.promo.discount} onChange={(v) => patch("store", { ...draft.store, promo: { ...draft.store.promo, discount: Number(v) } })} />
              <Field label="Free shipping above (₹)" type="number" value={draft.store.freeShippingThreshold} onChange={(v) => patch("store", { ...draft.store, freeShippingThreshold: Number(v) })} />
              <Field label="Store location text" value={draft.store.storeLocation} onChange={(v) => patch("store", { ...draft.store, storeLocation: v })} />
              <TextArea label="Ticker extras (one per line)" value={draft.store.tickerExtras.join("\n")} onChange={(v) => patch("store", { ...draft.store, tickerExtras: v.split("\n").filter(Boolean) })} />
              <TextArea label="Marquee extras (one per line)" value={draft.store.marqueeExtras.join("\n")} onChange={(v) => patch("store", { ...draft.store, marqueeExtras: v.split("\n").filter(Boolean) })} />
            </SectionCard>
          </div>
        )}

        {tab === "hero" && (
          <div className="space-y-6">
            <SectionCard
              title="Hero slides"
              action={
                <AddButton
                  label="Add slide"
                  onClick={() =>
                    patch("hero", {
                      ...draft.hero,
                      slides: [emptyHeroSlide(), ...draft.hero.slides],
                    })
                  }
                />
              }
            >
              {draft.hero.slides.map((slide, i) => (
                <ItemCard
                  key={`slide-${i}`}
                  title={`Slide ${i + 1}`}
                  onRemove={() =>
                    patch("hero", {
                      ...draft.hero,
                      slides: removeAt(draft.hero.slides, i),
                    })
                  }
                  canRemove={draft.hero.slides.length > 1}
                >
                  <ImageField label="Image" value={slide.image} onChange={(v) => { const slides = [...draft.hero.slides]; slides[i] = { ...slide, image: v }; patch("hero", { ...draft.hero, slides }); }} />
                  <Field label="Tagline" value={slide.tagline} onChange={(v) => { const slides = [...draft.hero.slides]; slides[i] = { ...slide, tagline: v }; patch("hero", { ...draft.hero, slides }); }} />
                  <Field label="Title" value={slide.title} onChange={(v) => { const slides = [...draft.hero.slides]; slides[i] = { ...slide, title: v }; patch("hero", { ...draft.hero, slides }); }} />
                  <Field label="Accent" value={slide.accent} onChange={(v) => { const slides = [...draft.hero.slides]; slides[i] = { ...slide, accent: v }; patch("hero", { ...draft.hero, slides }); }} />
                  <Field label="Subtitle" value={slide.subtitle} onChange={(v) => { const slides = [...draft.hero.slides]; slides[i] = { ...slide, subtitle: v }; patch("hero", { ...draft.hero, slides }); }} />
                  <TextArea label="Description" value={slide.description} onChange={(v) => { const slides = [...draft.hero.slides]; slides[i] = { ...slide, description: v }; patch("hero", { ...draft.hero, slides }); }} />
                </ItemCard>
              ))}
            </SectionCard>

            <SectionCard
              title="Hero stats"
              action={
                <AddButton
                  label="Add stat"
                  onClick={() =>
                    patch("hero", {
                      ...draft.hero,
                      stats: [emptyHeroStat(), ...draft.hero.stats],
                    })
                  }
                />
              }
            >
              {draft.hero.stats.map((stat, i) => (
                <ItemCard
                  key={`stat-${i}`}
                  title={`Stat ${i + 1}`}
                  onRemove={() =>
                    patch("hero", {
                      ...draft.hero,
                      stats: removeAt(draft.hero.stats, i),
                    })
                  }
                  canRemove={draft.hero.stats.length > 1}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Value" value={stat.value} onChange={(v) => { const stats = [...draft.hero.stats]; stats[i] = { ...stat, value: v }; patch("hero", { ...draft.hero, stats }); }} />
                    <Field label="Label" value={stat.label} onChange={(v) => { const stats = [...draft.hero.stats]; stats[i] = { ...stat, label: v }; patch("hero", { ...draft.hero, stats }); }} />
                  </div>
                </ItemCard>
              ))}
              <Field label="Primary CTA label" value={draft.hero.primaryCta.label} onChange={(v) => patch("hero", { ...draft.hero, primaryCta: { ...draft.hero.primaryCta, label: v } })} />
              <Field label="Primary CTA link" value={draft.hero.primaryCta.href} onChange={(v) => patch("hero", { ...draft.hero, primaryCta: { ...draft.hero.primaryCta, href: v } })} />
              <Field label="Secondary CTA label" value={draft.hero.secondaryCta.label} onChange={(v) => patch("hero", { ...draft.hero, secondaryCta: { ...draft.hero.secondaryCta, label: v } })} />
              <Field label="Secondary CTA link" value={draft.hero.secondaryCta.href} onChange={(v) => patch("hero", { ...draft.hero, secondaryCta: { ...draft.hero.secondaryCta, href: v } })} />
            </SectionCard>
          </div>
        )}

        {tab === "catalog" && (
          <div className="space-y-6">
            <SectionCard
              title="Products"
              action={
                <AddButton
                  label="Add product"
                  onClick={() =>
                    patch("products", [
                      emptyProduct(nextProductId(draft.products)),
                      ...draft.products,
                    ])
                  }
                />
              }
            >
              {draft.products.map((product, i) => {
                const computed = computeProductPrice(product, draft.store);
                const unit = getProductUnit(product.rateType);
                const usesLiveRate =
                  Boolean(product.weight && product.weight > 0) &&
                  product.rateType !== "none" &&
                  product.rateType !== undefined;
                return (
                <ItemCard
                  key={product.id}
                  title={`#${product.id} ${product.name}`}
                  onRemove={() => patch("products", removeAt(draft.products, i))}
                  canRemove={draft.products.length > 1}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" value={product.name} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, name: v }; patch("products", products); }} />
                    <Field label="Category" value={product.category} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, category: v }; patch("products", products); }} />
                    <Field label="Metal" value={product.metal} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, metal: v }; patch("products", products); }} />
                    <Field label={`Weight (${unit === "ct" ? "carats" : "grams"})`} type="number" value={product.weight ?? ""} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, weight: v ? Number(v) : undefined }; patch("products", products); }} />
                    <SelectField label="Price source" value={product.rateType ?? "none"} options={rateTypeOptions} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, rateType: v as ProductRateType }; patch("products", products); }} />
                    <Field label="Custom charges (₹)" type="number" value={product.makingCharges ?? ""} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, makingCharges: v ? Number(v) : undefined }; patch("products", products); }} />
                    <Field label={usesLiveRate ? "Base price (fallback)" : "Price (₹)"} type="number" value={product.price} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, price: Number(v) }; patch("products", products); }} />
                    <Field label="Original price (strike-through)" type="number" value={product.originalPrice ?? ""} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, originalPrice: v ? Number(v) : undefined }; patch("products", products); }} />
                    <Field label="Rating" type="number" value={product.rating} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, rating: Number(v) }; patch("products", products); }} />
                    <Field label="Badge" value={product.badge ?? ""} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, badge: v || undefined }; patch("products", products); }} />
                    <ImageField label="Image" value={product.image} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, image: v }; patch("products", products); }} />
                  </div>
                  <div className="rounded-lg border border-gold/25 bg-cream/60 px-3 py-2 text-sm">
                    <span className="font-medium text-maroon">Today&apos;s total on website: </span>
                    <span className="font-semibold text-maroon">{formatPrice(computed)}</span>
                    {usesLiveRate && (
                      <span className="ml-1 text-xs text-foreground/55">
                        ({product.weight} {unit} × live rate + {formatPrice(product.makingCharges ?? 0)} charges)
                      </span>
                    )}
                  </div>
                  <TextArea label="Description (optional)" value={product.description ?? ""} onChange={(v) => { const products = [...draft.products]; products[i] = { ...product, description: v || undefined }; patch("products", products); }} />
                </ItemCard>
                );
              })}
            </SectionCard>

            <SectionCard
              title="Categories"
              action={
                <AddButton
                  label="Add category"
                  onClick={() =>
                    patch("categories", [
                      emptyCategory(draft.categories.map((c) => c.slug)),
                      ...draft.categories,
                    ])
                  }
                />
              }
            >
              {draft.categories.map((cat, i) => (
                <ItemCard
                  key={`${cat.slug}-${i}`}
                  title={cat.name}
                  onRemove={() => patch("categories", removeAt(draft.categories, i))}
                  canRemove={draft.categories.length > 1}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" value={cat.name} onChange={(v) => { const categories = [...draft.categories]; categories[i] = { ...cat, name: v }; patch("categories", categories); }} />
                    <Field label="Slug" value={cat.slug} onChange={(v) => { const categories = [...draft.categories]; categories[i] = { ...cat, slug: v }; patch("categories", categories); }} />
                    <Field label="Count" type="number" value={cat.count} onChange={(v) => { const categories = [...draft.categories]; categories[i] = { ...cat, count: Number(v) }; patch("categories", categories); }} />
                    <ImageField label="Image" value={cat.image} onChange={(v) => { const categories = [...draft.categories]; categories[i] = { ...cat, image: v }; patch("categories", categories); }} />
                  </div>
                </ItemCard>
              ))}
            </SectionCard>

            <SectionCard
              title="Collections"
              action={
                <AddButton
                  label="Add collection"
                  onClick={() =>
                    patch("collections", [emptyCollection(), ...draft.collections])
                  }
                />
              }
            >
              {draft.collections.map((col, i) => (
                <ItemCard
                  key={`collection-${i}`}
                  title={col.name}
                  onRemove={() => patch("collections", removeAt(draft.collections, i))}
                  canRemove={draft.collections.length > 1}
                >
                  <Field label="Name" value={col.name} onChange={(v) => { const collections = [...draft.collections]; collections[i] = { ...col, name: v }; patch("collections", collections); }} />
                  <TextArea label="Description" value={col.description} onChange={(v) => { const collections = [...draft.collections]; collections[i] = { ...col, description: v }; patch("collections", collections); }} />
                  <Field label="Tag" value={col.tag} onChange={(v) => { const collections = [...draft.collections]; collections[i] = { ...col, tag: v }; patch("collections", collections); }} />
                  <ImageField label="Image" value={col.image} onChange={(v) => { const collections = [...draft.collections]; collections[i] = { ...col, image: v }; patch("collections", collections); }} />
                </ItemCard>
              ))}
            </SectionCard>
          </div>
        )}

        {tab === "marketing" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Section headings">
              {Object.entries(draft.sections).map(([key, section]) => (
                <div key={key} className="rounded-lg border border-gold/10 p-3">
                  <p className="mb-2 text-xs font-bold uppercase text-gold-dark">{key}</p>
                  <Field label="Eyebrow" value={section.eyebrow ?? ""} onChange={(v) => patch("sections", { ...draft.sections, [key]: { ...section, eyebrow: v } })} />
                  <Field label="Heading" value={section.heading} onChange={(v) => patch("sections", { ...draft.sections, [key]: { ...section, heading: v } })} />
                  <TextArea label="Subtitle" value={section.subtitle ?? ""} onChange={(v) => patch("sections", { ...draft.sections, [key]: { ...section, subtitle: v } })} />
                  <Field label="CTA label" value={section.ctaLabel ?? ""} onChange={(v) => patch("sections", { ...draft.sections, [key]: { ...section, ctaLabel: v } })} />
                  <Field label="CTA link" value={section.ctaHref ?? ""} onChange={(v) => patch("sections", { ...draft.sections, [key]: { ...section, ctaHref: v } })} />
                </div>
              ))}
            </SectionCard>

            <SectionCard
              title="Testimonials"
              action={
                <AddButton
                  label="Add testimonial"
                  onClick={() =>
                    patch("testimonials", [emptyTestimonial(), ...draft.testimonials])
                  }
                />
              }
            >
              {draft.testimonials.map((t, i) => (
                <ItemCard
                  key={`testimonial-${i}`}
                  title={t.name}
                  onRemove={() => patch("testimonials", removeAt(draft.testimonials, i))}
                >
                  <Field label="Name" value={t.name} onChange={(v) => { const testimonials = [...draft.testimonials]; testimonials[i] = { ...t, name: v }; patch("testimonials", testimonials); }} />
                  <Field label="Location" value={t.location} onChange={(v) => { const testimonials = [...draft.testimonials]; testimonials[i] = { ...t, location: v }; patch("testimonials", testimonials); }} />
                  <Field label="Rating" type="number" value={t.rating} onChange={(v) => { const testimonials = [...draft.testimonials]; testimonials[i] = { ...t, rating: Number(v) }; patch("testimonials", testimonials); }} />
                  <TextArea label="Quote" value={t.text} onChange={(v) => { const testimonials = [...draft.testimonials]; testimonials[i] = { ...t, text: v }; patch("testimonials", testimonials); }} />
                </ItemCard>
              ))}
            </SectionCard>

            <SectionCard
              title="Trust badges"
              action={
                <AddButton
                  label="Add badge"
                  onClick={() =>
                    patch("trustFeatures", [emptyTrustFeature(), ...draft.trustFeatures])
                  }
                />
              }
            >
              {draft.trustFeatures.map((f, i) => (
                <ItemCard
                  key={`trust-${i}`}
                  title={f.title}
                  onRemove={() => patch("trustFeatures", removeAt(draft.trustFeatures, i))}
                >
                  <Field label="Title" value={f.title} onChange={(v) => { const trustFeatures = [...draft.trustFeatures]; trustFeatures[i] = { ...f, title: v }; patch("trustFeatures", trustFeatures); }} />
                  <Field label="Description" value={f.description} onChange={(v) => { const trustFeatures = [...draft.trustFeatures]; trustFeatures[i] = { ...f, description: v }; patch("trustFeatures", trustFeatures); }} />
                  <label className="block text-sm">
                    <span className="font-medium text-maroon">Icon</span>
                    <select
                      value={f.icon}
                      onChange={(e) => {
                        const trustFeatures = [...draft.trustFeatures];
                        trustFeatures[i] = { ...f, icon: e.target.value as typeof f.icon };
                        patch("trustFeatures", trustFeatures);
                      }}
                      className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-3 py-2 text-sm outline-none focus:border-maroon"
                    >
                      <option value="shield">Shield</option>
                      <option value="refresh">Refresh</option>
                      <option value="truck">Truck</option>
                      <option value="rotate">Rotate</option>
                    </select>
                  </label>
                </ItemCard>
              ))}
            </SectionCard>

            <SectionCard
              title="Occasions"
              action={
                <AddButton
                  label="Add occasion"
                  onClick={() => patch("occasions", [emptyOccasion(), ...draft.occasions])}
                />
              }
            >
              {draft.occasions.map((o, i) => (
                <ItemCard
                  key={`occasion-${i}`}
                  title={o.name}
                  onRemove={() => patch("occasions", removeAt(draft.occasions, i))}
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="Name" value={o.name} onChange={(v) => { const occasions = [...draft.occasions]; occasions[i] = { ...o, name: v }; patch("occasions", occasions); }} />
                    <Field label="Count label" value={o.count} onChange={(v) => { const occasions = [...draft.occasions]; occasions[i] = { ...o, count: v }; patch("occasions", occasions); }} />
                  </div>
                </ItemCard>
              ))}
            </SectionCard>

            <SectionCard
              title="Consultation cards"
              action={
                <AddButton
                  label="Add card"
                  onClick={() =>
                    patch("consultation", {
                      options: [emptyConsultationOption(), ...draft.consultation.options],
                    })
                  }
                />
              }
            >
              {draft.consultation.options.map((opt, i) => (
                <ItemCard
                  key={`consultation-${i}`}
                  title={opt.title}
                  onRemove={() =>
                    patch("consultation", {
                      options: removeAt(draft.consultation.options, i),
                    })
                  }
                  canRemove={draft.consultation.options.length > 1}
                >
                  <label className="block text-sm">
                    <span className="font-medium text-maroon">Type</span>
                    <select
                      value={opt.type}
                      onChange={(e) => {
                        const options = [...draft.consultation.options];
                        options[i] = { ...opt, type: e.target.value as typeof opt.type };
                        patch("consultation", { options });
                      }}
                      className="mt-1.5 w-full rounded-lg border border-gold/25 bg-white px-3 py-2 text-sm outline-none focus:border-maroon"
                    >
                      <option value="video">Video</option>
                      <option value="appointment">Appointment</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="callback">Callback</option>
                    </select>
                  </label>
                  <Field label="Title" value={opt.title} onChange={(v) => { const options = [...draft.consultation.options]; options[i] = { ...opt, title: v }; patch("consultation", { options }); }} />
                  <TextArea label="Description" value={opt.description} onChange={(v) => { const options = [...draft.consultation.options]; options[i] = { ...opt, description: v }; patch("consultation", { options }); }} />
                  <Field label="CTA" value={opt.cta} onChange={(v) => { const options = [...draft.consultation.options]; options[i] = { ...opt, cta: v }; patch("consultation", { options }); }} />
                </ItemCard>
              ))}
            </SectionCard>
          </div>
        )}

        {tab === "shop" && (
          <SectionCard title="Shop page">
            <ImageField label="Banner image" value={draft.shop.bannerImage} onChange={(v) => patch("shop", { ...draft.shop, bannerImage: v })} />
            <TextArea label="Metal filters (comma separated)" value={draft.shop.metalFilters.join(", ")} onChange={(v) => patch("shop", { ...draft.shop, metalFilters: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <Field label="Empty state title" value={draft.shop.emptyTitle} onChange={(v) => patch("shop", { ...draft.shop, emptyTitle: v })} />
            <Field label="Empty state message" value={draft.shop.emptyMessage} onChange={(v) => patch("shop", { ...draft.shop, emptyMessage: v })} />
            <TextArea label="Product default description" value={draft.productDetail.defaultDescription} onChange={(v) => patch("productDetail", { ...draft.productDetail, defaultDescription: v })} rows={4} />
            <TextArea label="Trust chips (one per line)" value={draft.productDetail.trustChips.join("\n")} onChange={(v) => patch("productDetail", { ...draft.productDetail, trustChips: v.split("\n").filter(Boolean) })} />
            <TextArea label="Enquiry message template — greeting line" value={draft.enquiry.cartGreeting} onChange={(v) => patch("enquiry", { ...draft.enquiry, cartGreeting: v })} />
            <TextArea label="Enquiry closing lines" value={draft.enquiry.cartClosing} onChange={(v) => patch("enquiry", { ...draft.enquiry, cartClosing: v })} />
          </SectionCard>
        )}
      </main>
    </div>
  );
}
