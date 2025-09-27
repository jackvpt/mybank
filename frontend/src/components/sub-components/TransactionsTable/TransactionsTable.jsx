import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  addSelectedTransactionId,
  removeSelectedTransactionId,
  setNewTransactionId,
  setSelectedTransactionIds,
  setTransactionsTableScrollPosition,
} from "../../../features/parametersSlice"



const visibleColumnsConfig = (isMobile) => [
  { id: "date", label: "Date", show: true },
  { id: "label", label: "Libellé", show: true },
  { id: "debit", label: "Débit", show: true },
  { id: "credit", label: "Crédit", show: true },
  { id: "balance", label: "Solde", show: !isMobile },
  { id: "status", label: "État", show: !isMobile },
]

const TransactionsTable = ({ filteredTransactions }) => {
  const dispatch = useDispatch()
  const tableContainerRef = useRef(null)
  const transactionRefs = useRef({})


  const handleScroll = (e) => {
    dispatch(setTransactionsTableScrollPosition(e.currentTarget.scrollTop))
  }

  const transactionsTableScrollPosition = useSelector(
    (state) => state.parameters.transactionsTableScrollPosition
  )

  const newTransactionId = useSelector(
    (state) => state.parameters.newTransactionId
  )

  const visibleColumns = visibleColumnsConfig(false)
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("date")
  const handleSort = (property) => {
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc")
    setOrderBy(property)
  }
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null)

  const selectedTransactionIds = useSelector(
    (state) => state.parameters.selectedTransactionIds
  )

  const bankAccountInitialBalance = useSelector(
    (state) => state.parameters.bankAccount.initialBalance
  )

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[orderBy],
      bValue = b[orderBy]
    if (orderBy === "date")
      return order === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue)
    if (typeof aValue === "number" && typeof bValue === "number")
      return order === "asc" ? aValue - bValue : bValue - aValue
    return order === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  const handleRowClick = (e, tx, index) => {
    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(index, lastSelectedIndex)
      const end = Math.max(index, lastSelectedIndex)
      const ids = sortedTransactions.slice(start, end + 1).map((t) => t.id)
      dispatch(
        setSelectedTransactionIds([
          ...new Set([...selectedTransactionIds, ...ids]),
        ])
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

  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    if (transactionsTableScrollPosition !== null) {
      container.scrollTop = transactionsTableScrollPosition
    } else {
      container.scrollTop = container.scrollHeight
      dispatch(setTransactionsTableScrollPosition(container.scrollTop))
    }

    if (newTransactionId) {
      const element = transactionRefs.current[newTransactionId]
      if (element) {
        container.scrollTo({
          top: element.offsetTop - 100,
          behavior: "auto",
        })
      }
      dispatch(setNewTransactionId(null))
    }
  }, [transactionsTableScrollPosition, dispatch])

  return (
    <TableContainer
      component={Paper}
      ref={tableContainerRef}
      sx={{ flex: 1, overflow: "auto" }}
      onScroll={(e) => {
        handleScroll(e)
      }}
    >
      <Table aria-label="transactions">
        <TableHead>
          <TableRow>
            {visibleColumns
              .filter((col) => col.show)
              .map((col) => (
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

        <TableBody>
          {sortedTransactions.map((tx, index) => {
            const balance = sortedTransactions
              .slice(0, index + 1)
              .reduce(
                (acc, t) => acc + (t.credit || 0) - (t.debit || 0),
                bankAccountInitialBalance
              )

            return (
              <TableRow
                key={tx.id}
                ref={(el) => {
                  if (el) transactionRefs.current[tx.id] = el
                }}
                onClick={(e) => handleRowClick(e, tx, index)}
                className={
                  selectedTransactionIds.includes(tx.id)
                    ? "transaction-row rowSelected"
                    : "transaction-row"
                }
              >
                <TableCell align="center">
                  {new Date(tx.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{tx.label}</TableCell>
                <TableCell align="right">
                  {tx.debit ? tx.debit.toFixed(2) : ""}
                </TableCell>
                <TableCell align="right">
                  {tx.credit ? tx.credit.toFixed(2) : ""}
                </TableCell>
                {visibleColumns.find(
                  (col) => col.id === "balance" && col.show
                ) && (
                  <TableCell
                    align="right"
                    className={`cell__balance ${
                      balance > 0 ? "" : "cell__balance-negative"
                    }`}
                  >
                    {balance.toFixed(2)}
                  </TableCell>
                )}
                {visibleColumns.find(
                  (col) => col.id === "status" && col.show
                ) && (
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
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {sortedTransactions.length === 0 && (
        <Typography variant="body2" sx={{ padding: 2, textAlign: "center" }}>
          Aucune transaction trouvée.
        </Typography>
      )}
    </TableContainer>
  )
}

export default TransactionsTable
