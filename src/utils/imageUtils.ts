export const checkAndOptimizeImageSize = async (
  baseUrl: string,
  imageId: string,
  maxBytes: number = 5000000
): Promise<string> => {
  let quality: number = 100;
  let optimizedUrl: string = "";
  while (true) {
    optimizedUrl = `${baseUrl}/upload/q_${quality}/${imageId}`;
    const size: number = await getImageSize(optimizedUrl);

    if (size <= maxBytes || quality <= 25) {
      break;
    }

    quality -= 25; // Decrease quality by 25%
  }

  return optimizedUrl;
};

export const getImageSize = async (url: string): Promise<number> => {
  const response: Response = await fetch(url, { method: "HEAD" });
  const contentLength: string | null = response.headers.get("content-length");

  return contentLength ? parseInt(contentLength, 10) : 0;
};
