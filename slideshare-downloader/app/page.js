"use client";
import { createPptx } from "@/lib/createPptx";
import { multiplyString, splitString } from "@/lib/editString";
import { getImageSrc } from "@/lib/getImageSrc";
import { useState } from "react";

export default function Home() {
  // variables
  const [isLoading, setLoading] = useState(false);
  const [slideShareUrl, setSlideShareUrl] = useState("");
  const [error, setError] = useState("");
  // click function
  const handleClick = async () => {
    try {
      setLoading(true);
      // check is url slideshare link
      if (!slideShareUrl.startsWith("https://www.slideshare.net/")) {
        // if not set error
        setError('Link have to starts with "https://www.slideshare.net". Please check again.');
        setSlideShareUrl('');
        return
      }
      // get images datas
      const { counter, firstImage } = await getImageSrc(slideShareUrl);
      // if no data set error
      if (counter === 0 || firstImage === undefined) {
        setError('Presentation could not be found. Please check your link again.');
        return;
      }
      // set images by using first image and counter
      const imageSrc = splitString(firstImage);
      const imageSrcs = multiplyString(counter, imageSrc);
      // create pptx file
      await createPptx(imageSrcs);
      setLoading(false);
      setError('');
      // catch error
    } catch (error) {
      setError(error.message || error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // html elements
  return (
    <main className="h-screen flex flex-col pt-32 px-4 lg:p-0 lg:justify-center items-center lg:gap-8 gap-4 bg-slate-950">
      {/* texts */}
      <div className="lg:w-2/3 w-full hover:cursor-default">
        {/* text0 */}
        <div className="flex flex-row justify-center items-end gap-2">
          <h2 className="text-5xl lg:text-9xl font-bold text-yellow-500">WELCOME</h2>
          <p className="lg:text-2xl text-md font-bold text-yellow-500">to</p>
        </div>
        {/* text1 */}
        <div className="flex flex-row justify-center items-end gap-2 text-xl lg:text-6xl font-extrabold">
          <h1 className="text-blue-500">SLIDESHARE</h1>
          <h1 className="text-green-700">DOWNLOADER</h1>
        </div>
        {/* text2 */}
        <div className=" text-[7px] lg:text-sm font-extralight text-center  text-gray-400 lg:mt-2">
          <p > Enter slide share presentation link and click to download button, download
            may take up to a minute depending on the size of the presentation. Then
            you can reach to presentation as pptx(power point slide) file.</p>
          <p>The link you enter have to starts with 'https://www.slideshare.net/'.</p>
          <p className="hidden lg:inline-block">For example, https://www.slideshare.net/marketingartwork/ai-trends-in-creative-operations-2024-by-artwork-flowpdf</p>
        </div>
      </div>
      {/* input and button */}
      <div className="lg:w-2/3  w-full flex flex-col items-center justify-center gap-4 ">
        {/* input */}
        <input
          className="w-full  text-[10px] lg:text-lg text-white placeholder:text-gray-500 lg:p-4 px-3 py-2 rounded-2xl lg:border-[4px] border-2 border-blue-500 bg-transparent"
          placeholder="Enter slideshare presentation link here"
          onChange={(e) => { setSlideShareUrl(e.target.value); }}
        />
        {/* download button */}
        <button
          className="bg-green-700 border-[4px] hover:border-white border-green-700  rounded-3xl lg:text-3xl text-xs font-bold lg:px-8 lg:py-4 px-2 py-1 disabled:opacity-50 hover:bg-green-600"
          onClick={(e) => handleClick()}
          disabled={isLoading || slideShareUrl === ''}
        >
          {isLoading ? "LOADING..." : "DOWNLOAD"}
        </button>
        <div className="text-red-400 text-[9px] font-normal lg:text-xl lg:font-semibold text-center h-1">{error}</div>
      </div>
    </main>
  );
}
