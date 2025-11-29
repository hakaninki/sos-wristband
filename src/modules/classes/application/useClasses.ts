import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassRepository } from "../infrastructure/ClassRepository";
import { SchoolClass } from "@/src/core/types/domain";

export const CLASSES_KEYS = {
    all: ["classes"] as const,
    bySchool: (schoolId: string) => ["classes", "school", schoolId] as const,
    byTeacher: (teacherId: string) => ["classes", "teacher", teacherId] as const,
    detail: (id: string) => ["classes", id] as const,
};

export function useSchoolClasses(schoolId: string) {
    return useQuery({
        queryKey: CLASSES_KEYS.bySchool(schoolId),
        queryFn: () => ClassRepository.getBySchool(schoolId),
        enabled: !!schoolId,
    });
}

export function useTeacherClasses(teacherId: string) {
    return useQuery({
        queryKey: CLASSES_KEYS.byTeacher(teacherId),
        queryFn: () => ClassRepository.getByTeacher(teacherId),
        enabled: !!teacherId,
    });
}

export function useClassesByIds(ids: string[]) {
    return useQuery({
        queryKey: ["classes", "byIds", ids],
        queryFn: () => ClassRepository.getByIds(ids),
        enabled: !!ids && ids.length > 0,
    });
}

export function useClass(id: string) {
    return useQuery({
        queryKey: CLASSES_KEYS.detail(id),
        queryFn: () => ClassRepository.getById(id),
        enabled: !!id,
    });
}

export function useCreateClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ClassRepository.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLASSES_KEYS.all });
        },
    });
}

export function useUpdateClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<SchoolClass> }) =>
            ClassRepository.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: CLASSES_KEYS.all });
            queryClient.invalidateQueries({ queryKey: CLASSES_KEYS.detail(id) });
        },
    });
}

export function useDeleteClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ClassRepository.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLASSES_KEYS.all });
        },
    });
}
