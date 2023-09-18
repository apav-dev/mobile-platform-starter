import { createCtx } from "../../utils/createContext";

type ReviewFilterContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  filterPanelOpen: boolean;
  setFilterPanelOpen: (open: boolean) => void;
  clearFilters: () => void;
};

// Setup LocatorProvider to pass the [selected, hovered, focused]Ids between Marker interactions and LocatorCard interactions
export const [useReviewFilterContext, ReviewFilterProvider] =
  createCtx<ReviewFilterContextType>(
    "Attempted to call useReviewFilterContext outside of ReviewFilterProvider"
  );
