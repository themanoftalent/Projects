function splitTextWithRegex(text) {
  const match = /(?<=-)(\d+)(?=-\d+.jpg)/g.exec(text);
  if (match) {
    const index = match.index + match[0].length;
    return [text.slice(0, index).slice(0, -1), text.slice(index)];
  } else {
    return [text];
  }
}

function generateLinks(firstSlide, size) {
  let slides = [];
  let urlParts = splitTextWithRegex(firstSlide);
  for (let i = 0; i < size; i++) {
    slides.push(`${urlParts[0]}${i + 1}${urlParts[1]}`);
  }
  return slides;
}

export const getSlideLinks = (firstSlide, size) => {
  firstSlide = firstSlide
    //.replace("-320.jpg", "-2048.jpg")
    .replace("-320.jpg", "-638.jpg");
  //.replace("/85/", "/75/");
  return generateLinks(firstSlide, size);
};

export const getThumbnailLinks = (firstSlide, size) => {
  firstSlide = firstSlide
    .replace("-2048.jpg", "-320.jpg")
    .replace("/75/", "/85/");
  return generateLinks(firstSlide, size);
};
