import { createServerFn } from "@tanstack/react-start";
import { commonTlds } from "~/constants/common-tlds";

export const getDomainsAvailability = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    const isFullDomain = data.includes(".");

    const urls = isFullDomain
      ? [data]
      : commonTlds.map((tld) => `${data}.${tld}`);

    const normalizeUrl = (url: string) =>
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    const results = await Promise.all(
      urls.map(async (url) => {
        if (isFullDomain) {
          try {
            const res = await fetch(normalizeUrl(url), { method: "HEAD" });
            return { url, isAvailable: !res.ok ? true : false };
          } catch {
            return { url, isAvailable: null };
          }
        } else {
          const response = await fetch(
            `https://api.ote-godaddy.com/v1/domains/available?domain=${url}&checkType=FULL&forTransfer=false`,
            {
              headers: {
                Authorization: `sso-key ${process.env.GO_DADDY_KEY}:${process.env.GO_DADDY_SECRET}`,
              },
            }
          );
          if (!response.ok) return { url, isAvailable: null };
          const jsonData = await response.json();
          return { url, isAvailable: jsonData.available };
        }
      })
    );

    return results;
  });
