const BASE_URL = "https://www.melivecode.com";

export async function apiLogin(username: string, password: string) {
    const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, expiresIn: 60000 })
    });
    return await response.json();
}
