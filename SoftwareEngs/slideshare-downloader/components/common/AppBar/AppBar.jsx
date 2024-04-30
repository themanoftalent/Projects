import cn from "classnames";
import useScrollPosition from "@/hooks/useScrollPosition";
import { FileSaveIcon } from "@/components/icons";
import styles from "./AppBar.module.css";

const AppBar = () => {
  const { y } = useScrollPosition();

  return (
    <nav className={cn(styles.nav_wrapper, y > 0 ? styles.scroll : "")}>
      <div className={styles.nav}>
        <span className={styles.logo}>
          <FileSaveIcon />
          SlideShare Downloader
        </span>
        <span></span>
      </div>
    </nav>
  );
};

export default AppBar;
