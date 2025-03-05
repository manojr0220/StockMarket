import React from "react";
import { alpha } from "@mui/material/styles";
import { COLORS } from "../color/color";

const generateInitials = (name: string) => {
  const nameParts = name?.trim()?.split(" ").filter(Boolean);
  const initials = nameParts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials;
};

const AvatarWithInitials: React.FC<{
  name?: string;
  fontsize?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  color?: string;
}> = ({
  name = "",
  fontsize = "22px",
  width = "35px",
  height = "35px",
  backgroundColor = '#fff',
  color = COLORS.primary,
}) => {
  const initials = generateInitials(name);

  return (
    <div
      style={{
        width: width,
        height: height,
        border: `1px solid ${color}`,
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        fontSize: fontsize,
        fontWeight: "bold",
      }}
    >
      {initials}
    </div>
  );
};
export default AvatarWithInitials;
