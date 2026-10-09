// 🎨 Styles
import "./TransactionsPage.scss"

// ⚛️ React
import { useState, useEffect, useRef, useMemo } from "react"

// 🏪 Redux
import { useDispatch, useSelector } from "react-redux"

// 🪝 Hooks
import { useGetAllTransactions } from "../../hooks/useTransactions"

// 🏗️ Redux slices
import {
  addSelectedTransactionId,
  removeSelectedTransactionId,
  setNewTransactionId,
  setSelectedTransactionIds,
  setTransactionsTableScrollPosition,
} from "../../store/features/parametersSlice"

// 🧱 MUI components
import {
  Box,
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

// 🧩 Components
import TransactionsToolBar from "../../components/TransactionsToolBar/TransactionsToolBar"
import TransactionEdit from "../../components/TransactionEdit/TransactionEdit"
import Loader from "../../components/Loader/Loader"

// 📱 Screens narrower than 768px use the compact layout
const MOBILE_QUERY = "(max-width:767.95px)"

// 📋 Table columns (`mobileHidden` columns are hidden on small screens)
const COLUMNS = [
  { id: "date", label: "Date" },
  { id: "label", label: "Libellé" },
  { id: "debit", label: "Débit" },
  { id: "credit", label: "Crédit" },
  { id: "balance", label: "Solde", mobileHidden: true },
  { id: "status", label: "État", mobileHidden: true },
]

// 🔢 Columns sorted as numbers
const NUMERIC_COLUMNS = ["debit", "credit", "balance"]

// 🚦 Status dot colors (any other status = white)
const STATUS_COLORS = { validated: "green", pointed: "blue" }

/**
 * Check whether a date matches the selected date filter.
 *
 * @param {Date} date - Transaction date
 * @param {string} filter - Selected filter key
 * @param {Date} today - Reference date
 * @returns {boolean}
 */
const isInDateFilter = (date, filter, today) => {
  const year = today.getFullYear()
  const month = today.getMonth()

  switch (filter) {
    case "currentYear":
      return date.getFullYear() === year
    case "lastYear":
      return date.getFullYear() === year - 1
    case "last12months": {
      const start = new Date(today)
      start.setMonth(month - 12)
      return date >= start
    }
    case "currentMonth":
      return date.getFullYear() === year && date.getMonth() === month
    case "previousMonth": {
      // new Date handles the January -> December (previous year) rollover
      const previous = new Date(year, month - 1, 1)
      return (
        date.getFullYear() === previous.getFullYear() &&
        date.getMonth() === previous.getMonth()
      )
    }
    case "last3months":
      return date >= new Date(year, month - 2, 1)
    default:
      return true
  }
}

/**
 * Transactions page: filterable and sortable table of the selected
 * bank account, with multi-selection (click, Ctrl/Cmd+click, Shift+click).
 *
 * @component
 * @returns {JSX.Element} Rendered TransactionsPage component
 */
const TransactionsPage = () => {
  const dispatch = useDispatch()

  // 📌 Refs
  const tableContainerRef = useRef(null)
  const transactionRefs = useRef({}) // row elements by transaction id

  // 🏪 Redux state
  const bankAccountName = useSelector(
    (state) => state.parameters.bankAccount.name,
  )
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)
  const selectedTransactionIds = useSelector(
    (state) => state.parameters.selectedTransactionIds,
  )
  const isTransactionEditWindowVisible = useSelector(
    (state) => state.parameters.isTransactionEditWindowVisible,
  )
  const transactionsTableScrollPosition = useSelector(
    (state) => state.parameters.transactionsTableScrollPosition,
  )
  const newTransactionId = useSelector(
    (state) => state.parameters.newTransactionId,
  )

  // 📱 Responsive layout
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const visibleColumns = COLUMNS.filter(
    (col) => !(isMobile && col.mobileHidden),
  )

  // 🎛️ Local UI state
  const [dateFilter, setDateFilter] = useState("all")
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("date")
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null) // anchor for Shift+click

  // 🌐 Data
  const {
    data: transactionsData = [],
    isLoading: isLoadingTransactions,
    error: errorTransactions,
  } = useGetAllTransactions()

  // 💰 Transactions of the selected account, with a running balance.
  // The balance is computed on the full date-ordered list, so it stays
  // correct whatever the active filter or sort is.
  const transactions = useMemo(() => {
    const byDate = (transactionsData ?? [])
      .filter(
        (transaction) =>
          transaction.accountId === bankAccountId && transaction.hasValidDate,
      )
      .sort(
        (a, b) => a.date - b.date || String(a.id).localeCompare(String(b.id)),
      )

    let balance = 0 // TODO: start from the account's opening balance if it has one
    return byDate.map((tx) => {
      balance = Math.round((balance + (tx.amount || 0)) * 100) / 100
      tx.balance = balance
      return tx
    })
  }, [transactionsData, bankAccountId])

  // 🔎 Filtered then sorted transactions (what the table displays)
  const sortedTransactions = useMemo(() => {
    const today = new Date()
    const direction = order === "asc" ? 1 : -1

    return transactions
      .filter((transaction) =>
        isInDateFilter(transaction.date, dateFilter, today),
      )
      .sort((a, b) => {
        if (orderBy === "date") {
          return direction * (a.date - b.date)
        }
        if (NUMERIC_COLUMNS.includes(orderBy)) {
          return direction * ((a[orderBy] || 0) - (b[orderBy] || 0))
        }
        return (
          direction *
          String(a[orderBy] ?? "").localeCompare(String(b[orderBy] ?? ""))
        )
      })
  }, [transactions, dateFilter, order, orderBy])

  // ↕️ Toggle sort direction, or change the sorted column
  const handleSort = (property) => {
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc")
    setOrderBy(property)
    setLastSelectedIndex(null) // indexes change with the sort
  }

  // 📅 Change the date filter
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value)
    setLastSelectedIndex(null) // indexes change with the filter
  }

  // 🖱️ Row selection: Shift = range, Ctrl/Cmd = toggle, plain click = single
  const handleRowClick = (e, tx, index) => {
    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(index, lastSelectedIndex)
      const end = Math.max(index, lastSelectedIndex)
      const ids = sortedTransactions.slice(start, end + 1).map((t) => t.id)
      dispatch(
        setSelectedTransactionIds([
          ...new Set([...selectedTransactionIds, ...ids]),
        ]),
      )
    } else if (e.ctrlKey || e.metaKey) {
      selectedTransactionIds.includes(tx.id)
        ? dispatch(removeSelectedTransactionId(tx.id))
        : dispatch(addSelectedTransactionId(tx.id))
      setLastSelectedIndex(index)
    } else {
      dispatch(setSelectedTransactionIds([tx.id]))
      setLastSelectedIndex(index)
    }
  }

  // 📜 Save the scroll position in the store
  const handleScroll = (e) => {
    dispatch(setTransactionsTableScrollPosition(e.currentTarget.scrollTop))
  }

  // 📌 Latest saved scroll position, kept in a ref so the restore effect
  // can read it without re-running on every scroll event
  const savedScrollRef = useRef(transactionsTableScrollPosition)
  useEffect(() => {
    savedScrollRef.current = transactionsTableScrollPosition
  }, [transactionsTableScrollPosition])

  // ⏪ Restore the saved scroll position, or start at the bottom (latest transactions)
  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    if (savedScrollRef.current !== null) {
      container.scrollTop = savedScrollRef.current
    } else {
      container.scrollTop = container.scrollHeight
      dispatch(setTransactionsTableScrollPosition(container.scrollTop))
    }
  }, [transactions, dispatch])

  // ✨ Scroll to a newly created transaction, then clear its id
  useEffect(() => {
    const container = tableContainerRef.current
    if (!container || !newTransactionId) return

    const element = transactionRefs.current[newTransactionId]
    if (!element) return // row not rendered yet: retry when transactions update

    container.scrollTo({ top: element.offsetTop - 100, behavior: "auto" })
    dispatch(setNewTransactionId(null))
  }, [newTransactionId, transactions, dispatch])

  // ⏳ Loading / error states (after all hooks)
  if (isLoadingTransactions) return <Loader variant="inline" size="md" />
  if (errorTransactions) return <p>Erreur : {errorTransactions.message}</p>

  return (
    <section className="container-transactions">
      {/* 🛠️ Header: account name, toolbar and date filter */}
      <div className="container-transactions__tools">
        <h1>{bankAccountName}</h1>
        <div className="toggle-tools">
          <TransactionsToolBar />
          <FormControl className="date-form-control" size="small">
            <InputLabel id="date-filter-label">Dates</InputLabel>
            <Select
              labelId="date-filter-label"
              value={dateFilter}
              label="Dates"
              onChange={handleDateFilterChange}
            >
              <MenuItem value="all">Toutes</MenuItem>
              <MenuItem value="currentYear">Année en cours</MenuItem>
              <MenuItem value="lastYear">Année dernière</MenuItem>
              <MenuItem value="last12months">12 derniers mois</MenuItem>
              <MenuItem value="currentMonth">Mois en cours</MenuItem>
              <MenuItem value="previousMonth">Mois précédent</MenuItem>
              <MenuItem value="last3months">3 derniers mois</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* ✏️ Transaction edit window */}
      {isTransactionEditWindowVisible && <TransactionEdit />}

      {/* 📊 Transactions table */}
      <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <TableContainer
          component={Paper}
          ref={tableContainerRef}
          sx={{ flex: 1, overflow: "auto" }}
          onScroll={handleScroll}
        >
          <Table aria-label="transactions">
            {/* Sticky header with sortable columns */}
            <TableHead>
              <TableRow>
                {visibleColumns.map((col) => (
                  <TableCell
                    key={col.id}
                    align="center"
                    sx={{
                      height: 14,
                      paddingTop: 1,
                      paddingBottom: 1,
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                      zIndex: 1,
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Transaction rows */}
            <TableBody>
              {sortedTransactions.map((transaction, index) => (
                <TableRow
                  key={transaction.id}
                  ref={(el) => {
                    if (el) transactionRefs.current[transaction.id] = el
                  }}
                  onClick={(e) => handleRowClick(e, transaction, index)}
                  className={
                    selectedTransactionIds.includes(transaction.id)
                      ? "transaction-row rowSelected"
                      : "transaction-row"
                  }
                >
                  <TableCell align="center">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.label}</TableCell>
                  <TableCell align="right">
                    {transaction.debit ? transaction.debit.toFixed(2) : ""}
                  </TableCell>
                  <TableCell align="right">
                    {transaction.credit ? transaction.credit.toFixed(2) : ""}
                  </TableCell>

                  {/* Balance and status are hidden on mobile */}
                  {!isMobile && (
                    <>
                      <TableCell align="right">
                        {transaction.balance.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor:
                              STATUS_COLORS[transaction.status] ?? "white",
                            border: "1px solid #ccc",
                            margin: "0 auto",
                          }}
                        />
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty state */}
          {sortedTransactions.length === 0 && (
            <Typography
              variant="body2"
              sx={{ padding: 2, textAlign: "center" }}
            >
              Aucune transaction trouvée.
            </Typography>
          )}
        </TableContainer>
      </Box>
    </section>
  )
}

export default TransactionsPage
