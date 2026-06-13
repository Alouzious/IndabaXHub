import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import datasetService from "../services/datasetService";

export function useDatasets(params = {}) {
  return useQuery({
    queryKey: ["datasets", params],
    queryFn: () => datasetService.getAll(params),
    keepPreviousData: true,
  });
}

export function useDataset(id) {
  return useQuery({
    queryKey: ["dataset", id],
    queryFn: () => datasetService.getOne(id),
    enabled: Boolean(id),
  });
}

export function useMyDatasets(enabled = true) {
  return useQuery({
    queryKey: ["datasets", "mine"],
    queryFn: () => datasetService.getMine(),
    enabled,
  });
}

export function useUploadDataset(onUploadProgress) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) =>
      datasetService.upload(formData, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
    },
  });
}

export function useDownloadDataset() {
  return useMutation({
    mutationFn: (id) => datasetService.download(id),
  });
}
