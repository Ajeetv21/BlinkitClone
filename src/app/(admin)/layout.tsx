
import Link from 'next/link';
import Sidebar from "@/component/sidebar"
export default function AdminLayout({ children }: any) {
    return (
        <div className="flex min-h-screen">
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-grow p-4 md:ml-64 w-full">{children}</main>
            </div>

        </div>
    );
}
