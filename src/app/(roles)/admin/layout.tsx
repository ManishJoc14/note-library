import LayoutWrapper from "../../../components/adminComponents/layoutWrapper"; 

export default function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  console.log("Rendering AdminDashboardLayout ");
  
  return (
    <LayoutWrapper>
     {children}
    </LayoutWrapper>
  );
}
