// 1️⃣ Only fetch if we don't have a token yet, or if it's already expired
const expiresAt = pm.environment.get("osstoken_expiresAt");
if (!expiresAt || Date.now() >= parseInt(expiresAt,10)) {
  
  // 2️⃣ Fire your JSON POST just like in the Body tab
  pm.sendRequest({
    url: pm.environment.get("osstoken_url"),
    method: "POST",
    header: {
      "Content-Type": "application/json",
      "Accept":       "application/json"
    },
    body: {
      mode: "raw",
      raw: JSON.stringify({
        clientId: pm.environment.get("osstoken_clientId"),
        secret:   pm.environment.get("osstoken_secret"),
        type:     pm.environment.get("osstoken_type")
      })
    }
  }, (err, res) => {
    if (err) {
      console.error("OSSToken fetch error:", err);
      return;
    }
    if (res.code !== 200) {
      console.error("OSSToken request failed:", res.code, res.text());
      return;
    }

    // 3️⃣ Pull out the token & expiry and save them
    const json = res.json();
    pm.environment.set("osstoken_accessToken", json.accessToken);
    pm.environment.set("osstoken_expiresAt",   json.expiresAt.toString());
  });
}