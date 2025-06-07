import { cn } from "~/lib/utils";
import ItemIcon from "./item-icon";

type Props = {
  site: {
    url: string;
    isAvailable: boolean | null;
  };
};

export default function DomainResultsItem({ site }: Props) {
  return (
    <div
      key={site.url}
      className={cn(
        "flex items-center border p-4 rounded-xl",
        site.isAvailable ? "" : "text-muted-foreground"
      )}
    >
      <div className="flex items-center grow gap-2">
        <ItemIcon isAvailable={site.isAvailable} />
        <a
          href={"https://" + site.url}
          target="_blank"
          rel="noopener noreferrer"
          className={site.isAvailable ? "text-primary" : ""}
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
  );
}
