import hrefsFile from "./hrefs.json"

export const hrefs = hrefsFile

export function addParams(link: string, params: Record<string, string>): string {
    const url = new URL(link);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    return url.toString();
}