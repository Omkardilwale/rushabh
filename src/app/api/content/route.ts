import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSiteContentResult, isAdminAuthenticated } from "@/lib/content/server";
import { mergeWithDefaults, writeSiteContent } from "@/lib/content/storage";
import type { Product, SiteContent } from "@/lib/content/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 20;

function jsonNoStore(
  data: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      ...extraHeaders,
    },
  });
}

function revalidatePublicPages() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
}

type ContentPatchBody = {
  patch?: Partial<SiteContent>;
  products?: {
    upsert?: Product[];
    deleteIds?: number[];
    order?: number[];
  };
};

export async function GET() {
  const { content, source } = await getSiteContentResult();
  return jsonNoStore(content, 200, { "X-Content-Source": source });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return jsonNoStore({ error: "Unauthorized" }, 401);
  }

  try {
    const loaded = await getSiteContentResult();
    if (loaded.source === "defaults") {
      return jsonNoStore(
        {
          error:
            "rushabh.data.json could not be read, so save was blocked. Check that the file exists in the project root.",
        },
        503,
      );
    }
    const body = (await request.json()) as Partial<SiteContent>;
    const content = mergeWithDefaults(body);
    await writeSiteContent(content);
    revalidatePublicPages();
    return jsonNoStore({ ok: true, content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content";
    return jsonNoStore({ error: message }, 500);
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return jsonNoStore({ error: "Unauthorized" }, 401);
  }

  try {
    const loaded = await getSiteContentResult();
    if (loaded.source === "defaults") {
      return jsonNoStore(
        {
          error:
            "rushabh.data.json could not be read, so save was blocked. Check that the file exists in the project root.",
        },
        503,
      );
    }
    const body = (await request.json()) as ContentPatchBody;
    const current = loaded.content;
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
    revalidatePublicPages();
    return jsonNoStore({ ok: true, content: merged });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content";
    return jsonNoStore({ error: message }, 500);
  }
}
