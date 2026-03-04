import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await fetch("/api/users");
            return res.json();
        },
        staleTime: 1000 * 60 * 5,
    });
};