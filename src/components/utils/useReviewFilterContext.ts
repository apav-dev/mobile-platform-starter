import { createCtx } from "../../utils/createContext";
import { AwaitingResponseType } from "../ReviewFilters";

type ReviewFilterContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  filterPanelOpen: boolean;
  setFilterPanelOpen: (open: boolean) => void;
  publisherIds: string[];
  setPublisherIds: (ids: string[]) => void;
  awaitingResponse: AwaitingResponseType;
  setAwaitingResponse: (awaitingResponse: AwaitingResponseType) => void;
  clearFilters: () => void;
};

// Setup LocatorProvider to pass the [selected, hovered, focused]Ids between Marker interactions and LocatorCard interactions
export const [useReviewFilterContext, ReviewFilterProvider] =
  createCtx<ReviewFilterContextType>(
    "Attempted to call useReviewFilterContext outside of ReviewFilterProvider"
  );
