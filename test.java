pm.sendRequest({
  url: pm.environment.get("oauth_url"),
  method: "POST",
  header: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  },
  body: {
    mode: "urlencoded",
    urlencoded: [
      { key: "grant_type",    value: "client_credentials" },
      { key: "client_id",     value: pm.environment.get("client_id") },
      { key: "client_secret", value: pm.environment.get("client_secret") },
      { key: "scope",         value: pm.environment.get("scope") }
    ]
  }
}, (err, res) => {
  if (err) {
    console.error("Token fetch error:", err);
    return;
  }
  const json = res.json?.();
  if (json?.access_token) {
    // save it under the name your request uses
    pm.environment.set("access_token", json.access_token);
    // expire one hour later
    pm.environment.set("token_time", Date.now() + 3600*1000);
  } else {
    console.error("No access_token in response:", res.text());
  }
});