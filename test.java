if(pm.environment.get("token_time") <= Date.now() || !pm.environment.has("token_time")) {

    var params = "grant_type=client_credentials" +
        "&client_id=" + pm.environment.get("client_id") +
        "&client_secret=" + pm.environment.get("client_secret") +
        "&scope=" + pm.environment.get("scope");

    pm.sendRequest({
        url: pm.environment.get("oauth_url") + "?" + params,
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: ''
        }
    }, function (err, res) {
        console.log("Token Response:", res);

        try {
            if (res && res.json) {
                let json = res.json();
                if (json && json.access_token) {
                    pm.environment.set("auth_token", "Bearer " + json.access_token);
                    pm.environment.set("token_time", Date.now() + (60 * 60 * 1000)); // 1 hour
                } else {
                    console.log("No access_token found in response.");
                    throw new Error("access_token missing in response JSON.");
                }
            } else {
                console.log("Invalid response object or .json() is undefined.");
                throw new Error("Token request failed: response.json is undefined.");
            }
        } catch (e) {
            console.error("Error while parsing token response:", e);
        }
    });
}

// GUID for traceability
pm.environment.set("guid", (new Date().getTime().toString(16) + Math.floor(167 + Math.random()).toString(16)));