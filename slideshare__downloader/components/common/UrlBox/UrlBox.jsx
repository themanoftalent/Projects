import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, AppActions } from "@/store";
import { isSlideShareUrl, upgradetoHTTPS } from "@/utils/url";
import { Button } from "@/components/ui";
import { DownloadIcon } from "@/components/icons";
import styles from "./UrlBox.module.css";

const UrlBox = () => {
  const { state, dispatch } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetUrl = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }
    setIsLoading(true);

    let url = document.getElementById(styles.input).value.trim();
    if (isSlideShareUrl(url) === false) {
      dispatch({ type: AppActions.SET_INVALID_URL, payload: true });
      setIsLoading(false);
      return;
    }
    url = upgradetoHTTPS(url);

    dispatch({ type: AppActions.SET_INVALID_URL, payload: false });
    dispatch({ type: AppActions.SET_URL, payload: url });

    fetch(`/api/slide?url=${url}`)
      .then((res) => {
        if (!res.ok) {
          dispatch({ type: AppActions.SET_INVALID_URL, payload: true });
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        dispatch({ type: AppActions.RESET });
        if (!data) {
          dispatch({ type: AppActions.SET_INVALID_URL, payload: true });
          throw new Error("No data received");
        }
        dispatch({ type: AppActions.SET_TITLE, payload: data.title });
        dispatch({
          type: AppActions.SET_SLIDE_SIZE,
          payload: data.size,
        });
        dispatch({ type: AppActions.SET_THUMBS, payload: data.thumbs });
        dispatch({ type: AppActions.SET_SLIDES, payload: data.slides });
        dispatch({
          type: AppActions.SET_SELECTED_SLIDES,
          payload: data.slides,
        });
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Autosize textarea
  const textarea = useRef(null);
  const resize = (event) => {
    // trim leading and trailing spaces
    event.target.value = event.target.value?.trim();
    //scroll to top
    event.target.scrollTop = 0;
    textarea.current.style.height = "auto";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  };

  const handleInput = (event) => {
    // press enter to submit
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("button_submit_url").click();
      // blur to hide keyboard on mobile
      if (!state.invalidUrl) event.target.blur();
      return false;
    }
    resize(event);
  };

  useEffect(function onFirstMount() {
    window.addEventListener("resize", resize);
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* <label htmlFor={styles.input} className={styles.label}>
        Enter the URL of the SlideShare presentation you want to download
      </label> */}
      <form className={styles.form} onSubmit={handleSetUrl}>
        <textarea
          id={styles.input}
          className={styles.input}
          type="text"
          placeholder="Enter SlideShare URL"
          autoFocus={true}
          onClick={(e) => e.target.select()}
          disabled={isLoading}
          pattern="^(?:https?:\/\/)?(?:www\.)?slideshare\.net\/.*$"
          title="Enter a valid SlideShare URL"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          rows={1}
          required
          onKeyUp={handleInput}
          onChange={resize}
          ref={textarea}
        ></textarea>
        <Button
          type={"submit"}
          className={styles.button}
          disabled={isLoading}
          isLoading={isLoading}
          icon={<DownloadIcon />}
          id={"button_submit_url"}
        />
      </form>
      <label className={styles.error}>
        {state.invalidUrl && "Invalid SlideShare URL"}
      </label>
    </div>
  );
};

export default UrlBox;
