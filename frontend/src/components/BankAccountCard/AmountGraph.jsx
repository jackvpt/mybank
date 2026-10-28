// 🎨 Styles
import "./AmountGraph.scss"

// ⚛️ React
import { useMemo } from "react"

// 🪝 Hooks
import { useGetAllTransactions } from "../../hooks/useTransactions"

//  Recharts
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Functions
import { dateToCustomMMYY } from "../../utils/formatNumber"

const AmountGraph = ({ account }) => {
  // 🌐 Data
  const { data: allTransactions = [] } = useGetAllTransactions()

  const dailyBalances = useMemo(() => {
    // Daily totals (local key "YYYY-MM-DD"), chronologically sorted
    const totals = new Map()
    allTransactions
      .filter((transaction) => transaction.accountId === account._id)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((transaction) => {
        const day = new Date(transaction.date).toLocaleDateString("sv-SE")
        totals.set(day, (totals.get(day) ?? 0) + transaction.amount)
      })

    // Sum of daily totals to get the balance at the end of each day
    let balance = account.initialBalance ?? 0
    return [...totals].map(([date, total]) => {
      balance += total
      return { date, balance: Math.round(balance * 100) / 100 }
    })
  }, [allTransactions, account._id, account.initialBalance])

  const filled = []
  for (let index = 0; index < dailyBalances.length; index++) {
    filled.push(dailyBalances[index])
    if (index < dailyBalances.length - 1) {
      const d = new Date(dailyBalances[index].date)
      const end = new Date(dailyBalances[index + 1].date)
      for (d.setDate(d.getDate() + 1); d < end; d.setDate(d.getDate() + 1)) {
        filled.push({
          date: d.toLocaleDateString("sv-SE"),
          balance: dailyBalances[index].balance,
        })
      }
    }
  }

  const chartData = useMemo(() => {
    const byMonth = new Map()
    dailyBalances.forEach(({ date, balance }) => {
      const month = date.slice(0, 7) // "2026-10"
      const m = byMonth.get(month) ?? {
        min: { date, balance },
        max: { date, balance },
      }
      if (balance < m.min.balance) m.min = { date, balance }
      if (balance > m.max.balance) m.max = { date, balance }
      byMonth.set(month, m)
    })

    const minDates = new Set([...byMonth.values()].map((m) => m.min.date))
    const maxDates = new Set([...byMonth.values()].map((m) => m.max.date))

    return dailyBalances.map((p) => ({
      ...p,
      min: minDates.has(p.date) ? p.balance : null,
      max: maxDates.has(p.date) ? p.balance : null,
    }))
  }, [dailyBalances])

  const euro = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })

  if (chartData.length === 0) {
    return
  }

  return (
    <div className="container__amountGraph">
      <ResponsiveContainer>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f8cff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f8cff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => dateToCustomMMYY(date)}
            minTickGap={24}
          />
          <YAxis tickFormatter={(value) => `${value} €`} width={60} />
          <Tooltip
            labelFormatter={(date) => dateToCustomMMYY(new Date(date))}
            formatter={(value) => [euro.format(value), "Solde"]}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#4f8cff"
            fill="url(#balanceFill)"
            strokeWidth={2}
          />
          <Tooltip
            labelFormatter={(d) => new Date(d).toLocaleDateString("fr-FR")}
            formatter={(v, name) => [euro.format(v), name]}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Solde"
            stroke="#4f8cff"
            fill="url(#balanceFill)"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="min"
            name="Min du mois"
            stroke="orange"
            strokeWidth={2}
            dot={{ r: 0 }}
            connectNulls
          />
          <Line
            type="linear"
            dataKey="max"
            name="Max du mois"
            stroke="#43a047"
            strokeWidth={2}
            dot={{ r: 0 }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AmountGraph
