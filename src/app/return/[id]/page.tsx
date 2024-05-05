"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function Return({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountId, setAccountId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChangePrice = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrice(e.target.value);
    },
    []
  );

  const handleChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  const createProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = { price, name };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${params.id}`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const json = await res.json();
      if (res.status === 200) {
        setUrl(json.link.url);
      } else {
        setErrorMessage(json.message ?? "エラーが発生しました");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [params, price, name]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/retrieve/${params.id}`,
          {
            method: "GET",
          }
        );
        const json = await res.json();
        if (res.status === 200) {
          setAccountId(json.account.id);
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
      {accountId && !isLoading && <p>StripeのID: {accountId}</p>}
      {accountId && !url && !isLoading && (
        <div>
          <div>金額</div>
          <input onChange={handleChangePrice} />
          <div style={{ marginTop: "16px" }}>件名</div>
          <input onChange={handleChangeName} />
          <div style={{ marginTop: "32px" }}>
            <button onClick={createProduct}>商品作成する</button>
          </div>
        </div>
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
