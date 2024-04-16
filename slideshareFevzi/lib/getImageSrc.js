"use server"
import fetch from "node-fetch";
import { load } from "cheerio";


export async function getImageSrc(url) {
    try {
        // GET HTML
        const response = await fetch(url, { mode: 'no-cors' });
        const html = await response.text();
        const $ = await load(html);
        // GET IMAGES' SRCS
        const imgSrcs = $('img[sizes="100vw"]');
        const counter = imgSrcs.length;
        const firstImage = $('img[sizes="100vw"]').first().attr("srcset");
        // RETURN DATAS
        const data = { counter, firstImage };
        return data;
    } catch (error) {
        console.error('Error:', error);
        return error.Message || error.Error || error;
    }
}
