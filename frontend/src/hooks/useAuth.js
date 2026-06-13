import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import authService from "../services/authService";

export function useAuth() {
  const { user, token, setSession, setUser, logout } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated: Boolean(token),
    setSession,
    setUser,
    logout,
  };
}

export function useLogin() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      setSession({ token: data.access_token, user: data.user });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (data) => {
      if (data?.access_token) {
        setSession({ token: data.access_token, user: data.user });
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    },
  });
}

export function useMe() {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await authService.getMe();
      setUser(user);
      return user;
    },
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
  });
}
