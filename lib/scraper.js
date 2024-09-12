const axios = require("axios");
const yts = require("yt-search");
const getVideoId = async (...args) =>
    import("get-video-id").then(m => m(...args));

const API = "https://astro-api-crqy.onrender.com/";
const ytIdRegex =
    /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;

async function youtube(query) {
    const trimmedQuery = query.trim();
    const url = `api/youtube-download?url=${encodeURIComponent(trimmedQuery)}`;
    const response = await axios.get(API + url, { responseType: "json" });
    const media = response.data.url;
    const videoResponse = await axios.get(media, {
        responseType: "arraybuffer"
    });
    return Buffer.from(videoResponse.data);
}

async function ytmp3(query) {
    const trimmedQuery = query.trim();
    const url = `api/youtube-mp3-download?url=${encodeURIComponent(
        trimmedQuery
    )}`;
    const response = await axios.get(API + url, { responseType: "json" });
    const media = response.data.audio;
    const videoResponse = await axios.get(media, {
        responseType: "arraybuffer"
    });
    return Buffer.from(videoResponse.data);
}

async function searchUrl(url) {
    if (!isYTUrl(url)) return {};
    const { id } = await getVideoId(url);
    const videoDat = await yts({ videoId: id });
    return videoDat;
}

function isYTUrl(url) {
    return ytIdRegex.test(url);
}

module.exports = {
    searchUrl,
    isYTUrl,
    youtube,
    ytmp3
};
