import { useContext } from "react";
import cn from "classnames";
import { AppActions, AppContext } from "@/store";
import { Button } from "@/components/ui";
import { DownloadPDF } from "@/components/common";
import { DeselectIcon, SelectAllIcon } from "@/components/icons";
import styles from "./ActionBar.module.css";

const ActionBar = ({ className }) => {
  const { state, dispatch } = useContext(AppContext);

  const handleSelectAll = () => {
    dispatch({
      type: AppActions.SET_SELECTED_SLIDES,
      payload: state.slides,
    });
  };

  const handleDeselectAll = () => {
    dispatch({
      type: AppActions.SET_SELECTED_SLIDES,
      payload: [],
    });
  };

  return (
    <div className={cn(styles.actionBar, className)}>
      <Button
        label={"Select All"}
        className={styles.button}
        onClick={handleSelectAll}
        disabled={state.selected_slides.length === state.slides.length}
        icon={<SelectAllIcon />}
        kind="text"
      />
      |
      <Button
        label={"Deselect All"}
        className={styles.button}
        onClick={handleDeselectAll}
        disabled={state.selected_slides.length === 0}
        icon={<DeselectIcon />}
        kind="text"
      />
      |
      <DownloadPDF
        label={"Download Selected"}
        disabled={state.selected_slides.length === 0}
      />
      <div className={styles.pageCount}>
        {state.selected_slides.length}/{state.slides.length}
      </div>
    </div>
  );
};

export default ActionBar;
