import "./RecurringTransactions.scss"
import { fetchAllRecurringTransactions } from "../../api/recurringTransactions"
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
import { useDispatch, useSelector } from "react-redux"
import RecurringTransactionEdit from "../../components/RecurringTransactionEdit/RecurringTransactionEdit"
import { selectRecurringTransactionId } from "../../features/settingsSlice"
import { fetchAllSettings } from "../../api/settings"

/**
 * RecurringTransactions component that fetches and displays recurring transactions.
 * It allows filtering by date and sorting by various columns.
 * @returns {JSX.Element} Transactions component
 */
const RecurringTransactions = () => {
  const dispatch = useDispatch()

  // Fetch settings using React Query
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchAllSettings(),
  })

  const selectedRecurringTransactionId = useSelector(
    (state) => state.settings.selectedRecurringTransactionId
  )

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
    { id: "account", label: "Compte", show: true },
    { id: "type", label: "Type", show: true },
    { id: "label", label: "Libellé", show: true },
    { id: "debit", label: "Débit", show: !isMobileScreen },
    { id: "credit", label: "Crédit", show: !isMobileScreen },
    { id: "periodicity", label: "Périodicité", show: true },
  ]

  // Fetch recurring transactions using React Query
  const {
    data: recurringTransactions = [],
    isLoading: isLoadingRecurringTransactions,
    error: recurringTransactionsError,
  } = useQuery({
    queryKey: ["recurringTransactions"],
    queryFn: () => fetchAllRecurringTransactions(),
    refetchInterval: 60000, // Every 60 seconds
    refetchOnWindowFocus: true,
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
   * Sort recurring transactions based on selected order and column.
   * @returns {Array} sorted list of transactions
   */
  const sortedRecurringTransactions = [...recurringTransactions].sort(
    (a, b) => {
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
    }
  )

  const handleRowClick = (transaction) => {
    dispatch(selectRecurringTransactionId(transaction.id))
  }

  if (isLoadingRecurringTransactions || isLoadingSettings)
    return <p>Loading recurring transactions...</p>
  if (recurringTransactionsError || settingsError)
    return (
      <p>Error fetching transactions: {recurringTransactionsError.message}</p>
    )
  if (!recurringTransactions) return <p>No recurring transactions found.</p>

  const convertPeriodicityToText = (periodicity) => {
    const periodicities = settings[0].periodicities
    const text = periodicities.find((p) => p.name === periodicity)?.text
    return text
  }
  return (
    <section className="container-transactions">
      {recurringTransactions && (
        <>
          <RecurringTransactionEdit />
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
                {sortedRecurringTransactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className={`transaction-row ${
                      selectedRecurringTransactionId === tx.id
                        ? "rowSelected"
                        : ""
                    }`}
                    onClick={() => handleRowClick(tx)}
                  >
                    <TableCell align="center">
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tx.account}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.label}</TableCell>
                    <TableCell align="center">
                      {tx.debit ? tx.debit.toFixed(2) + " €" : ""}
                    </TableCell>
                    <TableCell align="center">
                      {tx.credit ? tx.credit.toFixed(2) + " €" : ""}
                    </TableCell>
                    <TableCell align="center">{convertPeriodicityToText(tx.periodicity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {recurringTransactions.length === 0 && (
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

export default RecurringTransactions
