import { Dispatch, SetStateAction, useState } from "react";

export default function useSearch<T>(
  items: T[],
  filterMethod: (items: T[], searchQuery: string) => T[],
): [T[], Dispatch<SetStateAction<string>>] {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filterdItems: T[] = filterMethod(items, searchQuery);

  return [filterdItems, setSearchQuery];
}
