import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';

// * useFetcher의 응답 데이터를 콜백으로 전달해 실행하는 래퍼 훅
export const useFetcherWithCallback = <T>(
  callback: (data: ReturnType<typeof useFetcher<T>>['data']) => void,
  key?: string,
) => {
  const fetcher = useFetcher<T>({ key });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fetcher.state === 'submitting' || fetcher.state === 'loading') {
      setIsLoading(true);
    }
    if (isLoading && fetcher.state === 'idle' && fetcher.data) {
      setIsLoading(false);
      callback(fetcher.data);
    }
  }, [callback, fetcher, isLoading]);

  return { fetcher, isLoading };
};
