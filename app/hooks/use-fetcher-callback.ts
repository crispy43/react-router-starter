import { useEffect } from 'react';
import { useFetcher } from 'react-router';

import type { ToJson } from '~/common/types';

// * useFetcher의 응답 데이터를 콜백으로 전달해 실행하는 래퍼 훅
export const useFetcherCallback = <T>(callback: (data: ToJson<T>) => void) => {
  const fetcher = useFetcher<T>();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      callback(fetcher.data as ToJson<T>);
    }
  }, [callback, fetcher]);

  return fetcher;
};
