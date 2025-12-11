export const OKABE_ITO_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Light Orange", value: "#E69F00" },
  { name: "Light Blue", value: "#56B4E9" },
  { name: "Green", value: "#009E73" },
  { name: "Yellow", value: "#F0E442" },
  { name: "Dark Blue", value: "#0072B2" },
  { name: "Dark Orange", value: "#D55E00" },
  { name: "Pink", value: "#CC79A7" }
];

export function makeClassColorScale(pallette) {
  const scale = [];
  const n = pallette.length;

  for (let i = 0; i < n; ++i) {
    const t0 = i / n;
    const t1 = (i + 1) / n;
    const color = pallette[i].value;

    scale.push([t0, color]);
    scale.push([t1, color]);
  }

  return scale;
}

