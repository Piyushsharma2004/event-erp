import Sidebar from "@/components/admin/dashboard/Sidebar";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-full" >
    <Sidebar />
       
          
            {children}
          
          </div>
  );
}