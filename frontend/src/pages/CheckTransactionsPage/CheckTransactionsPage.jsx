// 🎨 Styles
import "./CheckTransactionsPage.scss"

// ⚛️ React
import { useState, useMemo } from "react"

// 🏪 Redux
import { useDispatch, useSelector } from "react-redux"

// 🧱 MUI components
import {
  Box,
  createTheme,
  Paper,
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

// 🏗️ Redux slices
import {
  setCheckingCurrentAmount,
  setNoneTransactionChecked,
  setSelectedCheckTransactionIds,
} from "../../store/features/parametersSlice"

// 🧩 Components
import CheckTransactionsToolBar from "../../components/CheckTransactionsToolBar/CheckTransactionsToolBar"
import CheckTransactionEdit from "../../components/CheckTransactionEdit/CheckTransactionEdit"
import CheckTransactionsToolBox from "../../components/CheckTransactionsToolBox/CheckTransactionsToolBox"
import Loader from "../../components/Loader/Loader"

// 🪝 Hooks
import {
  useGetAllTransactions,
  useUpdateTransaction,
} from "../../hooks/useTransactions"

const theme = createTheme({
  breakpoints: { values: { tablet: 768 } },
})

const visibleColumnsConfig = (isMobile) => [
  { id: "date", label: "Date", show: true },
  { id: "label", label: "Libellé", show: true },
  { id: "debit", label: "Débit", show: true },
  { id: "credit", label: "Crédit", show: true },
  { id: "status", label: "État", show: !isMobile },
]

const CheckTransactionsPage = () => {
  const dispatch = useDispatch()

  // 🏪 Redux state
  const checkInitialAmount = useSelector(
    (state) => state.parameters.checking.initialAmount,
  )
  const bankAccountName = useSelector(
    (state) => state.parameters.bankAccount.name,
  )
  const bankAccountId = useSelector((state) => state.parameters.bankAccount.id)
  const selectedCheckTransactionIds = useSelector(
    (state) => state.parameters.selectedCheckTransactionIds,
  )
  const isCheckTransactionsEditWindowVisible = useSelector(
    (state) => state.parameters.isCheckTransactionsEditWindowVisible,
  )

  // 🔄 Mutations (toasts and "transactions" query invalidation are handled
  // inside useTransactions via useMutationWithNotification)
  const { mutate: updateTransaction } = useUpdateTransaction()

  // 📱 Responsive layout
  const isMobile = useMediaQuery(theme.breakpoints.down("tablet"))
  const visibleColumns = visibleColumnsConfig(isMobile)

  // Local state
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("date")

  const {
    isLoading,
    error,
    data: transactionsData = [],
  } = useGetAllTransactions()

  const transactions = useMemo(
    () =>
      (transactionsData ?? []).filter(
        (transaction) => transaction.accountId === bankAccountId,
      ),
    [transactionsData, bankAccountId],
  )

  const unvalidatedTransactions = transactions.filter(
    (tx) => tx.status !== "validated",
  )

  // Sort transactions
  const sortedTransactions = [...unvalidatedTransactions].sort((a, b) => {
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

  const handleSort = (property) => {
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleRowClick = (tx) => {
    dispatch(setSelectedCheckTransactionIds([tx.id]))
  }

  const handleCheckTransaction = (transaction) => {
    const newStatus = transaction.status === "pointed" ? "" : "pointed"
    transaction.status = newStatus

    updateTransaction({
      id: transaction.id,
      updatedData: transaction,
      silent:true
    })

    updateCheckCurrentAmount()
  }

  const updateCheckCurrentAmount = () => {
    const pointedTransactions = unvalidatedTransactions.filter(
      (transaction) => transaction.status === "pointed",
    )

    const totalDebit = pointedTransactions.reduce(
      (sum, transaction) => sum + (transaction.debit || 0),
      0,
    )
    const totalCredit = pointedTransactions.reduce(
      (sum, transaction) => sum + (transaction.credit || 0),
      0,
    )
    const currentAmount =
      parseFloat(checkInitialAmount) + totalCredit - totalDebit

    dispatch(setCheckingCurrentAmount(currentAmount))

    dispatch(setNoneTransactionChecked(pointedTransactions.length === 0))
  }

  if (isLoading) return <Loader variant="inline" size="md" />

  if (error) return <p>Erreur : {error.message}</p>

  updateCheckCurrentAmount()

  return (
    <section className="container-checkTransactions">
      <div className="container-checkTransactions__tools">
        <h1>{bankAccountName}</h1>
        <div className="toggle-tools">
          <CheckTransactionsToolBar />
        </div>
      </div>
      <div className="container-checkTransactions__table">
        <CheckTransactionsToolBox />
        <div className="container-checkTransactions__table__transactions">
          {isCheckTransactionsEditWindowVisible && <CheckTransactionEdit />}

          <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <TableContainer
              component={Paper}
              sx={{ flex: 1, overflow: "auto" }}
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
                  {sortedTransactions.map((tx) => {
                    return (
                      <TableRow
                        onClick={() => handleRowClick(tx)}
                        key={tx.id}
                        className={
                          selectedCheckTransactionIds[0] === tx.id
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
                          (col) => col.id === "status" && col.show,
                        ) && (
                          <TableCell align="center">
                            <Box
                              className={
                                tx.status === "pointed"
                                  ? "check-transaction-pointed"
                                  : "check-transaction-notpointed"
                              }
                              sx={{
                                width: 14,
                                height: 14,
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
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCheckTransaction(tx)
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
                <Typography
                  variant="body2"
                  sx={{ padding: 2, textAlign: "center" }}
                >
                  Aucune transaction trouvée.
                </Typography>
              )}
            </TableContainer>
          </Box>
        </div>
      </div>
    </section>
  )
}

export default CheckTransactionsPage
