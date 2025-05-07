pm.sendRequest({
    url: pm.environment.get("oauth_url"),
    method: 'POST',
    header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    },
    body: {
        mode: 'urlencoded',
        urlencoded: [
            { key: 'grant_type', value: 'client_credentials' },
            { key: 'client_id', value: pm.environment.get('client_id') },
            { key: 'client_secret', value: pm.environment.get('client_secret') },
            { key: 'scope', value: pm.environment.get('scope') }
        ]
    }
}, function (err, res) {
    console.log("Token Response:", res);

    try {
        if (res && res.json) {
            let json = res.json();
            if (json.access_token) {
                pm.environment.set("auth_token", "Bearer " + json.access_token);
                pm.environment.set("token_time", Date.now() + (60 * 60 * 1000)); // 1 hour expiry
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