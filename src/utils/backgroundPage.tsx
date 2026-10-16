import { lazy } from "react";
import type { ComponentType } from "react";

type PageModule = { default: ComponentType };

export function createBackgroundPage(loader: () => Promise<PageModule>) {
  let loaded: ComponentType | undefined;
  let pending: Promise<PageModule> | undefined;

  const preload = () => {
    if (!pending) {
      pending = loader().then((module) => {
        loaded = module.default;
        return module;
      }, (error: unknown) => {
        pending = undefined;
        throw error;
      });
    }
    return pending;
  };

  const LazyPage = lazy(preload);
  function Page() {
    // A completed background load can render without suspending first.
    const Component = loaded ?? LazyPage;
    return <Component />;
  }

  return { Page, preload };
}
