import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SearchCheckIcon, SearchSlashIcon, SearchXIcon } from "lucide-react";
import { commonTlds } from "~/constants/common-tlds";
import { cn } from "~/lib/utils";

const getDomainsAvailability = createServerFn({ method: "GET" })
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

export default function DomainResults() {
  const { domain } = useSearch({ from: "/" });
  const { data: sites } = useSuspenseQuery({
    queryKey: ["search", domain],
    queryFn: async () => getDomainsAvailability({ data: domain ?? "" }),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="border rounded-xl mt-8 p-4">
      <h2 className="text-xl font-semibold">
        Search results for: <span className="text-primary">{domain}</span>
      </h2>

      <div className="flex flex-col gap-4 mt-4">
        {sites.map((site) => (
          <div
            key={site.url}
            className={cn(
              "flex items-center border p-4 rounded-xl",
              site.isAvailable ? "" : "text-muted-foreground"
            )}
          >
            <div className="flex items-center grow gap-2">
              {site.isAvailable === true ? (
                <SearchCheckIcon />
              ) : site.isAvailable === false ? (
                <SearchXIcon />
              ) : (
                <SearchSlashIcon />
              )}
              <a
                href={"https://" + site.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.url}
              </a>
            </div>
            <div>
              {site.isAvailable === true
                ? "Available"
                : site.isAvailable === false
                ? "Taken"
                : "NA"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
