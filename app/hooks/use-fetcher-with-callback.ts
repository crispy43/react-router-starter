import { useEffect } from 'react';
import { useFetcher } from 'react-router';

// * useFetcher의 응답 데이터를 콜백으로 전달해 실행하는 래퍼 훅
export const useFetcherWithCallback = <T>(callback: (data: T) => void, key?: string) => {
  const fetcher = useFetcher({ key });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      callback(fetcher.data as T);
    }
  }, [callback, fetcher]);

  return fetcher;
};
