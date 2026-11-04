import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { getSalesTrend, getOrderStatusDistribution, getProductPerformance } from '@/services/analyticsService'
import { formatCurrency } from '@/utils/format'

const COLORS = ['#5C2A12', '#E39A3B', '#2B1A10', '#7A3B1A', '#C97F22', '#46200D', '#46332A']

export function AdminReports() {
  const salesTrend = getSalesTrend(6)
  const statusDist = getOrderStatusDistribution().filter((s) => s.count > 0)
  const performance = getProductPerformance()

  return (
    <div>
      <AdminPageHeader title="Reports" description="Sales and performance analytics. [All data is demo only.]" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="heading-serif text-lg font-semibold mb-4">Sales Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="retail" stroke="#5C2A12" strokeWidth={2} name="Retail" />
                <Line type="monotone" dataKey="wholesale" stroke="#E39A3B" strokeWidth={2} name="Wholesale" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="heading-serif text-lg font-semibold mb-4">Order Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDist} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="heading-serif text-lg font-semibold mb-4">Product Performance</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance.slice(0, 8)} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted-border" />
                <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} className="text-xs" />
                <YAxis type="category" dataKey="name" className="text-xs" width={120} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="revenue" fill="#5C2A12" name="Revenue" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted italic">[All figures are derived from demo data and are for demonstration purposes only.]</p>
    </div>
  )
}
