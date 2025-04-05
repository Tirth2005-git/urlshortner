import http from "http";
import { readFile, writeFile } from "fs/promises";
import path from "path";


const PORT = 5000;
async function serveFile(res, pathf, content) {
  try {
    const data = await readFile(pathf);
    res.writeHead(200, { "content-type": content });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("page not found");
   
  }
}

async function loadFile(url) {
  try {
    let data = await readFile(url, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    res.writeHead(400, { "content-type": "text/plain" });
    return res.end("an error has occured");
  }
}

async function saveLink(url, links) {
  try {
    await writeFile(url, JSON.stringify(links));
  } catch (err) {
    res.writeHead(400, { "content-type": "text/plain" });
    return res.end("an error has occured");
  }
}

function sendLink(res, shortCode) {
  try {
    console.log(`http://localhost:${PORT}/${shortCode}`);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ shorturl: `http://localhost:${PORT}/${shortCode}` })
    );
  } catch (err) {
    res.writeHead(400, { "content-type": "text/plain" });
    return res.end("an error has occured");
  }
}
const server = http.createServer(async (req, res) => {
  console.log(req.url);

  if (req.method === "GET") {
    if (req.url === "/") {
      return serveFile(res, path.join("public", "index.html"), "text/html");
    } else if (req.url === `/style.css`) {
      return serveFile(res, path.join("public", "style.css"), "text/css");
    }
  }

  if (req.url === "/shorten" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const { longUrl, shortCode } = JSON.parse(body);

      console.log(longUrl, " ", shortCode);

      if (!longUrl || !shortCode) {
        res.writeHead(400, { "content-type": "text/plain" });
        return res.end("fields are required");
      }

      let links = await loadFile(path.join("data", "links.json"));

      if (links[shortCode]) {
        res.writeHead(400, { "content-type": "text/plain" });
        return res.end("short code already exists!!!");
      }

      links[shortCode] = longUrl;
      await saveLink(path.join("data", "links.json"), links);

      return sendLink(res, shortCode);
    });
  }

  if (req.method === "GET" && req.url) {
    try {
      const links = await loadFile(path.join("data", "links.json"));

      if (!links[req.url.substring(1, req.url.length)]) {
        res.writeHead(404, { "content-type": "text/plain" });
        return res.end("link not found");
      }
      console.log(links[req.url.substring(1, req.url.length)]);

      res.writeHead(302, {
        Location: links[req.url.substring(1, req.url.length)],
      });
      return res.end();
    } catch (err) {
      res.writeHead(400, { "content-type": "text/plain" });
      return res.end("an unexpected error occured");
    }
  }
});

server.listen(PORT, () => {
  console.log(`running at http://localhost:5000/`);
});
