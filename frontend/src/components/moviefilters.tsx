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
  ChevronsUpDown, 
  Check,
  Sparkles,
  Filter,
  Globe,
  Calendar,
  Film
} from "lucide-react";
import { cn } from "../libs/utils";
import { motion } from "framer-motion";

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
    icon: LabelIcon,
  }: {
    label: string;
    value: string;
    setValue: (val: string) => void;
    options: { value: string; label: string; icon?: React.ReactNode }[];
    placeholder: string;
    fieldKey: string;
    icon?: React.ComponentType<any>;
  }) => (
    <div className="space-y-3">
      <Label className="text-gray-200 font-medium flex items-center gap-2 text-sm">
        {LabelIcon && <LabelIcon className="w-4 h-4 text-purple-400" />}
        {label}
      </Label>
      <Popover
        open={openDropdown === fieldKey}
        onOpenChange={(open) => setOpenDropdown(open ? fieldKey : null)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openDropdown === fieldKey}
            className={cn(
              "w-full justify-between h-12 rounded-xl border-0",
              "bg-black/40 backdrop-blur-md text-gray-100",
              "hover:bg-black/60 transition-all duration-300",
              "focus:ring-2 focus:ring-purple-500/50 focus:bg-black/60",
              "group relative overflow-hidden"
            )}
          >
            <span className={cn(
              "truncate flex-1 text-left",
              value ? "text-white" : "text-gray-400"
            )}>
              {value
                ? options.find((opt) => opt.value === value)?.label
                : placeholder}
            </span>
            <ChevronsUpDown className="opacity-50 h-4 w-4 group-hover:opacity-100 transition-opacity" />
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
          <Command className="border-0 bg-transparent shadow-none">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-12 border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 rounded-lg m-2"
            />
            <CommandList className="max-h-64">
              <CommandEmpty className="py-6 text-center text-gray-400">
                No {label.toLowerCase()} found.
              </CommandEmpty>
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
                      "cursor-pointer mx-2 mb-1 rounded-lg px-3 py-2 transition-all duration-200",
                      "hover:bg-white/10 text-gray-200 hover:text-white",
                      "aria-selected:bg-purple-600/20 aria-selected:text-white",
                      "flex items-center gap-2"
                    )}
                  >
                    {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                    <span className="flex-1 truncate">{opt.label}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        value === opt.value
                          ? "opacity-100 text-purple-400"
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 mt-6 mb-8 w-full">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black/20 to-blue-900/10" />
        
        {/* Header */}
        <div className="relative z-10 flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Movie Filters</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Combobox
            label="Mood"
            value={mood}
            setValue={setMood}
            placeholder="How are you feeling?"
            fieldKey="mood"
            icon={Sparkles}
            options={[
              {
                value: "happy",
                label: "Happy & Upbeat",
                icon: <Smile className="w-4 h-4 text-yellow-400" />,
              },
              {
                value: "neutral",
                label: "Neutral & Balanced",
                icon: <Smile className="w-4 h-4 text-gray-400" />,
              },
              {
                value: "sad",
                label: "Melancholy & Thoughtful",
                icon: <Frown className="w-4 h-4 text-blue-400" />,
              },
            ]}
          />

          <Combobox
            label="Age Rating"
            value={ageRating}
            setValue={setAgeRating}
            placeholder="Content rating"
            fieldKey="ageRating"
            icon={Film}
            options={[
              { value: "PG", label: "PG - Family Friendly" },
              { value: "PG-13", label: "PG-13 - Teen & Up" },
              { value: "R", label: "R - Mature Content" }
            ]}
          />

          <Combobox
            label="Genre"
            value={genre}
            setValue={setGenre}
            placeholder="Choose your genre"
            fieldKey="genre"
            icon={Film}
            options={genres.map((g) => ({
              value: g.name,
              label: g.name,
            }))}
          />

          <Combobox
            label="Era"
            value={movieAge}
            setValue={setMovieAge}
            placeholder="Movie era preference"
            fieldKey="movieAge"
            icon={Calendar}
            options={[
              { 
                value: "new", 
                label: "Modern (Last 5 years)",
                icon: <Sparkles className="w-4 h-4 text-green-400" />
              },
              { 
                value: "classic", 
                label: "Classic (Over 5 years)",
                icon: <Calendar className="w-4 h-4 text-amber-400" />
              },
            ]}
          />

          <div className="md:col-span-2">
            <Combobox
              label="Language"
              value={selectedLanguage}
              setValue={setSelectedLanguage}
              placeholder="Select language"
              fieldKey="language"
              icon={Globe}
              options={languages.map((lang) => ({
                value: lang.english_name,
                label: lang.english_name,
              }))}
            />
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <Button
            onClick={handleFilter}
            className={cn(
              "w-full h-14 text-lg font-semibold rounded-xl",
              "bg-gradient-to-r from-purple-600 to-blue-600",
              "hover:from-purple-700 hover:to-blue-700",
              "text-white shadow-lg hover:shadow-xl",
              "transition-all duration-300 hover:scale-[1.02]",
              "group relative overflow-hidden"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Apply Filters & Find Movies
            </span>
            
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
      </Card>
    </motion.div>
  );
};

export default MovieFilters;