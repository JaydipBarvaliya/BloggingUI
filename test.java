if (pm.environment.get("token_time") <= Date.now() || !pm.environment.has("token_time")) {
    let url = pm.environment.get("oauth_url") +
        "?grant_type=client_credentials" +
        "&client_id=" + encodeURIComponent(pm.environment.get("client_id")) +
        "&client_secret=" + encodeURIComponent(pm.environment.get("client_secret")) +
        "&scope=" + encodeURIComponent(pm.environment.get("scope"));

    pm.sendRequest({
        url: url,
        method: 'POST',
        header: {
            'Accept': 'application/json'
        }
    }, function (err, res) {
        console.log("Token Response:", res);
        try {
            if (res && res.json) {
                let json = res.json();
                if (json.access_token) {
                    pm.environment.set("auth_token", "Bearer " + json.access_token);
                    pm.environment.set("token_time", Date.now() + (60 * 60 * 1000)); // 1 hour
                } else {
                    console.error("access_token not found.");
                }
            } else {
                console.error("res.json() not available");
            }
        } catch (e) {
            console.error("Error parsing token response:", e);
        }
    });
}