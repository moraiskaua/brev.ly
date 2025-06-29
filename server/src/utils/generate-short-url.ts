export async function generateShortUrl(): Promise<string> {
  const { nanoid } = await import('nanoid');
  return nanoid(8);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
