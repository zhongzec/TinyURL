import interpolateColors from "./chromaticColors";

export const chartData = (chartConfig) => {
  const { labels, data, colorRangeInfo, scale, dataLabel } = chartConfig;

  // chromatic color data
  const dataLenght = labels.length;

  // sets d3 interpolate color range
  const colorScale = scale;

  const randomColor = interpolateColors(dataLenght, colorScale, colorRangeInfo);

  return {
    labels: labels,
    datasets: [
      {
        label: dataLabel,
        data,
        backgroundColor: randomColor,
        borderColor: randomColor,
        borderWidth: 1,
      },
    ],
  };
};
