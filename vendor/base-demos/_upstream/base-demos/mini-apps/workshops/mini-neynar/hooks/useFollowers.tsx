import useSWR from 'swr';
import { getFollows } from '@/lib/neynar';

interface Friend {
  username: string;
  fid: number;
  displayName?: string;
  pfp?: string;
}

interface UseFollowersOptions {
  limit?: number;
}

export function useFollowers(fid: number | undefined, options: UseFollowersOptions = {}) {
  const { limit = 10 } = options;

  console.log("[DEBUG] Fetching followers for FID:", fid);
  const { data, error, isLoading, mutate } = useSWR(
    fid ? ['followers', fid, limit] : null,
    async () => {
      const response = await getFollows(fid!, limit);
      console.log("[DEBUG] Followers response:", response);
      return response.users as Friend[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );
  console.log("[DEBUG] Followers data:", data);

  return {
    followers: data || [],
    isLoading,
    isError: error,
    mutate
  };
}