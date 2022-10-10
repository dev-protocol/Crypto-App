import { Table, Grid, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination, Typography, Box, IconButton, useTheme } from "@mui/material";
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Container } from "@mui/system";
import { Api } from "../api/Api";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const {count , page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0)
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  };

  return(
    <Box sx={{flexShrink: 0, ml: 2.5}}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page" className="text-emerald-400">
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page" className="text-emerald-400">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) -1} aria-label="next page" className="text-emerald-400">
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page" className="text-emerald-400">
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );

}



export default function Cryptocurrency() {
  const [data, setData] = useState([""]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) =>  setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(data);

  useEffect(() => {
    new Api().coins
      .marketsList({ vs_currency: "usd", price_change_percentage: "24h" })
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    // <MainLayout>
      <Grid className="w-full">
        <Container>
          <TableContainer className="mt-10">
            <Table className="bg-neutral-900 border-solid border-1 border-gray rounded-2xl border-separate">
              <TableHead>
                <TableRow>
                  <TableCell className="text-neutral-500 font-bold">#</TableCell>
                  <TableCell className="text-neutral-500 font-bold">Name</TableCell>
                  <TableCell className="text-neutral-500 font-bold">Price</TableCell>
                  <TableCell className="text-neutral-500 font-bold">Change</TableCell>
                  <TableCell className="text-neutral-500 font-bold">Market Cap</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data)
                .map((val: any) => {
                  return (
                    <TableRow key={val.id}>
                      <TableCell className="border-0 text-white">{val.market_cap_rank}</TableCell>
                      <TableCell className="border-0 text-white flex">
                        <img src={val.image} alt="Crypto" width={20} height={20}/>
                        <Typography className="mx-3">{val.name}</Typography>
                        <Typography className="text-slate-300">{String(val.symbol).toUpperCase()}</Typography>
                      </TableCell>
                      <TableCell className="border-0 text-white">{val.current_price + "$"}</TableCell>
                      <TableCell
                        className={
                          parseFloat(val.market_cap_change_percentage_24h) >= 0
                            ? "text-green-600 border-0"
                            : "text-red-600 border-0"
                        }
                      >
                        {Number(val.market_cap_change_percentage_24h).toFixed(1) + "%"}
                      </TableCell>
                      <TableCell className="border-0 text-white">{Number(val.market_cap / 1000000000).toFixed(2) + "B"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    className="text-emerald-400"
                    rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Container>
      </Grid>
    // </MainLayout>
  );
}
