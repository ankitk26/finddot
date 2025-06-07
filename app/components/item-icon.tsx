import { SearchCheckIcon, SearchSlashIcon, SearchXIcon } from "lucide-react";

export default function ItemIcon({
  isAvailable,
}: {
  isAvailable: boolean | null;
}) {
  if (isAvailable) {
    return <SearchCheckIcon />;
  }

  if (isAvailable === false) {
    return <SearchXIcon />;
  }

  return <SearchSlashIcon />;
}
