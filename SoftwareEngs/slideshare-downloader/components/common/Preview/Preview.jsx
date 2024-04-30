import { useContext } from "react";
import { AppContext } from "@/store";
import { AppActions } from "@/store";
import { DownloadPDF } from "@/components/common";
import { Button } from "@/components/ui";
import { SelectAllIcon } from "@/components/icons";
import styles from "./Preview.module.css";

const Preview = ({ props }) => {
  const { state, dispatch } = useContext(AppContext);

  const openSelectionMode = () => {
    dispatch({
      type: AppActions.SET_SELECTION_MODE,
      payload: true,
    });

    Promise.resolve().then(() => {
      document
        .getElementById("selection")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className={styles.cardContainer} id={"preview"} {...props}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={state.slides[0]} alt="Slide Cover" />
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          <b>Title: </b>
          {
            // split to max 50 characters
            state.title.length > 50
              ? state.title.substring(0, 50) + "..."
              : state.title
          }
        </div>

        <div>
          <b>Page Count: </b>
          {state.slideSize}
        </div>

        <DownloadPDF label={"Download Full Slide"} full={true} />

        <Button
          label={"Download Selected Pages"}
          onClick={openSelectionMode}
          icon={<SelectAllIcon />}
          kind="text"
        />
      </div>
    </div>
  );
};

export default Preview;
