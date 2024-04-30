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
        const splitedString = string.split('1-2048');   
        const firstString = splitedString[0];
        const secondString = splitedString[1];
        const srcString = firstString + i + '-2048' + secondString;
        strings.push(srcString);
    }
    return strings;
}