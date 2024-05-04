"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function Return({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [account, setAccount] = useState<any>();
  const [url, setUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const createProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/product/${params.id}`, { method: "POST" });
      const json = await res.json();
      setUrl(json.link.url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/retrieve/${params.id}`,
          {
            method: "GET",
          }
        );
        const json = await res.json();
        if (res.status === 200) {
          setAccount(json.account);
        } else {
          setErrorMessage(json.message ?? "エラーが発生しました");
        }
      } catch (error) {
        setErrorMessage("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params]);

  return (
    <div>
      {account && !isLoading && <p>StripeのID: {account.id}</p>}
      {account && !url && !isLoading && (
        <button onClick={createProduct}>商品作成する</button>
      )}
      {url && (
        <Link href={url} target="_blank">
          決済URLはこちらから
        </Link>
      )}
      {errorMessage && (
        <div>
          <h2>エラーが発生しました</h2>
          <p>{errorMessage}</p>
        </div>
      )}
      {isLoading && <div>{isLoading && <p>Loading ...</p>}</div>}
    </div>
  );
}
