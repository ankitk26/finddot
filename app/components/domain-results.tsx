import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { getDomainsAvailability } from "~/server-fns/get-domains-availability";
import DomainResultsItem from "./domain-results-item";

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
          <DomainResultsItem key={site.url} site={site} />
        ))}
      </div>
    </div>
  );
}
