import { useLayoutEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import type { CustomersByIndustry } from "~/routes/__main/datatotals/industry";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  if (percent === 0) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

type Props = { customersByIndustries: CustomersByIndustry[] };
export const IndustryPieChart: React.VFC<Props> = ({
  customersByIndustries,
}) => {
  const [isClient, setIsClient] = useState(false);

  const colors = [
    "#00215d",
    "#00468b",
    "#0071bc",
    "#ff5050",
    "#ff8f86",
    "#e7e7ea",
    "#b5b5b8",
  ];

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <PieChart width={350} height={250} id="industryPieChartId">
      {/*
       サーバー側とクライアント側でレンダリングされるsvgが異なるのか、svg内でレイアウトシフト
       が起こるので、サーバーではレンダリングしないようにする
      */}
      {isClient && (
        <>
          <Legend
            align="left"
            layout="vertical"
            verticalAlign="top"
            width={100}
          />
          <Tooltip />
          <Pie
            startAngle={90}
            endAngle={-270}
            label={renderCustomizedLabel}
            labelLine={false}
            isAnimationActive={false}
            data={customersByIndustries}
            dataKey="customerCount"
            nameKey="businessCategoryName"
            legendType="square"
          >
            {customersByIndustries.map((_, i) => {
              return <Cell key={i} fill={colors[i % colors.length]} />;
            })}
          </Pie>
        </>
      )}
    </PieChart>
  );
};
