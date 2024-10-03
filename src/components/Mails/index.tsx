import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Select, Button, Box, Grid2, Avatar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { CheckCircle, Cancel } from '@mui/icons-material';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

console.log(apiDomain)

// Sample mail data
// @ts-ignore
const initialMails = [
  { id: 1, block: 'A', apartament: 101, received_at: new Date('2023-01-15') },
  { id: 2, block: 'B', apartament: 202, received_at: new Date('2023-03-10') },
  { id: 3, block: 'A', apartament: 303, received_at: new Date('2023-05-05') },
  { id: 4, block: 'B', apartament: 404, received_at: new Date('2023-07-20') },
  
];

// Mail interface
interface Mail {
  id: number;
  block: string;
  apartament: number;
  received_at: Date;
  status: boolean; // New field added to interface for status
}

const Mails: React.FC = () => {
  const [mails, setMails] = useState<Mail[]>([]); // State to hold the fetched deliveries

  const [blockFilter, setBlockFilter] = useState<string>('');
  const [apartmentFilter, setApartmentFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // New state for status filter
  // @ts-ignore
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  // @ts-ignore
  const [error, setError] = useState<string | null>(null); // Error state


  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchMails = async () => {
      try {
        const response = await fetch(`${apiDomain}/deliveries`);
        if (!response.ok) {
          throw new Error('Failed to fetch mails');
        }
        const data = await response.json();
        console.log(data)
        setMails(data); // Set the data to state
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        // @ts-ignore
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMails();
  }, []);

  // Filtering logic
  // const filteredMails = initialMails.filter((mail) => {
  const filteredMails = mails.filter((mail) => {
    const matchesBlock = blockFilter ? mail.block === blockFilter : true;
    const matchesApartment = apartmentFilter
      ? mail.apartament === parseInt(apartmentFilter, 10)
      : true;
    const matchesStartDate = startDateFilter
      ? new Date(mail.received_at) >= new Date(startDateFilter)
      : true;
    const matchesEndDate = endDateFilter
      ? new Date(mail.received_at) <= new Date(endDateFilter)
      : true;
    const matchesStatus =
      statusFilter !== ''
        ? mail.status === (statusFilter === 'true')
        : true;
    return matchesBlock && matchesApartment && matchesStartDate && matchesEndDate && matchesStatus;
  });

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircle style={{ color: 'green' }} />
        ) : (
          <Cancel style={{ color: 'red' }} />
        ),
    },
    {
      field: 'block',
      headerName: 'Block',
      width: 150,
      renderCell: (params) => (
        <Avatar sx={{ bgcolor: params.value === 'A' ? 'blue' : 'green', marginRight: 2 }}>
          {params.value}
        </Avatar>
      ),
    },
    { field: 'number', headerName: 'Apartment', width: 150 },
    {
      field: 'received_at',
      headerName: 'Date',
      width: 150,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    }
  ];

  

  return (
    <div>
      <h2>Mail List</h2>

      {/* First Row of Filters: Block and Apartment */}
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 size={{ xs: 12, sm: 3 }}>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>All Status</em>
            </MenuItem>
            <MenuItem value="true">Delivered</MenuItem>
            <MenuItem value="false">Pending</MenuItem>
          </Select>
        </Grid2>

        <Grid2 size={{xs: 12, sm: 3}}>
          <Select
            label="Block"
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>All Blocks</em>
            </MenuItem>
            <MenuItem value="A">Block A</MenuItem>
            <MenuItem value="B">Block B</MenuItem>
          </Select>
        </Grid2>

        <Grid2 size={{xs: 12, sm: 3}}>
          <TextField
            label="Apartment"
            type="number"
            value={apartmentFilter}
            onChange={(e) => setApartmentFilter(e.target.value)}
            fullWidth
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
        </Grid2>

        {/* Button to Add New Mail */}
        <Grid2 size={{xs: 12, sm: 3}} display="flex" justifyContent="flex-end">
          <Button component={Link} to="/new-mail" variant="contained" color="primary">
            Receber
          </Button>
          
        </Grid2>
      </Grid2>

      {/* Second Row of Filters: Date Range */}
      <Grid2 container spacing={2} alignItems="center" mt={2}>
        <Grid2 size={{xs: 12, sm: 3}}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            fullWidth
          />
        </Grid2>

        <Grid2 size={{xs: 12, sm: 3}}>
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            fullWidth
          />
        </Grid2>

        {/* Button to Add New Mail */}
        <Grid2 size={{xs: 12, sm: 3}} display="flex" justifyContent="flex-end">
          <Button component={Link} to="/delivery-extract" variant="contained" color="primary">
            Entregar
          </Button>
          
        </Grid2>
      </Grid2>

      {/* Mail List */}
      <Box mt={3} sx={{ height: 400, width: '100%' }}>
        {filteredMails.length > 0 ? (
          <DataGrid
            rows={mails.map((mail) => ({
              ...mail,
              id: mail.id, // Use unique IDs for each row
            }))}
            columns={columns}
            // rowsPerPageOptions={[5]}
            checkboxSelection={false}
            // disableSelectionOnClick
          />
        ) : (
          <p>No mails found.</p>
        )}
      </Box>
    </div>
  );
};

export default Mails;