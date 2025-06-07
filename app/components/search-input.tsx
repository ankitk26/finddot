import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SearchInput() {
  const { domain } = useSearch({ from: "/" });

  const [searchInput, setSearchInput] = useState(domain ?? "");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded-xl mt-8">
      <h2 className="text-xl font-semibold">Search site availablity</h2>
      <Label className="mt-4">Enter site name</Label>
      <form
        className="flex items-center mt-2 mb-1 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(searchInput);
          const trimmedInput = searchInput.trim();
          if (trimmedInput.length === 0) {
            setValidationError("Enter valid domain");
            return;
          }
          setValidationError("");
          navigate({
            to: "/",
            search: {
              domain: trimmedInput,
            },
          });
        }}
      >
        <Input
          placeholder="Examples - finddot, tanstack, vercel"
          className="grow"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit">
          <SearchIcon className="size-4" />
          <span>Check</span>
        </Button>
      </form>
      {validationError && (
        <small className="text-destructive">{validationError}</small>
      )}
    </div>
  );
}
