import { useMutation, useQuery } from "@tanstack/react-query";
import competitionService from "../services/competitionService";
import submissionService from "../services/submissionService";

export function useCompetitions(params = {}) {
  return useQuery({
    queryKey: ["competitions", params],
    queryFn: () => competitionService.getAll(params),
  });
}

export function useCompetition(id) {
  return useQuery({
    queryKey: ["competition", id],
    queryFn: () => competitionService.getOne(id),
    enabled: Boolean(id),
  });
}

export function useCompetitionLeaderboard(id) {
  return useQuery({
    queryKey: ["leaderboard", "competition", id],
    queryFn: () => competitionService.getLeaderboard(id),
    enabled: Boolean(id),
  });
}

export function useMySubmissions(enabled = true) {
  return useQuery({
    queryKey: ["submissions", "me"],
    queryFn: () => submissionService.getMySubmissions(),
    enabled,
  });
}

export function useSubmit(onUploadProgress) {
  return useMutation({
    mutationFn: ({ competitionId, file }) =>
      submissionService.submit(competitionId, file, onUploadProgress),
  });
}
