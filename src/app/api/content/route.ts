import { NextResponse } from "next/server";
import { getSiteContent, isAdminAuthenticated } from "@/lib/content/server";
import { mergeWithDefaults } from "@/lib/content/storage";
import { writeSiteContent } from "@/lib/content/storage";
import type { Product, SiteContent } from "@/lib/content/types";

type ContentPatchBody = {
  patch?: Partial<SiteContent>;
  products?: {
    upsert?: Product[];
    deleteIds?: number[];
    order?: number[];
  };
};

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteContent>;
    const content = mergeWithDefaults(body);
    await writeSiteContent(content);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ContentPatchBody;
    const current = await getSiteContent();
    const merged = mergeWithDefaults({ ...current, ...(body.patch ?? {}) });

    if (body.products) {
      const deleteIds = new Set(body.products.deleteIds ?? []);
      const productsById = new Map<number, Product>();

      for (const product of current.products) {
        if (!deleteIds.has(product.id)) {
          productsById.set(product.id, product);
        }
      }

      for (const product of body.products.upsert ?? []) {
        productsById.set(product.id, product);
      }

      if (body.products.order?.length) {
        const ordered: Product[] = [];
        const seen = new Set<number>();

        for (const id of body.products.order) {
          const product = productsById.get(id);
          if (product) {
            ordered.push(product);
            seen.add(id);
          }
        }

        for (const product of productsById.values()) {
          if (!seen.has(product.id)) {
            ordered.push(product);
          }
        }

        merged.products = ordered;
      } else {
        merged.products = Array.from(productsById.values());
      }
    }

    await writeSiteContent(merged);
    return NextResponse.json({ ok: true, content: merged });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
