"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { runMigration } from "@/lib/migration";
import { auth } from "@/lib/firebase";

export default function MigrationPage() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const handleMigration = async () => {
        if (!auth.currentUser) {
            setLogs(["Error: You must be logged in to run migration."]);
            return;
        }

        if (!window.confirm("This will modify database records. Are you sure?")) {
            return;
        }

        setLoading(true);
        setLogs(["Running migration..."]);

        try {
            const result = await runMigration(auth.currentUser.uid);
            setLogs(result.logs);
        } catch (error) {
            setLogs((prev) => [...prev, "Unexpected error occurred."]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle>System Migration</CardTitle>
                    <CardDescription>
                        Run this tool to migrate existing data to the new multi-school architecture.
                        It will create a default school and assign all unassigned students to it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm text-yellow-800">
                        <strong>Warning:</strong> This is a one-time operation. Ensure you have a backup if running on production data.
                    </div>

                    <Button
                        onClick={handleMigration}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    >
                        {loading ? "Migrating..." : "Run Migration"}
                    </Button>

                    {logs.length > 0 && (
                        <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-md font-mono text-xs h-64 overflow-y-auto">
                            {logs.map((log, i) => (
                                <div key={i}>&gt; {log}</div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
