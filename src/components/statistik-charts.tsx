import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Statistik } from "@/lib/desa";

const COLORS = ["var(--color-brand)", "var(--color-accent-sky)", "#5eead4", "#7dd3fc", "#0e7490", "#38bdf8"];

export default function StatistikCharts({ rows, pie }: { rows: Statistik[]; pie?: boolean }) {
  const data = rows.map((r) => ({ name: r.label, jumlah: r.jumlah }));
  if (pie) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="jumlah" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => v.toLocaleString("id-ID")} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -10, right: 8 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: number) => v.toLocaleString("id-ID")} />
        <Bar dataKey="jumlah" name="Jiwa" radius={[8, 8, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
