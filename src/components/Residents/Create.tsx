import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

// Apartment interface
interface Apartment {
  id: number;
  block: string;
  number: number;
}

const CreateResident: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [apartmentId, setApartmentId] = useState<number | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      const response = await fetch(`${apiDomain}/apartments`);
      const data = await response.json();
      setApartments(data);
    };

    fetchApartments();
  }, []);

  const handleSubmit = async () => {
    const formData = {
      name,
      phone,
    };

    try {
      const response = await fetch(`${apiDomain}/residents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Resident created successfully');
        navigate('/residents'); // Navigate back to resident list
      } else {
        alert('Failed to create resident');
      }
    } catch (error) {
      alert('Error creating resident');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Resident
        </Typography>

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateResident;
