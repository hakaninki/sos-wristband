"use client";

import { useSchools } from "@/src/modules/schools/application/useSchools";
import { useAdmins } from "@/src/modules/staff/application/useStaff";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { School, Users, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/shared/ui/button";

export default function OwnerDashboardPage() {
    const { data: schools, isLoading: schoolsLoading } = useSchools();
    const { data: admins, isLoading: adminsLoading } = useAdmins();

    if (schoolsLoading || adminsLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const activeSchools = schools?.filter(s => s.active).length || 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
                <p className="text-muted-foreground">Manage schools and system administrators.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{schools?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeSchools} active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Admins</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{admins?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all schools
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Schools</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {schools?.slice(0, 5).map((school) => (
                                <div key={school.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{school.name}</p>
                                        <p className="text-sm text-muted-foreground">{school.contactEmail || "No email"}</p>
                                    </div>
                                    <Link href={`/owner/schools/${school.id}`}>
                                        <Button variant="ghost" size="sm">
                                            View <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                            {schools?.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No schools found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
