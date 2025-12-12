"use client";

import Link from "next/link";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent } from "@/src/shared/ui/card";
import { Badge } from "@/src/shared/ui/badge";
import { useSchools } from "@/src/modules/schools/application/useSchools";
import { Plus, Building2, ChevronRight, Loader2, Mail } from "lucide-react";

export default function SchoolsListPage() {
    const { data: schools, isLoading } = useSchools();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const handleInvite = async (schoolId: string) => {
        try {
            // @ts-ignore
            const { createInvite } = await import("@/lib/invites");
            const invite = await createInvite(schoolId);
            const link = `${window.location.origin}/register?token=${invite.token}`;
            // Simple prompt to copy the link
            window.prompt("Admin Invite Link (Copy and send to admin):", link);
        } catch (error) {
            console.error("Failed to create invite:", error);
            alert("Failed to create invite.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Schools</h1>
                    <p className="text-muted-foreground mt-1">Manage all schools in the system.</p>
                </div>
                <Link href="/owner/schools/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add School
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {schools?.map((school) => (
                    <Card key={school.id} className="hover:shadow-md transition-shadow border-gray-200">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden relative">
                                    {school.logoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={school.logoUrl} alt={school.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-6 w-6" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {school.slug}
                                        </Badge>
                                        {school.active ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
                                        ) : (
                                            <Badge variant="destructive">Inactive</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                    onClick={() => handleInvite(school.id)}
                                >
                                    <Mail className="mr-1 h-3 w-3" /> Invite Admin
                                </Button>
                                <Link href={`/owner/schools/${school.id}`}>
                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600">
                                        Manage <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {schools?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-muted-foreground">No schools found. Create your first school to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
