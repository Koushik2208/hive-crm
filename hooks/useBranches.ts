import { useQuery } from '@tanstack/react-query';

interface Branch {
  id: string;
  name: string;
  address: string;
}

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await fetch('/api/v1/branches');
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      const result = await response.json();
      return result.data as Branch[];
    },
  });
}
