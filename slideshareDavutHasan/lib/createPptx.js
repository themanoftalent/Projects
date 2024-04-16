

import pptxgen from "pptxgenjs";
import { urlToBase64 } from "./urltobase64";

export const createPptx = async (imagesSrcs) => {
    // create pptx generator
    let pres = new pptxgen();
    // set promises to wait
    let promises = [];
    // get images srcs
    imagesSrcs.forEach(src => {
        // create promise
        let promise = new Promise(async (resolve, reject) => {
            try {
                // convert src to base64 (pptxgen could not use url because of cors error)
                const base64Data = await urlToBase64(src);
                // create page
                let slide = pres.addSlide();
                // set image to page
                slide.addImage({
                    data: base64Data,
                    x: 0,
                    y: 0,
                    w: "100%",
                    h: "100%",
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
        // push promise to promises
        promises.push(promise);
    });
    // wait for promises
    await Promise.all(promises);
    // download file
    pres.writeFile();
}