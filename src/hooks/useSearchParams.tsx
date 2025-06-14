import { useEffect, useState } from "react";

export const setQuery = (params: Record<string, string | null | undefined>, dispatch = true) => {
  const s = Object.entries(params).filter(([k, v]) => v !== null && v !== undefined) as [string, string][];
  const state = new URLSearchParams(s).toString();

  history.replaceState(null, '', `?${state}`);
  if (dispatch) {
    dispatchEvent(new PopStateEvent('popstate', { state: null }));
  }
}

export const useSearchParams = () => {
    const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(window.location.search));
    
    useEffect(() => {
        window.addEventListener('popstate', (e) => {
            setSearchParams(new URLSearchParams(window.location.search));
        });
    }, []);
}