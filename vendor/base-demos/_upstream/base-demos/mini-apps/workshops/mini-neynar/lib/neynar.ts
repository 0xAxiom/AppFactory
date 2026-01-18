"use server";

import { NeynarAPIClient, Configuration, isApiErrorResponse } from "@neynar/nodejs-sdk";

interface FollowsResponse {
  users: {
    fid: number;
    username: string;
    displayName?: string;
    pfp?: string;
  }[];
}

export async function getFollows(fid: number, limit: number = 10): Promise<FollowsResponse> {
  const config = new Configuration({
    apiKey: process.env.NEYNAR_API_KEY || ''
  });

  const client = new NeynarAPIClient(config);

  try {
    const users = await client.fetchUserFollowers({ fid: fid, limit: limit });
    return { users: users.users.map((user) => ({
      fid: user.user?.fid || 0,
      username: user.user?.username || '',
      displayName: user.user?.display_name || '',
      pfp: user.user?.pfp_url || ''
    })) };
  } catch (error) {
    if (isApiErrorResponse(error)) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error fetching user:', error);
    }
    return { users: [] };
  }
}
