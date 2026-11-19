import apiClient from "@/services/api";

export type RemotePost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Contoh GET dan POST untuk latihan komunikasi client-server.
// JSONPlaceholder adalah mock API, bukan database permanen aplikasi.
export async function getRemotePosts(): Promise<RemotePost[]> {
  const response = await apiClient.get<RemotePost[]>("/posts");
  return response.data;
}

export async function createRemotePost(title: string, body: string): Promise<RemotePost> {
  const response = await apiClient.post<RemotePost>("/posts", {
    userId: 1,
    title,
    body
  });
  return response.data;
}
