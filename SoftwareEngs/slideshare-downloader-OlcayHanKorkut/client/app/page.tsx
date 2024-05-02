"use client";
import axios from "axios";
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export type ImageDt = {
  srcset: string;
  src: string;
  alt: string;
  type: string;
  sizes: string;
};

const Page = () => {
  const [data, setData] = useState<ImageDt[]>([]);
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isLoadingPPTX, setIsLoadingPPTX] = useState<boolean>(false);

  const scrapeData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/api/scrape", {
        url: url,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const convertPdfData = async () => {
    try {
      setIsLoadingPdf(true);
      const response = await axios.post(
        "http://localhost:5000/api/pdfcon",
        {
          images: data,
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "slideshare.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingPdf(false);
    }
  };
  const convertPPTXData = async () => {
    try {
      setIsLoadingPPTX(true);
      const response = await axios.post(
        "http://localhost:5000/api/pptxcon",
        {
          images: data,
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "slideshare.pptx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingPPTX(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col justify-start items-center w-full h-full mt-20 gap-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="font-bold text-[40px]">SlideShare Downloader</p>
          <p className="font-bold text-[24px] opacity-70">
            Download Free Presentation
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-full max-w-[800px] bg-blue-300 rounded-lg p-5">
          <div className="grid grid-cols-8 gap-5 w-full p-2">
            <input
              type="text"
              className="col-span-6 rounded-full p-3 outline-blue-500"
              placeholder="Paste url here..."
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className="col-span-2 bg-orange-300 p-2 rounded-xl disabled:opacity-50"
              onClick={scrapeData}
              disabled={!url || isLoading}
            >
              {isLoading ? (
                <ClipLoader
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Fetch Data"
              )}
            </button>
          </div>
          <div className="grid grid-cols-8 w-full gap-5 p-2">
            <button
              className="col-span-4 bg-orange-300 p-2 rounded-xl disabled:opacity-50"
              onClick={convertPdfData}
              disabled={data.length === 0 || isLoadingPdf}
            >
              {isLoadingPdf ? (
                <ClipLoader
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Download as PDF"
              )}
            </button>

            <button
              className="col-span-4 bg-orange-300 p-2 rounded-xl disabled:opacity-50"
              onClick={convertPPTXData}
              disabled={data.length === 0 || isLoadingPPTX}
            >
              {isLoadingPPTX ? (
                <ClipLoader
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Download as PPTX"
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-start items-center gap-10 h-[800px] overflow-y-auto p-4">
          {data.map((data, key) => (
            <img src={data.src} alt={key.toString()} width={800} key={key} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
