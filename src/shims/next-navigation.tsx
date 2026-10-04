import { useNavigate, useLocation, useParams as useRouterParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {}
  };
}

export function usePathname(): string {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    entries: () => searchParams.entries(),
    keys: () => searchParams.keys(),
    values: () => searchParams.values(),
    toString: () => searchParams.toString()
  };
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return useRouterParams() as T;
}

export function redirect(url: string): never {
  window.location.replace(url);
  throw new Error(`Redirecting to ${url}`);
}
