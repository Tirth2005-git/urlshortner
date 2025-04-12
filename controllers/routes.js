import express from "express";
export const router = express.Router();
import { loadFile, saveLink, sendLink } from "../models/model.js";

router.use("/", express.static("./public"));

router.post("/shorten", async (req, res) => {
  try {
    const urls = req.body;
    const longurl = urls.longUrl;
    const shortcode = urls.shortCode;
    let links = await loadFile();

    if (links[shortcode]) {
      throw new Error("Shortcode is Already present!!!");
    }
    links[shortcode] = longurl;
    saveLink(links);
    sendLink(res, shortcode);
  } catch (err) {
    return res.status(500).json({ error: err["message"] });
  }
});

router.get("/config", (req, res) => {
  res.json({
    posturl: process.env.POST,
  });
});

router.get("/:shortcode", async (req, res) => {
  try {
    let shortcode;
    if ((shortcode = req.params.shortcode)) {
      const links = await loadFile();
      if (!links[shortcode]) {
        throw new Error("Sorry!!...Not found");
      }
     res.redirect(links[shortcode])
    } else {
      throw new Error("An error has occured");
    }
  } catch (err) {
    return res.status(500).send(` error: ${err["message"]} `);
  }
});
