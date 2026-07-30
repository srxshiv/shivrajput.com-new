import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";

// hidden route: never index it, never follow links from it
export const metadata: Metadata = {
  title: "ShivOS — admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminPanel />;
}
