import cn from "classnames";
import styles from "./Spinner.module.css";

function Spinner({ className, ...props }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      className={cn(styles.spinner, className)}
      {...props}
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="rgba(128,128,128,.5)"
        strokeWidth="4"
        opacity="0.2"
      ></circle>
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke={"currentColor"}
        strokeDasharray="80"
        strokeDashoffset="60"
        strokeWidth="4"
      ></circle>
    </svg>
  );
}

export { Spinner };
