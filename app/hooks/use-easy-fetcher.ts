import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';

// * useFetcher 간편한 사용을 위한 래핑 훅
export default function useEasyFetcher<T>(
  callback?: (data: ReturnType<typeof useFetcher<T>>['data']) => void,
  key?: string,
) {
  const fetcher = useFetcher<T>({ key });
  const [isLoading, setIsLoading] = useState(false);

  // intercept submit/load
  const wrappedFetcher = useMemo(() => {
    return {
      ...fetcher,
      submit: (...args: Parameters<typeof fetcher.submit>) => {
        setIsLoading(true);
        fetcher.submit(...args);
      },
      load: (...args: Parameters<typeof fetcher.load>) => {
        setIsLoading(true);
        fetcher.load(...args);
      },
    };
  }, [fetcher]);

  useEffect(() => {
    if (isLoading && fetcher.state === 'idle' && fetcher.data) {
      setIsLoading(false);
      callback?.(fetcher.data);
    }
  }, [fetcher.state, fetcher.data, isLoading, callback]);

  return { fetcher: wrappedFetcher, isLoading };
}
