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
import ToolBar from "../../components/ToolBar/ToolBar"
import TransactionEdit from "../../components/TransactionEdit/TransactionEdit"

/**
 * Transactions component that fetches and displays transactions for a selected bank account.
 * It allows filtering by date and sorting by various columns.
 * @returns {JSX.Element} Transactions component
 */
const Transactions = () => {
  const bankAccountName = useSelector((state) => state.settings.bankAccount)
  const isEditWindowVisible = useSelector(
    (state) => state.settings.isEditWindowVisible
  )
  // State to manage the visibility of the edit window
  // This state is used to toggle the visibility of the edit window for transactions

  /**
   * Create a theme for responsive design.
   * This theme defines breakpoints for different screen sizes.
   */
  const theme = createTheme({
    breakpoints: {
      values: {
        tablet: 768,
      },
    },
  })

  const isMobileScreen = useMediaQuery(theme.breakpoints.down("tablet"))

  // Define which columns should be visible based on screen size
  const visibleColumns = [
    { id: "date", label: "Date", show: true },
    { id: "label", label: "Libellé", show: true },
    { id: "debit", label: "Débit", show: !isMobileScreen },
    { id: "credit", label: "Crédit", show: !isMobileScreen },
    { id: "status", label: "Etat", show: !isMobileScreen },
  ]

  // Fetch transactions using React Query
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions", bankAccountName],
    queryFn: () => fetchTransactionsByAccountName(bankAccountName),
    enabled: !!bankAccountName,
  })

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [dateFilter, setDateFilter] = useState("all")

  /**
   * Filter transactions based on the selected date range.
   * @returns {Array} filtered list of transactions
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
      case "previousMonth":
        return txYear === currentYear && txMonth === currentMonth - 1
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
   * Handle sorting logic when a column header is clicked.
   * @param {string} property - The property to sort by
   */
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  /**
   * Sort transactions based on selected order and column.
   * @returns {Array} sorted list of transactions
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

  if (isLoadingTransactions) return <p>Loading transactions...</p>
  if (transactionsError)
    return <p>Error fetching transactions: {transactionsError.message}</p>
  if (!transactions) return <p>No transactions found.</p>

  return (
    <section className="container-transactions">
      <div className="container-transactions__tools">
        <h1>{bankAccountName}</h1>
        <div className="toggle-tools">
          <ToolBar />

          {/* FormControl for date filtering */}
          <FormControl className="date-form-control" size="small">
            <InputLabel id="date-filter-label">Dates</InputLabel>
            <Select
              labelId="date-filter-label"
              value={dateFilter}
              label="Dates"
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value={"all"}>Toutes</MenuItem>
              <MenuItem value={"currentYear"}>
                Année en cours ({currentYear})
              </MenuItem>
              <MenuItem value={"lastYear"}>
                Année dernière ({currentYear - 1})
              </MenuItem>
              <MenuItem value={"last12months"}>12 derniers mois</MenuItem>
              <MenuItem value={"currentMonth"}>Mois en cours</MenuItem>
              <MenuItem value={"previousMonth"}>Mois précédent</MenuItem>
              <MenuItem value={"last3months"}>3 derniers mois</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {transactions && (
        <>
          {isEditWindowVisible && <TransactionEdit />}
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "75vh", overflow: "auto" }}
          >
            <Table aria-label="transactions table">
              {/* Table header */}
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
              {/* Table body */}
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
