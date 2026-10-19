import { db } from "@/lib/db";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings-shared";

export type { GithubAccount, SiteSettings } from "@/lib/settings-shared";
export { DEFAULT_SETTINGS } from "@/lib/settings-shared";

/** Read all settings rows and merge over defaults. Never throws. */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.siteSetting.findMany();
    const stored: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        stored[row.key] = JSON.parse(row.value);
      } catch {
        stored[row.key] = row.value;
      }
    }
    return {
      dock: { ...DEFAULT_SETTINGS.dock, ...(stored.dock as object | undefined) },
      github:
        (stored.github as SiteSettings["github"] | undefined) ??
        DEFAULT_SETTINGS.github,
      status:
        typeof stored.status === "string" && stored.status.trim()
          ? (stored.status as string)
          : DEFAULT_SETTINGS.status,
      obsession:
        (stored.obsession as SiteSettings["obsession"] | undefined) ??
        DEFAULT_SETTINGS.obsession,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
