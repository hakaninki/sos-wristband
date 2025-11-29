import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function AccessDeniedPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-100 p-6">
                        <ShieldAlert className="h-12 w-12 text-red-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-muted-foreground text-lg">
                    You do not have permission to access this area. This section is restricted to system owners only.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link href="/">
                        <Button variant="outline">Go Home</Button>
                    </Link>
                    <Link href="/admin/login">
                        <Button className="bg-red-600 hover:bg-red-700 text-white">
                            Admin Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
