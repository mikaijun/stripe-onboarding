"use client";

import React, { useCallback, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleConnect = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch("/api/account", { method: "POST" });
      const json = await res.json();
      const { url } = json;
      if (url) {
        window.location.href = url;
      } else {
        setIsError(true);
        setIsLoading(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setIsLoading(true);
    }
  }, []);
  return (
    <div>
      <h2>Stripe連携</h2>
      {!isLoading && <button onClick={handleConnect}>連携する</button>}
      {isError && <p>エラーが発生しました</p>}
      {isLoading && <div>{isLoading && <p>Loading ...</p>}</div>}
    </div>
  );
}
