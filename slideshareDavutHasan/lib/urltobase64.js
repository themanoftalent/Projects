"use server"
import fetch from "node-fetch";

export const urlToBase64 = async (imageUrl) =>{
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    const base64Image = imageBuffer.toString('base64');
    return 'data:image/jpeg;base64,' + base64Image;
}