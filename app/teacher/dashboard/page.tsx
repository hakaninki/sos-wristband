"use client";

import { useCurrentStaff } from "@/src/core/auth/user";
import { useClassesByIds } from "@/src/modules/classes/application/useClasses";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/shared/ui/card";
import { Loader2, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardPage() {
    const { staff, loading: staffLoading } = useCurrentStaff();

    // Fetch only the classes assigned to this teacher
    const classIds = staff?.classIds || [];
    const { data: myClasses, isLoading: classesLoading } = useClassesByIds(classIds);

    if (staffLoading || (classesLoading && classIds.length > 0)) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!staff || staff.role !== "teacher") {
        return <div className="p-8 text-center">Unauthorized</div>;
    }

    const classes = myClasses || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {staff.name}</h1>
                <p className="text-muted-foreground">Here are your assigned classes.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                    <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{cls.name}</CardTitle>
                            <CardDescription>{cls.gradeLevel ? `Grade ${cls.gradeLevel}` : "No grade level"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>View Students</span>
                                </div>
                                <Link href={`/teacher/students?classId=${cls.id}`}>
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        Open <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {classes.length === 0 && (
                    <div className="col-span-full p-8 text-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't been assigned to any classes yet.</p>
                        <p className="text-sm text-muted-foreground mt-1">Please contact your school administrator.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
