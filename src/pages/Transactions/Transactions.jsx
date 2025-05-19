import "./Transactions.scss"
import { fetchTransactionsByAccountName } from "../../api/transactions"
import { useQuery } from "@tanstack/react-query"
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

  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("date")

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
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
      <h1>{bankAccountName}</h1>

      {transactions && (
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
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f5f5f5",
                        "z-index": 1,
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() => handleSort(headCell.id)}
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
      )}
    </section>
  )
}

export default Transactions
