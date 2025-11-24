import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function ExpenseChart({ expenses }) {
  if (expenses.length === 0) return null;

  const data = expenses.map((e) => ({
    name: e.title,
    value: e.amount
  }));

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Expense Distribution</h2>

      <PieChart width={300} height={300}>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={`hsl(${index * 40}, 70%, 50%)`} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
