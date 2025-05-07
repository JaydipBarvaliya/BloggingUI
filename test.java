if (pm.environment.get("token_time") <= Date.now() || !pm.environment.has("token_time")) {

    var bodyData = 
        "grant_type=client_credentials" +
        "&client_id=" + encodeURIComponent(pm.environment.get("client_id")) +
        "&client_secret=" + encodeURIComponent(pm.environment.get("client_secret")) +
        "&scope=" + encodeURIComponent(pm.environment.get("scope"));

    pm.sendRequest({
        url: pm.environment.get("oauth_url"),
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: bodyData
        }
    }, function (err, res) {
        console.log("Token Response:", res);

        try {
            if (res && res.json) {
                let json = res.json();
                if (json.access_token) {
                    pm.environment.set("auth_token", "Bearer " + json.access_token);
                    pm.environment.set("token_time", Date.now() + (60 * 60 * 1000));
                } else {
                    console.error("access_token not found in response.");
                }
            } else {
                console.error("Invalid response or .json not available.");
            }
        } catch (e) {
            console.error("Error parsing token response:", e);
        }
    });
}

pm.environment.set("guid", (new Date().getTime().toString(16) + Math.floor(167 + Math.random()).toString(16)));