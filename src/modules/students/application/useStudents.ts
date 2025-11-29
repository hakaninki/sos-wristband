import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentRepository } from "../infrastructure/StudentRepository";
import { Student } from "@/src/core/types/domain";

export const STUDENTS_KEYS = {
    all: ["students"] as const,
    byClass: (classId: string) => ["students", "class", classId] as const,
    bySchool: (schoolId: string) => ["students", "school", schoolId] as const,
    detail: (id: string) => ["students", id] as const,
};

export function useClassStudents(classId: string) {
    return useQuery({
        queryKey: STUDENTS_KEYS.byClass(classId),
        queryFn: () => StudentRepository.getByClass(classId),
        enabled: !!classId,
    });
}

export function useSchoolStudents(schoolId: string) {
    return useQuery({
        queryKey: STUDENTS_KEYS.bySchool(schoolId),
        queryFn: () => StudentRepository.getBySchool(schoolId),
        enabled: !!schoolId,
    });
}

export function useStudent(id: string) {
    return useQuery({
        queryKey: STUDENTS_KEYS.detail(id),
        queryFn: () => StudentRepository.getById(id),
        enabled: !!id,
    });
}

export function useCreateStudent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: StudentRepository.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_KEYS.all });
        },
    });
}

export function useUpdateStudent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
            StudentRepository.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_KEYS.all });
            queryClient.invalidateQueries({ queryKey: STUDENTS_KEYS.detail(id) });
        },
    });
}

export function useDeleteStudent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: StudentRepository.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_KEYS.all });
        },
    });
}

export function useUploadStudentPhoto() {
    return useMutation({
        mutationFn: ({ file, studentId }: { file: File; studentId: string }) =>
            StudentRepository.uploadPhoto(file, studentId),
    });
}
