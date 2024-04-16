import { useContext } from "react";
import cn from "classnames";
import { AppActions, AppContext } from "@/store";
import { ActionBar } from "@/components/common";
import styles from "./Selection.module.css";

const Selection = ({ props }) => {
  const { state, dispatch } = useContext(AppContext);

  const onClickHandler = (e, index) => {
    e.preventDefault();
    dispatch({ type: AppActions.TOGGLE_SLIDE, payload: state.slides[index] });
  };

  return state.thumbs.length ? (
    <div className={styles.wrapper} {...props} id={"selection"}>
      <ActionBar className={styles.actions} />

      <div className={styles.thumbs}>
        {state.thumbs.map((image, index) => (
          <div
            className={cn(
              styles.thumbContainer,
              state.selected_slides.includes(state.slides[index]) &&
                styles.selected
            )}
            onClick={(e) => onClickHandler(e, index)}
            key={index}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={index}
              className={cn(styles.thumb)}
              src={image}
              alt={`Thumbnail ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default Selection;
