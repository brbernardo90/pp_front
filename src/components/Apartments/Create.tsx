import React, { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

const NewApartment: React.FC = () => {
  const [block, setBlock] = useState<string>('A'); // Block (A or B)
  const [floor, setFloor] = useState<number>(1); // Floor (1 to 18)
  const [apartmentNumber, setApartmentNumber] = useState<number>(1); // Apartment number (1 to 6)
  const navigate = useNavigate();

  // Handle change for block selection
  const handleBlockChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBlock(event.target.value as string);
  };

  // Handle change for floor selection
  const handleFloorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFloor(event.target.value as number);
  };

  // Handle change for apartment number selection
  const handleApartmentNumberChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setApartmentNumber(event.target.value as number);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const number = parseInt(`${floor}${apartmentNumber}`); // Concatenate floor and apartment number

    const formData = {
      block,
      number,
    };

    console.log('Submitting data:', formData);

    try {
      const response = await fetch(`${apiDomain}/apartments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Server response:', responseData);
        alert('Apartment created successfully');
        navigate("/apartments"); // Redirect to apartment list or another page
      } else {
        console.error('Error creating apartment:', response.statusText);
        alert('Failed to create apartment');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Apartment
        </Typography>

        {/* Block Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="block-label">Block</InputLabel>
          <Select
            labelId="block-label"
            value={block}
            onChange={handleBlockChange}
          >
            <MenuItem value="A">Block A</MenuItem>
            <MenuItem value="B">Block B</MenuItem>
          </Select>
        </FormControl>

        {/* Floor Selection (1 to 18) */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="floor-label">Floor</InputLabel>
          <Select
            labelId="floor-label"
            value={floor}
            onChange={handleFloorChange}
          >
            {[...Array(18)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Apartment Number Selection (1 to 6) */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="apartment-number-label">Apartment Number</InputLabel>
          <Select
            labelId="apartment-number-label"
            value={apartmentNumber}
            onChange={handleApartmentNumberChange}
          >
            {[...Array(6)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Box mt={2}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewApartment;
