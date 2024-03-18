import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  fontSize: '0.8rem',
  color: theme.palette.common.black,
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.common.white,
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#5D8AA8', // light green color for heading
  fontWeight: 'bold',
  padding: '10px',
  fontSize: '0.8rem',
}));

function createData(name, void_fraction, surface_area_m2cm3, surface_area_m2g, pld, lcd) {
  return {
    name,
    void_fraction,
    surface_area_m2cm3,
    surface_area_m2g,
    pld,
    lcd,
  };
}

const customData = [];

for (let i = 0; i <= 15; i++) {
  customData[i] = require(`./../json_data/hMOF-${i}.json`);
}

let originalRows = [];

for (let i = 0; i < customData.length; i++) {
  originalRows.push(
    createData(
      customData[i].name,
      customData[i].void_fraction,
      customData[i].surface_area_m2cm3,
      customData[i].surface_area_m2g,
      customData[i].pld,
      customData[i].lcd,
    ),
  );
}

function descendingComparator(a, b, orderBy) {
  if (!a.hasOwnProperty(orderBy) || !b.hasOwnProperty(orderBy)) {
    return 0;
  }

  if (typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number') {
    return b[orderBy] - a[orderBy];
  }

  if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
    return a[orderBy].localeCompare(b[orderBy]);
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
    tooltipText: 'The unique name or identifier for each entry.',
  },
  {
    id: 'void_fraction',
    numeric: true,
    disablePadding: false,
    label: 'Void Fraction',
    tooltipText: 'The fraction of the volume of voids over the total volume.',
  },
  {
    id: 'surface_area_m2cm3',
    numeric: true,
    disablePadding: false,
    label: 'ASA [m²/cm³]',
    tooltipText: 'Surface area per unit volume in square meters per cubic centimeter.',
  },
  {
    id: 'surface_area_m2g',
    numeric: true,
    disablePadding: false,
    label: 'ASA [m²/g]',
    tooltipText: 'Surface area per unit mass in square meters per gram.',
  },
  {
    id: 'pld',
    numeric: true,
    disablePadding: false,
    label: 'PLD [Å]',
    tooltipText: 'Pore limiting diameter, indicating the maximum size of molecules that can enter the pores.',
  },
  {
    id: 'lcd',
    numeric: true,
    disablePadding: false,
    label: 'LCD [Å]',
    tooltipText: 'Largest cavity diameter, representing the size of the largest cavity within the structure.',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableHeadCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Tooltip title={headCell.tooltipText || 'Information'}>
                <span>
                  {headCell.label} <InfoIcon sx={{ fontSize: '10px' }} />
                </span>
              </Tooltip>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableHeadCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  const { searched, onSearchChange, onCancelSearch } = props;

  return (
    <Toolbar>
      <TextField
        id="search-bar"
        value={searched}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name"
        variant="outlined"
        size="small"
        autoComplete="off"
        InputProps={{
          form: {
            autocomplete: 'off',
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searched && (
            <InputAdornment position="end">
              <IconButton aria-label="clear search" onClick={onCancelSearch} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mr: 15 }} // Adjust spacing as needed
      />
      {/* <Tooltip title="Filter Feature Available Soon">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip> */}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  searched: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onCancelSearch: PropTypes.func.isRequired,
};

export default function EnhancedTable({ setSelectedMof }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('void_fraction');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = React.useState('');
  const [rows, setRows] = React.useState(originalRows);

  const requestSearch = (searchedVal) => {
    setSearched(searchedVal);
    const lowercasedValue = searchedVal.toLowerCase();
    const filteredData = originalRows.filter((row) => row.name.toLowerCase().includes(lowercasedValue));
    const sortedData = stableSort(filteredData, getComparator(order, orderBy));
    setRows(sortedData);
  };

  const handleSearchChange = (searchVal) => {
    setSearched(searchVal);
    const sortedData = stableSort(originalRows, getComparator(order, orderBy));
    setRows(sortedData);
  };

  const cancelSearch = () => {
    setSearched('');
    setRows(originalRows); // Reset to original rows
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedData = stableSort(rows, getComparator(isAsc ? 'desc' : 'asc', property));
    setRows(sortedData);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNameClick = (name) => {
    setSelectedMof(name);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%', height: '80%', mb: 3 }}>
      <Paper sx={{ width: '100%', height: '80%' }}>
        <EnhancedTableToolbar onCancelSearch={cancelSearch} onSearchChange={requestSearch} searched={searched} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead onRequestSort={handleRequestSort} order={order} orderBy={orderBy} />
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.name); // Ensure that 'isSelected' checks the correct identifier
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)} // Make sure 'handleClick' is using the correct identifier
                    // role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name} // Ensure that 'key' is unique and consistent
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StyledTableCell
                      id={labelId}
                      scope="row"
                      sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleNameClick(row.name)}
                        sx={{ width: '100%', justifyContent: 'left', fontSize: '0.8rem' }}
                      >
                        {row.name}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.void_fraction}</StyledTableCell>
                    <StyledTableCell align="right">{row.surface_area_m2cm3}</StyledTableCell>
                    <StyledTableCell align="right">{row.surface_area_m2g}</StyledTableCell>
                    <StyledTableCell align="right">{row.pld}</StyledTableCell>
                    <StyledTableCell align="right">{row.lcd}</StyledTableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" /> */}
    </Box>
  );
}
