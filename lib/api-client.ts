export interface IVideo {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt?: string;
}

type FetchOptions<T> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: T;
  headers?: Record<string, string>;
};

class ApiClient {
  private async request<T, B = unknown>(
    endpoint: string,
    options: FetchOptions<B> = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.request<IVideo[]>("/videos");
  }

  async createVideo(videoData: IVideo) {
    return this.request<IVideo, IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
