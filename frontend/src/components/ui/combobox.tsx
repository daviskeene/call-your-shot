import * as React from "react";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { User } from "@/types/user";

type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: Option[];
  placeholder?: string;
  noMatchText?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  placeholder = "Select or type...",
  noMatchText = "No match found.",
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || "");
  const [searchQuery, setSearchQuery] = React.useState("");
  const queryClient = useQueryClient();

  const createUserMutation = useMutation(
    (newUser: { name: string; email: string }) =>
      apiClient.post("/users/", newUser),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<User[]>(["users"], (oldData) => [
          ...(oldData || []),
          { id: data.id, name: data.name, email: data.email },
        ]);
        handleSelect(data.id);
      },
    },
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === internalValue ? "" : currentValue;
    setInternalValue(newValue);
    onChange && onChange(newValue);
    setOpen(false);
  };

  const handleCreateUser = () => {
    createUserMutation.mutate({
      name: searchQuery,
      email: `${searchQuery.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    });
  };

  const filteredOptions = searchQuery
    ? options?.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  const showCreateOption =
    searchQuery &&
    !filteredOptions.some(
      (option) => option.label.toLowerCase() === searchQuery.toLowerCase(),
    );

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setSearchQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {internalValue
            ? options.find((op) => op.value === internalValue)?.label ||
              searchQuery
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>{noMatchText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((op) => (
                <CommandItem
                  key={op.value}
                  value={op.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      internalValue === op.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {op.label}
                </CommandItem>
              ))}
              {showCreateOption && (
                <CommandItem
                  key="create-new-user"
                  value={searchQuery}
                  onSelect={handleCreateUser}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create new user "{searchQuery}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
