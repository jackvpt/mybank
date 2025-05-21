import "./Transactions.scss"
import { fetchTransactionsByAccountName } from "../../api/transactions"
import { useQuery } from "@tanstack/react-query"
import {
  Box,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"

const Transactions = () => {
  const bankAccountName = useSelector((state) => state.settings.bankAccount)
  const theme = createTheme({
    breakpoints: {
      values: {
        tablet: 768,
      },
    },
  })
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("tablet"))

  const visibleColumns = [
    { id: "date", label: "Date", show: true },
    { id: "label", label: "Libellé", show: true },
    { id: "debit", label: "Débit", show: !isMobileScreen },
    { id: "credit", label: "Crédit", show: !isMobileScreen },
    { id: "status", label: "Val.", show: !isMobileScreen },
  ]

  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions", bankAccountName],
    queryFn: () => fetchTransactionsByAccountName(bankAccountName),
    enabled: !!bankAccountName,
  })

  // Set current year for filtering
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [dateFilter, setDateFilter] = useState("all")

  /**
   * Filter transactions based on the selected year.
   * If the year is 0, all transactions are shown.
   */
  const filteredTransactions = transactions.filter((tx) => {
    const txYear = new Date(tx.date).getFullYear()
    const txMonth = new Date(tx.date).getMonth() + 1
    switch (dateFilter) {
      case "all":
        return true
      case "currentYear":
        return txYear === currentYear
      case "lastYear":
        return txYear === currentYear - 1
      case "last12months": {
        const today = new Date()
        const lastYear = new Date(today)
        lastYear.setMonth(today.getMonth() - 12)
        return new Date(tx.date) >= lastYear
      }
      case "currentMonth":
        return txYear === currentYear && txMonth === currentMonth
      case "last3months": {
        const today = new Date()
        const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1)
        return new Date(tx.date) >= startDate
      }
      default:
        return false
    }
  })

  const [order, setOrder] = useState("desc")
  const [orderBy, setOrderBy] = useState("date")

  /**
   *
   * @param {string} property
   * @description Handles sorting of transactions based on the selected property.
   * Toggles the order between ascending and descending.
   */
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  /**
   * Sort transactions based on the selected property and order.
   * The sorting is done using the JavaScript sort method.
   */
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[orderBy]
    const bValue = b[orderBy]

    if (orderBy === "date") {
      const aDate = new Date(aValue)
      const bDate = new Date(bValue)
      return order === "asc" ? aDate - bDate : bDate - aDate
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue
    }

    return order === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  if (isLoadingTransactions) return <p>Chargement des transactions...</p>
  if (transactionsError)
    return <p>Erreur transactions : {transactionsError.message}</p>
  if (!transactions) return <p>Aucune transaction trouvée.</p>

  return (
    <section className="container-transactions">
      <div className="container-transactions__tools">
        <h1>{bankAccountName}</h1>
        <FormControl className="date-form-control" size="small">
          <InputLabel id="date-filter-label">
            Dates
          </InputLabel>
          <Select
            labelId="date-filter-label"
            value={dateFilter}
            label="Dates"
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <MenuItem value={"all"}>
              Toutes
            </MenuItem>
            <MenuItem value={"currentYear"}>
              Année en cours ({currentYear})
            </MenuItem>
            <MenuItem value={"lastYear"}>
              Année précédente ({currentYear - 1})
            </MenuItem>
            <MenuItem value={"last12months"}>
              12 derniers mois
            </MenuItem>
            <MenuItem value={"currentMonth"}>
              Mois en cours{" "}
            </MenuItem>
            <MenuItem value={"last3months"}>
              3 derniers mois complets
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {transactions && (
        <>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "75vh", overflow: "auto" }}
          >
            <Table aria-label="transactions table">
              <TableHead>
                <TableRow>
                  {visibleColumns
                    .filter((column) => column.show)
                    .map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align="center"
                        sx={{
                          height: 14,
                          paddingTop: 1,
                          paddingBottom: 1,
                          lineHeight: 1,
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#f5f5f5",
                          zIndex: 1,
                        }}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : "asc"}
                          onClick={() => handleSort(headCell.id)}
                          sx={{
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTransactions.map((tx) => (
                  <TableRow key={tx.id} className="transaction-row">
                    <TableCell align="center">
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tx.label}</TableCell>
                    <TableCell align="center">
                      {tx.debit ? tx.debit.toFixed(2) + " €" : ""}
                    </TableCell>
                    <TableCell align="center">
                      {tx.credit ? tx.credit.toFixed(2) + " €" : ""}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor:
                            tx.status === "validated"
                              ? "green"
                              : tx.status === "pointed"
                              ? "blue"
                              : "white",
                          border: "1px solid #ccc",
                          margin: "0 auto",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {transactions.length === 0 && (
              <Typography
                variant="body2"
                sx={{ padding: 2, textAlign: "center" }}
              >
                No transactions found.
              </Typography>
            )}
          </TableContainer>
        </>
      )}
    </section>
  )
}

export default Transactions
