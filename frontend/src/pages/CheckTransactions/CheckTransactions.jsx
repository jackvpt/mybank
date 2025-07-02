import "./CheckTransactions.scss"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// DEV imports
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

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
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material"

import {
  fetchTransactionsByAccountName,
  updateTransaction,
} from "../../api/transactions"
import CheckTransactionsToolBar from "../../components/CheckTransactionsToolBar/CheckTransactionsToolBar"
import CheckTransactionEdit from "../../components/CheckTransactionEdit/CheckTransactionEdit"
import {
  setCheckingCurrentAmount,
  setNoneTransactionChecked,
  setSelectedCheckTransactionIds,
} from "../../features/parametersSlice"
import CheckTransactionsToolBox from "../../components/CheckTransactionsToolBox/CheckTransactionsToolBox"

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

const CheckTransactions = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const checkInitialAmount = useSelector(
    (state) => state.parameters.checking.initialAmount
  )

  const updateMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions", bankAccountName])
    },
    onError: (error) => {
      console.error("Erreur lors de la modification :", error)
    },
  })

  const bankAccountName = useSelector((state) => state.parameters.bankAccount)
  const selectedCheckTransactionIds = useSelector(
    (state) => state.parameters.selectedCheckTransactionIds
  )
  const isMobile = useMediaQuery(theme.breakpoints.down("tablet"))
  const visibleColumns = visibleColumnsConfig(isMobile)

  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("date")

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions", bankAccountName],
    queryFn: () => fetchTransactionsByAccountName(bankAccountName),
    enabled: !!bankAccountName,
  })

  const unvalidatedTransactions = transactions.filter(
    (tx) => tx.status !== "validated"
  )

  const isCheckTransactionsEditWindowVisible = useSelector(
    (state) => state.parameters.isCheckTransactionsEditWindowVisible
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

    updateMutation.mutate({
      id: transaction.id,
      updatedData: transaction,
    })

    updateCheckCurrentAmount()
  }

  const updateCheckCurrentAmount = () => {
    const pointedTransactions = unvalidatedTransactions.filter(
      (tx) => tx.status === "pointed"
    )

    const totalDebit = pointedTransactions.reduce(
      (sum, tx) => sum + (tx.debit || 0),
      0
    )
    const totalCredit = pointedTransactions.reduce(
      (sum, tx) => sum + (tx.credit || 0),
      0
    )
    const currentAmount =
      parseFloat(checkInitialAmount) + totalCredit - totalDebit

    dispatch(setCheckingCurrentAmount(currentAmount))

    dispatch(setNoneTransactionChecked(pointedTransactions.length === 0))
  }

  if (isLoading) return <p>Chargement des transactions...</p>
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
                          (col) => col.id === "status" && col.show
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

export default CheckTransactions
