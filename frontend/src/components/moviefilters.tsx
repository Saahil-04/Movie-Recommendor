import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import {
  Smile,
  Frown,
  ChevronsUpDown, Check
} from "lucide-react";
import { cn } from "../libs/utils";

interface FilterProps {
  onFilter: (filters: any) => void;
}

type Language = {
  iso_639_1: string;
  english_name: string;
};

type Genre = {
  id: number;
  name: string;
};

const MovieFilters: React.FC<FilterProps> = ({ onFilter }) => {
  const [mood, setMood] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [genre, setGenre] = useState("");
  const [movieAge, setMovieAge] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [genres, setGenres] = useState<Genre[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch("http://127.0.0.1:8000/genres");
      const data = await res.json();
      setGenres(data);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      const res = await fetch("http://127.0.0.1:8000/languages");
      const data = await res.json();
      setLanguages(data);
    };
    fetchLanguages();
  }, []);

  const handleFilter = () => {

    const selectedGenreId = genres.find((g) => g.name === genre)?.id ?? "";
    const selectedLangCode = languages.find((l) => l.english_name === selectedLanguage)?.iso_639_1 ?? "";
    onFilter({ mood, ageRating, genre: selectedGenreId, movieAge, language: selectedLangCode });
  };

  const Combobox = ({
    label,
    value,
    setValue,
    options,
    placeholder,
    fieldKey,
  }: {
    label: string;
    value: string;
    setValue: (val: string) => void;
    options: { value: string; label: string; icon?: React.ReactNode }[];
    placeholder: string;
    fieldKey: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <Popover
        open={openDropdown === fieldKey}
        onOpenChange={(open) => setOpenDropdown(open ? fieldKey : null)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openDropdown === fieldKey}
            className="w-full justify-between bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
          >
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="opacity-50 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-gray-900 border border-gray-700">
          <Command className="border-0 bg-transparent shadow-none">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
            />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "cursor-pointer",
                      "aria-selected:bg-accent aria-selected:text-accent-foreground"
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === opt.value
                          ? "opacity-100 text-indigo-500"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
  return (
    <Card className="p-6 bg-gray-900 border border-gray-800 rounded-xl shadow-md space-y-4 mt-6 mb-8 w-full">
      <Combobox
        label="Mood"
        value={mood}
        setValue={setMood}
        placeholder="Select mood"
        fieldKey="mood"
        options={[
          {
            value: "happy",
            label: "Happy",
            icon: <Smile className="w-4 h-4 text-yellow-400" />,
          },
          {
            value: "neutral",
            label: "Neutral",
            icon: <Smile className="w-4 h-4 text-gray-400" />,
          },
          {
            value: "sad",
            label: "Sad",
            icon: <Frown className="w-4 h-4 text-blue-400" />,
          },
        ]}
      />

      <Combobox
        label="Age Rating"
        value={ageRating}
        setValue={setAgeRating}
        placeholder="Select age rating"
        fieldKey="ageRating"
        options={["PG", "PG-13", "R"].map((r) => ({ value: r, label: r }))}
      />

      <Combobox
        label="Genre"
        value={genre}
        setValue={setGenre}
        placeholder="Select genre"
        fieldKey="genre"
        options={genres.map((g) => ({
          value: g.name, // ✅ now searchable
          label: g.name,
        }))}
      />

      <Combobox
        label="Movie Age"
        value={movieAge}
        setValue={setMovieAge}
        placeholder="Select movie age"
        fieldKey="movieAge"
        options={[
          { value: "new", label: "New (Last 5 years)" },
          { value: "classic", label: "Classic (Over 5 years)" },
        ]}
      />

      <Combobox
        label="Language"
        value={selectedLanguage}
        setValue={setSelectedLanguage}
        placeholder="Select language"
        fieldKey="language"
        options={languages.map((lang) => ({
          value: lang.english_name,
          label: lang.english_name,
        }))}
      />

      <Button
        onClick={handleFilter}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold mt-3"
      >
        Filter Movies
      </Button>
    </Card>
  );
};

export default MovieFilters;
