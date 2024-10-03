import React, { useState, useEffect } from 'react';
import { Container, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Apartment interface
interface Apartment {
  id: number;
  block: string;
  number: number;
}

const ApartmentAssociationCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get resident ID from the URL
  const [apartments, setApartments] = useState<Apartment[]>([]); // Available apartments
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(null);
  const [relationship_type, setRelationshipType] = useState<string>('Owner'); // Owner or Renter
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const navigate = useNavigate();

  // Fetch available apartments
  useEffect(() => {
    const fetchApartments = async () => {
      const response = await fetch(`${apiDomain}/apartments`);
      const data = await response.json();
      setApartments(data);
    };

    fetchApartments();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedApartmentId) {
      const formData = {
        resident_id: id,
        apartment_id: selectedApartmentId,
        relationship_type,
        start_date: startDate,
        end_date: endDate,
      };

      try {
        const response = await fetch(`${apiDomain}/apartment_residents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Apartment association created successfully');
          navigate(`/residents/${id}/apartments`);
        } else {
          alert('Failed to create apartment association');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Error during submission');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <h2>Create New Apartment Association</h2>

        {/* Select Apartment */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="apartment-label">Select Apartment</InputLabel>
          <Select
            labelId="apartment-label"
            value={selectedApartmentId}
            onChange={(e) => setSelectedApartmentId(e.target.value as number)}
          >
            {apartments.map((apartment) => (
              <MenuItem key={apartment.id} value={apartment.id}>
                {apartment.block} {apartment.number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select relationship_type (Owner/Renter) */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="relationship_type-label">relationship_type</InputLabel>
          <Select
            labelId="relationship_type-label"
            value={relationship_type}
            onChange={(e) => setRelationshipType(e.target.value as string)}
          >
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="renter">Renter</MenuItem>
          </Select>
        </FormControl>

        {/* Start Date */}
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />

        {/* End Date */}
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Association
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ApartmentAssociationCreate;
