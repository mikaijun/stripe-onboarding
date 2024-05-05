"use client";

import { CreateAccountResponse } from "@/app/api/account/route";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Refresh({ params }: { params: { id: string } }) {
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/account`,
          { method: "POST" }
        );
        const json = (await res.json()) as CreateAccountResponse;
        const { url } = json;
        if (url) {
          window.location.href = url;
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error(error);
        setIsError(true);
      }
    }
    fetchData();
  }, [params]);

  return (
    <>
      {isError && (
        <div>
          <h2>エラーが発生しました。再度やり直してください</h2>
          <Link href="/">トップページ</Link>
        </div>
      )}
    </>
  );
}
