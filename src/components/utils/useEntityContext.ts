import { createCtx } from "../../utils/createContext";

type EntityContextType = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
};

// Setup LocatorProvider to pass the [selected, hovered, focused]Ids between Marker interactions and LocatorCard interactions
export const [useEntity, EntityProvider] = createCtx<EntityContextType>(
  "Attempted to call useLocator outside of LocatorProvider"
);