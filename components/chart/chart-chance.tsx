"use client";

export default function ChartChance() {
  const yesPercentage = 60;

  const size = 40;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;

  const gapDegrees = 12;

  return (
    <div className="flex flex-col items-center justify-center w-auto h-full">
      <svg
        height={size}
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        width="100%"
      >
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke=""
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />

        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius * Math.cos(Math.PI * (1 - (yesPercentage - gapDegrees / 2) / 100))} ${size / 2 - radius * Math.sin(Math.PI * (1 - (yesPercentage - gapDegrees / 2) / 100))}`}
          fill="none"
          stroke="#22c55e"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />

        <path
          d={`M ${size / 2 + radius * Math.cos(Math.PI * (1 - (yesPercentage + gapDegrees / 2) / 100))} ${size / 2 - radius * Math.sin(Math.PI * (1 - (yesPercentage + gapDegrees / 2) / 100))} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#ef4444"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />

        <text
          className="fill-foreground font-medium text-[8px]"
          textAnchor="middle"
          x={size / 2}
          y={size / 2}
        >
          {yesPercentage}%
        </text>
        <text
          className="fill-muted-foreground text-xs"
          textAnchor="middle"
          x={size / 2}
          y={size / 2 + 15}
        >
          Chance
        </text>
      </svg>
    </div>
  );
}
