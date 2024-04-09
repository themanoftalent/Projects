// get images hd url
export const splitString = (string) => {
    return string.split(' ')[4];
}

// all image's url same
// only different is sorting number
// I can reach all images by using fist image and image amount
export const multiplyString =  ( counter , string ) =>{
    const strings = [];
    for (let i = 1; i < counter+1 ; i++){
        const firstPart = string.slice(0, -24);
        const secondPart = string.slice(-23, string.length);
        const srcString = firstPart + i + secondPart;   
        strings.push(srcString);
    }
    return strings;
}