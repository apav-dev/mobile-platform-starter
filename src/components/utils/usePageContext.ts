import { createCtx } from "../../utils/createContext";

type PageContextType = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  entityMeta?: {
    id: string;
    name: string;
  };
  editId?: string;
  setEditId?: (id: string) => void;
};

// Setup LocatorProvider to pass the [selected, hovered, focused]Ids between Marker interactions and LocatorCard interactions
export const [usePageContext, PageContextProvider] = createCtx<PageContextType>(
  "Attempted to call usePageContext outside of PageContextProvider"
);
