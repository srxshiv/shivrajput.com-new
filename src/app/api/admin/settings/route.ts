import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = new Set(["dock", "github", "status", "obsession"]);

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json({ settings: await getSettings() });
}

/** Bulk upsert: { settings: { dock: {...}, github: {...}, status: "..." } } */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let payload: { settings?: Record<string, unknown> };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const entries = Object.entries(payload.settings ?? {}).filter(([key]) =>
    ALLOWED_KEYS.has(key)
  );
  if (entries.length === 0) {
    return Response.json({ error: "Nothing to save." }, { status: 400 });
  }

  for (const [key, value] of entries) {
    const serialized = JSON.stringify(value).slice(0, 20_000);
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value: serialized },
      update: { value: serialized },
    });
  }

  return Response.json({ settings: await getSettings() });
}
