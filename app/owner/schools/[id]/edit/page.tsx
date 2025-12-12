"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSchool, useUpdateSchool } from "@/src/modules/schools/application/useSchools";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { School } from "@/src/core/types/domain";

export default function EditSchoolPage() {
    const router = useRouter();
    const params = useParams();
    const schoolId = typeof params.id === "string" ? params.id : "";

    const { data: school, isLoading: schoolLoading } = useSchool(schoolId);
    const { mutateAsync: updateSchool, isPending: isUpdating } = useUpdateSchool();

    const [formData, setFormData] = useState<Partial<School>>({
        name: "",
        slug: "",
        address: "",
        contactEmail: "",
        logoUrl: "",
        coverImageUrl: "",
        active: true,
        phone: "",
    });

    useEffect(() => {
        if (school) {
            setFormData({
                name: school.name,
                slug: school.slug,
                address: school.address || "",
                contactEmail: school.contactEmail || "",
                contactName: school.contactName || "",
                contactPhone: school.contactPhone || "",
                city: school.city || "",
                country: school.country || "",
                website: school.website || "",
                ownerNotes: school.ownerNotes || "",
                logoUrl: school.logoUrl || "",
                coverImageUrl: school.coverImageUrl || "",
                active: school.active,
                phone: school.phone || "",
            });
        }
    }, [school]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        // Only auto-generate slug if it wasn't manually edited (simplified logic: always update for now or just let user edit)
        // Better: Don't auto-update slug on edit to avoid breaking links, unless user wants to.
        setFormData(prev => ({ ...prev, name }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSchool({
                id: schoolId,
                data: {
                    ...formData,
                    updatedAt: new Date(),
                },
            });
            router.push(`/owner/schools/${schoolId}`);
        } catch (error) {
            console.error("Error updating school:", error);
            alert("Failed to update school.");
        }
    };

    if (schoolLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!school) return <div className="p-8 text-center text-red-500">School not found</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href={`/owner/schools/${schoolId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edit School</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>School Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">School Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleNameChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                                id="slug"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="font-mono"
                            />
                            <p className="text-xs text-muted-foreground">
                                Warning: Changing this will break existing public links.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-sm text-gray-900">Contact Information</h3>
                            <div className="space-y-2">
                                <Label htmlFor="contactName">Contact Name</Label>
                                <Input
                                    id="contactName"
                                    value={formData.contactName || ""}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    placeholder="e.g. Principal John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Contact Email</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        value={formData.contactEmail || ""}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Contact Phone</Label>
                                    <Input
                                        id="contactPhone"
                                        value={formData.contactPhone || ""}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-sm text-gray-900">Location</h3>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address || ""}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city || ""}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country || ""}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Website & Media */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-sm text-gray-900">Media & Web</h3>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website || ""}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logoUrl">Logo URL</Label>
                                <div className="flex gap-4 items-start">
                                    <Input
                                        id="logoUrl"
                                        value={formData.logoUrl || ""}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        className="flex-1"
                                    />
                                    {formData.logoUrl && (
                                        <div className="h-10 w-10 relative rounded overflow-hidden border shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={formData.logoUrl}
                                                alt="Logo Preview"
                                                className="h-full w-full object-cover"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                                <Input
                                    id="coverImageUrl"
                                    value={formData.coverImageUrl || ""}
                                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-sm text-gray-900">Internal</h3>
                            <div className="space-y-2">
                                <Label htmlFor="ownerNotes">Owner Notes (Internal only)</Label>
                                <Input
                                    id="ownerNotes"
                                    value={formData.ownerNotes || ""}
                                    onChange={(e) => setFormData({ ...formData, ownerNotes: e.target.value })}
                                    placeholder="Private notes about this school..."
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="active"
                                    checked={formData.active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
                                />
                                <Label htmlFor="active">Active</Label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
