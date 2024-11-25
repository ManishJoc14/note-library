import Sidebar from "../../../components/studentComponents/sidebar";

export default function UserDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  console.log('Rendering UserDashboardLayout');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Sidebar />
      <main className="ml-64 p-8 relative">{children}</main>
    </div>
  );
}

