import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SchoolRepository } from "../infrastructure/SchoolRepository";
import { School } from "@/src/core/types/domain";

export const SCHOOLS_KEYS = {
    all: ["schools"] as const,
    detail: (id: string) => ["schools", id] as const,
};

export function useSchools() {
    return useQuery({
        queryKey: SCHOOLS_KEYS.all,
        queryFn: SchoolRepository.getAll,
    });
}

export function useSchool(id: string) {
    return useQuery({
        queryKey: SCHOOLS_KEYS.detail(id),
        queryFn: () => SchoolRepository.getById(id),
        enabled: !!id,
    });
}

export function useCreateSchool() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SchoolRepository.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHOOLS_KEYS.all });
        },
    });
}

export function useUpdateSchool() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<School> }) =>
            SchoolRepository.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: SCHOOLS_KEYS.all });
            queryClient.invalidateQueries({ queryKey: SCHOOLS_KEYS.detail(id) });
        },
    });
}

export function useDeleteSchool() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SchoolRepository.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHOOLS_KEYS.all });
        },
    });
}
