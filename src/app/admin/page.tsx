"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data: { authenticated: boolean }) => {
        if (!active) return;
        if (!data.authenticated) {
          router.replace("/admin/login");
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (active) {
          router.replace("/admin/login");
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-maroon">
        Loading admin…
      </div>
    );
  }

  return <AdminDashboard />;
}
