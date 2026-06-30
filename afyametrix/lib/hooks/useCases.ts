/**
 * useCases Hook
 * Custom hook for case management operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { caseService } from "@/lib/api";
import type {
  CreateCaseRequest,
  BulkCreateCaseRequest,
  UpdateCaseRequest,
  GetCasesParams,
  UploadPhotoRequest,
} from "@/lib/api";

export function useCases(params?: GetCasesParams) {
  const queryClient = useQueryClient();

  // Get all cases
  const {
    data: casesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cases", params],
    queryFn: () => caseService.getCases(params),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Create case mutation
  const createCaseMutation = useMutation({
    mutationFn: (data: CreateCaseRequest) => caseService.createCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  // Create bulk cases mutation
  const createBulkCasesMutation = useMutation({
    mutationFn: (data: BulkCreateCaseRequest) =>
      caseService.createCasesBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  // Update case mutation
  const updateCaseMutation = useMutation({
    mutationFn: (data: UpdateCaseRequest) => caseService.updateCase(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  // Delete case mutation
  const deleteCaseMutation = useMutation({
    mutationFn: (id: string) => caseService.deleteCase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: (data: UploadPhotoRequest) => caseService.uploadPhoto(data),
  });

  // Upload multiple photos mutation
  const uploadPhotosMutation = useMutation({
    mutationFn: ({ files, caseId }: { files: File[]; caseId?: string }) =>
      caseService.uploadPhotos(files, caseId),
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => caseService.deletePhoto(photoId),
  });

  // Sync pending cases mutation
  const syncCasesMutation = useMutation({
    mutationFn: () => caseService.syncPendingCases(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    // Cases data
    cases: casesData?.cases || [],
    total: casesData?.total || 0,
    page: casesData?.page || 1,
    limit: casesData?.limit || 10,
    totalPages: casesData?.totalPages || 1,
    isLoading,
    error,
    refetch,

    // Create operations
    createCase: createCaseMutation.mutate,
    createCaseAsync: createCaseMutation.mutateAsync,
    isCreating: createCaseMutation.isPending,
    createError: createCaseMutation.error,

    createBulkCases: createBulkCasesMutation.mutate,
    createBulkCasesAsync: createBulkCasesMutation.mutateAsync,
    isCreatingBulk: createBulkCasesMutation.isPending,
    createBulkError: createBulkCasesMutation.error,

    // Update operations
    updateCase: updateCaseMutation.mutate,
    updateCaseAsync: updateCaseMutation.mutateAsync,
    isUpdating: updateCaseMutation.isPending,
    updateError: updateCaseMutation.error,

    // Delete operations
    deleteCase: deleteCaseMutation.mutate,
    deleteCaseAsync: deleteCaseMutation.mutateAsync,
    isDeleting: deleteCaseMutation.isPending,
    deleteError: deleteCaseMutation.error,

    // Photo operations
    uploadPhoto: uploadPhotoMutation.mutate,
    uploadPhotoAsync: uploadPhotoMutation.mutateAsync,
    isUploadingPhoto: uploadPhotoMutation.isPending,
    uploadPhotoError: uploadPhotoMutation.error,

    uploadPhotos: uploadPhotosMutation.mutate,
    uploadPhotosAsync: uploadPhotosMutation.mutateAsync,
    isUploadingPhotos: uploadPhotosMutation.isPending,
    uploadPhotosError: uploadPhotosMutation.error,

    deletePhoto: deletePhotoMutation.mutate,
    deletePhotoAsync: deletePhotoMutation.mutateAsync,
    isDeletingPhoto: deletePhotoMutation.isPending,
    deletePhotoError: deletePhotoMutation.error,

    // Sync operations
    syncCases: syncCasesMutation.mutate,
    syncCasesAsync: syncCasesMutation.mutateAsync,
    isSyncing: syncCasesMutation.isPending,
    syncError: syncCasesMutation.error,
    syncResult: syncCasesMutation.data,

    // Helper methods
    getSyncQueueCount: () => caseService.getSyncQueueCount(),
    getLastSyncTime: () => caseService.getLastSyncTime(),
  };
}

// Hook for single case
export function useCase(id: string) {
  const queryClient = useQueryClient();

  const {
    data: caseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["case", id],
    queryFn: () => caseService.getCase(id),
    enabled: !!id,
  });

  return {
    case: caseData,
    isLoading,
    error,
  };
}

// Hook for pending cases
export function usePendingCases() {
  const {
    data: pendingCases,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cases", "pending"],
    queryFn: () => caseService.getPendingCases(),
    staleTime: 10 * 1000, // 10 seconds
  });

  return {
    pendingCases: pendingCases || [],
    isLoading,
    error,
    refetch,
    count: pendingCases?.length || 0,
  };
}
