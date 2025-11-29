import { Role } from "../types/domain";

export interface NavItem {
    id: string;
    label: string;
    href: string;
    roles: Role[];
    icon?: string; // Lucide icon name
}

export const NAV_ITEMS: NavItem[] = [
    // Owner Routes
    { id: "owner-dashboard", label: "Dashboard", href: "/owner", roles: ["owner"], icon: "LayoutDashboard" },
    { id: "owner-schools", label: "Schools", href: "/owner/schools", roles: ["owner"], icon: "School" },
    { id: "owner-admins", label: "Admins", href: "/owner/staff", roles: ["owner"], icon: "Users" },
    { id: "owner-settings", label: "Settings", href: "/owner/settings", roles: ["owner"], icon: "Settings" },

    // Admin Routes
    { id: "admin-dashboard", label: "Dashboard", href: "/admin", roles: ["admin"], icon: "LayoutDashboard" },
    { id: "admin-classes", label: "Classes", href: "/admin/classes", roles: ["admin"], icon: "BookOpen" },
    { id: "admin-teachers", label: "Teachers", href: "/admin/teachers", roles: ["admin"], icon: "GraduationCap" },
    { id: "admin-students", label: "Students", href: "/admin/students", roles: ["admin"], icon: "Users" },

    // Teacher Routes
    { id: "teacher-dashboard", label: "My Classes", href: "/teacher/dashboard", roles: ["teacher"], icon: "BookOpen" },
    { id: "teacher-students", label: "My Students", href: "/teacher/students", roles: ["teacher"], icon: "Users" },
];

export function getNavItemsForRole(role: Role): NavItem[] {
    return NAV_ITEMS.filter(item => item.roles.includes(role));
}
