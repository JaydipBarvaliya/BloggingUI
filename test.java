//–– build the token request ––
const tokenRequest = {
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
};

//–– fire it off, grab the token and stash it ––
pm.sendRequest(tokenRequest, (err, res) => {
  if (err) {
    console.error("Token fetch error:", err);
    return;
  }
  if (res.code !== 200) {
    console.error("Token request failed:", res.code, res.text());
    return;
  }

  const json = res.json();
  pm.environment.set("access_token", json.access_token);
  // optional: save token_type & expiry
  pm.environment.set("token_type",   json.token_type  || "Bearer");
  pm.environment.set("token_expires", Date.now() + (json.expires_in * 1000));
});