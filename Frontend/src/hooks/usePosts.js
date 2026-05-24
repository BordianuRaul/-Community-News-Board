import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: apiClient.getPosts,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  })
}
