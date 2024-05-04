"use client";

import React, { useEffect, useState } from "react";

export default function Return({ params }: { params: { id: string } }) {
  const [account, setAccount] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string>("");
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
          <h2>提出しました！</h2>
          <p>ID: {account.id}</p>
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
