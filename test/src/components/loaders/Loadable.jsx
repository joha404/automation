// @/components/common/Loadable/Loadable.jsx
import { lazy, Suspense } from "react";
import ScreenLoader from "./ScreenLoader";

const Loadable = (importFunc) => {
  let ComponentPromise = importFunc(); // shared promise to cache

  const LazyComponent = lazy(() => ComponentPromise);

  const LoadableComponent = (props) => (
    <Suspense fallback={<ScreenLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Preload support for programmatic preload
  LoadableComponent.preload = () => {
    ComponentPromise = importFunc(); // cache result
  };

  LoadableComponent.displayName = `Loadable(${
    LazyComponent.displayName || LazyComponent.name || "Component"
  })`;

  return LoadableComponent;
};

export default Loadable;
