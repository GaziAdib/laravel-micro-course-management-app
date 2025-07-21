import '../../../css/analytics.css'; // Relative path to your CSS

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartProps {
  data: {
    name: string;
    value: number;
  }[];
  colors?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showRecentDays?: number;
}

export function BarChart({
  data,
  colors = ["hsl(var(--primary))"],
  xAxisLabel,
  yAxisLabel,
  showRecentDays,
}: BarChartProps) {
  // Custom Tooltip Content Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 border border-border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Value: </span>
            <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // If showing recent days, filter and format dates
  const chartData = showRecentDays
    ? data
        .slice(-showRecentDays)
        .map((item) => ({
          ...item,
          name: new Date(item.name).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }))
    : data;

  return (
    <div className="h-full w-full  analytics-container-light dark:analytics-container-dark">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          <XAxis
            dataKey="name"
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -5,
              fill: "hsl(var(--foreground))",
            }}
          />
          <YAxis
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--foreground))",
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "hsl(var(--accent))",
              fillOpacity: 0.3,
              stroke: "hsl(var(--primary))",
              strokeWidth: 1,
            }}
          />
          <Legend
            wrapperStyle={{
              color: "hsl(var(--foreground))",
            }}
          />
          <Bar
            dataKey="value"
            name="Value"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="hsl(var(--border))"
                strokeWidth={1}
                style={{
                  transition: 'fill 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.fillOpacity = 0.8;
                  e.target.style.filter = 'drop-shadow(0 0 2px hsl(var(--primary)/0.5))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.fillOpacity = 1;
                  e.target.style.filter = 'none';
                }}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}









// "use client";

// import {
//   BarChart as RechartsBarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// interface BarChartProps {
//   data: {
//     name: string;
//     value: number;
//   }[];
//   colors?: string[];
//   xAxisLabel?: string;
//   yAxisLabel?: string;
//   showRecentDays?: number;
// }

// export function BarChart({
//   data,
//   colors = ["hsl(var(--primary))"],
//   xAxisLabel,
//   yAxisLabel,
//   showRecentDays,
// }: BarChartProps) {
//   // If showing recent days, filter and format dates
//   const chartData = showRecentDays
//     ? data
//         .slice(-showRecentDays)
//         .map((item) => ({
//           ...item,
//           name: new Date(item.name).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//           }),
//         }))
//     : data;

//   return (
//     <div className="h-full w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         <RechartsBarChart
//           data={chartData}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid
//             strokeDasharray="3 3"
//             stroke="hsl(var(--border))"
//             opacity={0.3}
//           />
//           <XAxis
//             dataKey="name"
//             tick={{
//               fill: "hsl(var(--muted-foreground))",
//               fontSize: 12,
//             }}
//             label={{
//               value: xAxisLabel,
//               position: "insideBottom",
//               offset: -5,
//               fill: "hsl(var(--foreground))",
//             }}
//           />
//           <YAxis
//             tick={{
//               fill: "hsl(var(--muted-foreground))",
//               fontSize: 12,
//             }}
//             label={{
//               value: yAxisLabel,
//               angle: -90,
//               position: "insideLeft",
//               fill: "hsl(var(--foreground))",
//             }}
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "hsl(var(--background))",
//               borderColor: "hsl(var(--border))",
//               borderRadius: "calc(var(--radius) - 2px)",
//               color: "hsl(var(--foreground))",
//             }}
//           />
//           <Legend
//             wrapperStyle={{
//               color: "hsl(var(--foreground))",
//             }}
//           />
//           {colors.map((color, index) => (
//             <Bar
//               key={index}
//               dataKey="value"
//               fill={color}
//               name={`Data ${index + 1}`}
//               radius={[4, 4, 0, 0]}
//             />
//           ))}
//         </RechartsBarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }






// "use client";

// import {
//   BarChart as RechartsBarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// interface BarChartProps {
//   data: {
//     name: string;
//     value: number;
//   }[];
//   colors?: string[];
//   xAxisLabel?: string;
//   yAxisLabel?: string;
//   showRecentDays?: number;
// }

// export function BarChart({
//   data,
//   colors = ["#3b82f6"],
//   xAxisLabel,
//   yAxisLabel,
//   showRecentDays,
// }: BarChartProps) {
//   // If showing recent days, filter and format dates
//   const chartData = showRecentDays
//     ? data
//         .slice(-showRecentDays)
//         .map((item) => ({
//           ...item,
//           name: new Date(item.name).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//           }),
//         }))
//     : data;

//   return (
//     <div className="h-full w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         <RechartsBarChart
//           data={chartData}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
//           <XAxis
//             dataKey="name"
//             label={{ value: xAxisLabel, position: "insideBottom", offset: -5 }}
//           />
//           <YAxis
//             label={{
//               value: yAxisLabel,
//               angle: -90,
//               position: "insideLeft"
//             }}
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "hsl(var(--background))",
//               borderColor: "hsl(var(--border))",
//               borderRadius: "calc(var(--radius) - 2px)",
//             }}
//           />
//           <Legend />
//           {colors.map((color, index) => (
//             <Bar
//               key={index}
//               dataKey="value"
//               fill={color}
//               name={`Data ${index + 1}`}
//               radius={[4, 4, 0, 0]}
//             />
//           ))}
//         </RechartsBarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
