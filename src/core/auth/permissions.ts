import { Role } from "../types/domain";

export function canManageSchools(role: Role): boolean {
    return role === "owner";
}

export function canManageAdmins(role: Role): boolean {
    return role === "owner";
}

export function canManageTeachers(role: Role): boolean {
    return role === "admin";
}

export function canManageClasses(role: Role): boolean {
    return role === "admin";
}

export function canManageStudents(role: Role, context?: { isOwnClass: boolean }): boolean {
    if (role === "owner") return false; // Owner is read-only for students
    if (role === "admin") return false; // Admin is read-only for students (manages via classes)
    if (role === "teacher") {
        return !!context?.isOwnClass;
    }
    return false;
}

export function canReadStudents(role: Role, context: { isOwnClass: boolean; sameSchool: boolean }): boolean {
    if (role === "owner") return true;
    if (role === "admin") return context.sameSchool;
    if (role === "teacher") return context.isOwnClass && context.sameSchool;
    return false;
}
