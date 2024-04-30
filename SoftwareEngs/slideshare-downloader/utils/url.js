export const isSlideShareUrl = (url) => {
  // Regular expression to match valid URLs
  // with optional protocol and slideshare.net domain
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?slideshare\.net\/.*$/i;

  if (!urlRegex.test(url)) {
    return false;
  }
  return url;
};

export const upgradetoHTTPS = (url) => {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  } else if (url.startsWith("https://")) {
    return url;
  } else {
    return "https://" + url;
  }
};
