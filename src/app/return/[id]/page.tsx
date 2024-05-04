"use client";

import React, { useCallback, useEffect, useState } from "react";

export default function Return({ params }: { params: { id: string } }) {
  const [account, setAccount] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const createProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/product/${params.id}`, { method: "POST" });
      const json = await res.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  }, [params]);

  useEffect(() => {
    async function fetchData() {
      try {
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
      }
    }
    fetchData();
  }, [params]);

  return (
    <div>
      {account && (
        <div>
          <h2>提出しました</h2>
          <p>ID: {account.id}</p>
          <button onClick={createProduct}>商品作成する</button>
        </div>
      )}
      {errorMessage && (
        <div>
          <h2>エラーが発生しました</h2>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
