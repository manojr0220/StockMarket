/* eslint max-len: ["error", { "code": 2000 }] */

import { COLORS } from "../UIkit/color/color";
interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  cursor?: string;
}

const SvgSpinner = ({
  fill,
  width = 52,
  height = 52,
  className,
  cursor,
}: Props) => (
  <div style={{ width: 20, height: 20 }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width={width}
      height={height}
      style={{
        shapeRendering: "auto",
        display: "block",
        background: "rgb(255, 255, 255)",
      }}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <g transform="rotate(0 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.875s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(45 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.75s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(90 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.625s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(135 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.5s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(180 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.375s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(225 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.25s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(270 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.125s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(315 50 50)">
          <rect
            fill={COLORS.primary}
            height="17"
            width="7"
            ry="3.06"
            rx="3.06"
            y="21.5"
            x="46.5"
          >
            <animate
              repeatCount="indefinite"
              begin="0s"
              dur="1s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g></g>
      </g>{" "}
    </svg>
  </div>
);

export default SvgSpinner;
