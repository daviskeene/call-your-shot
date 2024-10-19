import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { User } from "../../types/user";

export const useUsers = () => {
  return useQuery<User[]>(["users"], () => apiClient.get("/users/"));
};
