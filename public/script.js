document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button").addEventListener("click", () => {
    shortenUrl();
  });
});

async function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value;
  const shortCode = document.getElementById("shortCode").value;

  if (!longUrl || !shortCode) {
    document.getElementById("result").textContent = "Please fill both fields";
    return;
  }

  try {
    const posturl = "https://urlshortner-production-de7b.up.railway.app/shorten"
   
    const res = await fetch(posturl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl, shortCode }),
    });
    if (res.ok) {
      const data = await res.json();
      document.getElementById(
        "result"
      ).innerHTML = `<a href=${data.shorturl} target="_blank">${data.shorturl}</a>`;

      alert("url has been shortened sucessfully!!!");
    } else if (!res.ok) {
      const data = await res.json();
      alert(data.error);
    }
  } catch (err) {
    alert(err);
  }
}
