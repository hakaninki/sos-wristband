import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffRepository } from "../infrastructure/StaffRepository";
import { Staff, Role } from "@/src/core/types/domain";
import { createStaffUser } from "@/src/app/actions/auth";

export const STAFF_KEYS = {
    all: ["staff"] as const,
    bySchool: (schoolId: string, role: Role) => ["staff", schoolId, role] as const,
    admins: ["staff", "admins"] as const,
    detail: (id: string) => ["staff", id] as const,
};

export function useSchoolStaff(schoolId: string, role: Role) {
    return useQuery({
        queryKey: STAFF_KEYS.bySchool(schoolId, role),
        queryFn: () => StaffRepository.getBySchoolAndRole(schoolId, role),
        enabled: !!schoolId,
    });
}

export function useAllStaff() {
    return useQuery({
        queryKey: ["staff", "all"],
        queryFn: () => StaffRepository.getAll(),
    });
}

export function useAdmins() {
    return useQuery({
        queryKey: STAFF_KEYS.admins,
        queryFn: StaffRepository.getAdmins,
    });
}

export function useStaffMember(id: string) {
    return useQuery({
        queryKey: STAFF_KEYS.detail(id),
        queryFn: () => StaffRepository.getById(id),
        enabled: !!id,
    });
}

export function useCreateStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: { email: string; password?: string; name: string; role: Role; schoolId?: string; phone?: string; classIds?: string[] }) => {
            const result = await createStaffUser(params);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
        },
    });
}

export function useUpdateStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Staff> }) =>
            StaffRepository.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
            queryClient.invalidateQueries({ queryKey: STAFF_KEYS.detail(id) });
        },
    });
}

export function useDeleteStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: StaffRepository.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
        },
    });
}
