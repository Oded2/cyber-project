import hrefsFile from "./hrefs.json"

export const hrefs = hrefsFile

export function addParams(link: string, params: Record<string, string>, origin: string = ""): string {
    const url = new URL(origin.length > 0 ? origin + link : link);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    return url.toString();
}