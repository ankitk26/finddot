import { createFileRoute } from "@tanstack/react-router";
import { GlobeIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import DomainResults from "../components/domain-results";
import SearchInput from "../components/search-input";

type SearchParams = {
  domain?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    // domain can be empty or undefined
    const domain =
      typeof search?.domain === "string" && search.domain.trim() !== ""
        ? search.domain
        : undefined;
    return { domain };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { domain } = Route.useSearch();

  return (
    <div className="min-h-screen max-w-3xl w-full mx-auto p-4 flex flex-col items-stretch">
      <div className="flex items-center justify-center gap-2">
        <GlobeIcon />
        <h1 className="text-2xl font-semibold">finddot</h1>
      </div>
      <p className="text-center text-muted-foreground">
        Instant domain and site check
      </p>

      <SearchInput />

      {domain && (
        <Suspense
          fallback={
            <Loader2Icon className="mt-8 animate-spin flex items-center w-full" />
          }
        >
          <DomainResults />
        </Suspense>
      )}
    </div>
  );
}
