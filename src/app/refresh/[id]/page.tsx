"use client";

import React, { useEffect } from "react";

export default function Refresh({ params }: { params: { id: string } }) {
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/account", { method: "POST" });
        const json = await res.json();
        const { url } = json;
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [params]);

  return <div>再実行中・・・</div>;
}
