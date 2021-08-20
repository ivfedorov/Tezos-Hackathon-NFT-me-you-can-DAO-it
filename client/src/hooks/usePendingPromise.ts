import { useState, useEffect } from "react";

export const usePendingPromise = <T extends unknown>(
  fetcher: () => Promise<T>,
  transformer?: (result: T) => any
) => {
  const [fetching, setFetching] = useState<boolean>();
  const [error, setError] = useState<string>();
  const [data, setStorage] = useState<string>();

  useEffect(() => {
    let isUnmounted = false;
    (async () => {
      try {
        setFetching(true);
        setError(undefined);

        const result = await fetcher();
        const newStorage = transformer ? transformer(result) : result;
        !isUnmounted && setStorage(newStorage);
      } catch (e) {
        !isUnmounted &&
          setError(
            "Something went wrong while fetching storage: " +
              JSON.stringify(e).toString()
          );
      } finally {
        !isUnmounted && setFetching(false);
      }
    })();

    return () => {
      isUnmounted = true;
    };
  }, [fetcher, transformer]);

  return { fetching, error, data };
};
