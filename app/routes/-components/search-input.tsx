import { useNavigate } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SearchInput() {
  const [searchInput, setSearchInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded-xl mt-8">
      <h2 className="text-xl font-semibold">Search domain</h2>
      <Label className="mt-4">Enter desired domain name</Label>
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
