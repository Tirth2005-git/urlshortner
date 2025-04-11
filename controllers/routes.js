import express from "express";
export const router = express.Router();
import { loadFile, saveLink, sendLink } from "../models/model.js";

router.use("/", express.static("./public"))

router.post("/shorten", async (req, res) => {
  try {
    const urls = req.body;
    const longurl = urls.longUrl;
    const shortcode = urls.shortCode;
    console.log(longurl, " ", shortcode);
    let links = await loadFile();

    if (links[shortcode]) {
      throw new Error("Shortcode is Already present!!!");
    }
    links[shortcode] = longurl;
    saveLink(links);
    sendLink(res, shortcode);
  } catch (err) {
    return res.status(500).json({ error: err['message'] })
  }
});

router.get("/config", (req, res) => {
  res.json({
    posturl: process.env.POST,
  });
});
