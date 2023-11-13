import { createCtx } from "../../utils/createContext";

type PageContextType = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  entityMeta?: {
    id: string;
    name: string;
  };
  editId?: string | number;
  setEditId?: (id: number | string) => void;
  cloudinaryDeleteToken?: string;
  setCloudinaryDeleteToken: (token: string) => void;
};

// Setup LocatorProvider to pass the [selected, hovered, focused]Ids between Marker interactions and LocatorCard interactions
export const [usePageContext, PageContextProvider] = createCtx<PageContextType>(
  "Attempted to call usePageContext outside of PageContextProvider"
);
