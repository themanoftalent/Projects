import { useContext, useState } from "react";
import { AppContext } from "@/store";
import { Button } from "@/components/ui";
import { DownloadIcon } from "@/components/icons";
import styles from "./DownloadPDF.module.css";

const DownloadPDF = ({ label, disabled, full }) => {
  const { state } = useContext(AppContext);
  const [pdfData, setPdfData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/create-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(full ? state.slides : state.selected_slides),
      });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error("API request failed");
      }

      const pdfBlob = await response.blob();
      setPdfData(pdfBlob);

      // save the PDF using FileSaver.js
      const FileSaver = require("file-saver");
      FileSaver.saveAs(pdfBlob, state.title);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Button
      onClick={handleButtonClick}
      disabled={isLoading || disabled}
      isLoading={isLoading}
      icon={<DownloadIcon />}
      label={label || "Download as PDF"}
      kind="text"
    />
  );
};

export default DownloadPDF;
