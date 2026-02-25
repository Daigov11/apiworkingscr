import AdminGuard from "@/components/admin/AdminGuard";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl p-6">
          <AdminTopbar />
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}