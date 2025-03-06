import "./button.css";
import { alpha } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import { COLORS } from "../color/color";
export default function Button(props) {
  const {
    labelName,
    backgroundColor = COLORS.primary,
    backgroundColordisable = alpha(COLORS.primary, 0.5),
    color = "white",
    showLoader = false,
    width = "100%",
    disabled = false,
    height = "40px",
  } = props;
  return (
    <>
      <button
        className="button-style"
        style={{
          width: width,
          border: disabled ? "none" : `1px solid ${COLORS.primary}`,
          backgroundColor: disabled ? backgroundColordisable : backgroundColor,
          color: color,
          height: height, 
        }}
        onClick={props.onClick}
        width={width}
        height={height}
        disabled={disabled}
      >
        {showLoader ? (
          <span
            className={`spinner-border spinner-border-sm loderboder`}
            role="status"
            style={{ width: "15px", height: "15px" }}
          ></span>
        ) : (
          labelName
        )}
      </button>
    </>
  );
}
