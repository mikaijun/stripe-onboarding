"use client";

import React, { useState } from "react";

export default function Home() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();

  return (
    <div className="container">
      <div className="banner">
        <h2>MJファイナンス</h2>
      </div>
      <div className="content">
        {!connectedAccountId && <h2>Stripe連携</h2>}
        {!connectedAccountId && (
          <p>
            MJファイルナンスとStripe連携します。連携済みのアカウントは入れないでくださいね
          </p>
        )}
        {connectedAccountId && (
          <h2>情報を追加してテスト送金の受け入れを開始する</h2>
        )}
        {!accountCreatePending && !connectedAccountId && (
          <button
            onClick={async () => {
              setAccountCreatePending(true);
              setError(false);
              fetch("/api/account", {
                method: "POST",
              })
                .then((response) => response.json())
                .then((json) => {
                  setAccountCreatePending(false);

                  const { account, error } = json;

                  if (account) {
                    setConnectedAccountId(account);
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            連携する
          </button>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <button
            onClick={async () => {
              setAccountLinkCreatePending(true);
              setError(false);
              fetch("/api/account_link", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  account: connectedAccountId,
                }),
              })
                .then((response) => response.json())
                .then((json) => {
                  setAccountLinkCreatePending(false);

                  const { url, error } = json;
                  if (url) {
                    window.location.href = url;
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            情報を追加
          </button>
        )}
        {error && <p className="error">エラーです</p>}
        {(connectedAccountId ||
          accountCreatePending ||
          accountLinkCreatePending) && (
          <div className="dev-callout">
            {connectedAccountId && (
              <p>
                アカウントID: <code className="bold">{connectedAccountId}</code>
              </p>
            )}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
      </div>
    </div>
  );
}
