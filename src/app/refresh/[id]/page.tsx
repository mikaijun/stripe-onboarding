import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Refresh() {
  const {
    query: { id: connectedAccountId },
  } = useRouter();
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    if (connectedAccountId) {
      setAccountLinkCreatePending(true);
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
    }
  }, [connectedAccountId]);

  return (
    <div className="container">
      <div className="banner">
        <h2>MJファイナンス</h2>
      </div>
      <div className="content">
        {error && <p className="error">エラーです!</p>}
      </div>
      <div className="dev-callout">
        {connectedAccountId && (
          <p>
            アカウントID: <code className="bold">{connectedAccountId}</code>
          </p>
        )}
        {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
      </div>
    </div>
  );
}
