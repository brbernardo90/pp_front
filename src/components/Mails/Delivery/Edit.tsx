import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const apiDomain = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3000';

const DeliveryEdit: React.FC = () => {
  // Retrieve the scannedResult passed from the QrReader page
  const location = useLocation();
  const navigate = useNavigate();
  const { scannedResult, capturedImage } = location.state || { scannedResult: "", capturedImage: "" };

  const [radioValue, setRadioValue] = useState<string>('A');
  const [select1to18, setSelect1to18] = useState<number>(1);
  const [mailId, setMailId] = useState<number>(0);
  const [select1to6, setSelect1to6] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deliveryNotFound, setDeliveryNotFound] = useState<boolean>(false); // New state for not found

  // Fetch data from API and populate form fields
  useEffect(() => {
    if (scannedResult) {
      const fetchMailData = async () => {
        try {
          const response = await fetch(`${apiDomain}/deliveries/find_by_reader_code`, {
            method: 'POST', // Changed to POST method
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reader_code: scannedResult }), // Send the scannedResult in the body
          });

          if (response.ok) {
            const data = await response.json();
            // If data is empty, set deliveryNotFound to true
            console.log('Response data:', data);
            if (!data) {
              setDeliveryNotFound(true);
            } else {
              // Populate form fields with API data
              setMailId(data.id)
              setRadioValue(data.block);
              setSelect1to18(data.number.toString().slice(0,-1));
              setSelect1to6(data.number.toString().slice(-1));
              setDeliveryNotFound(false);
            }
          } else if (response.status === 404) {
            // If API returns a 404 (not found), set deliveryNotFound to true
            setDeliveryNotFound(true);
          }
        } catch (error) {
          console.error("Error fetching mail data:", error);
          setDeliveryNotFound(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMailData();
    } else {
      setIsLoading(false);
    }
  }, [scannedResult]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  const handleSelect1to18Change = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelect1to18(event.target.value as number);
  };

  const handleSelect1to6Change = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelect1to6(event.target.value as number);
  };

  const handleSubmit = async () => {
    const formData = {
      reader_code: scannedResult,
      block: radioValue,
      number: Number(select1to18.toString() + select1to6.toString()),
      apartment_id: 1, // Or fetched from data
      status: true,
      id: mailId
    };

    try {
      const response = await fetch(`${apiDomain}/deliveries/${mailId}`, {
        method: 'PUT', // Use PUT or PATCH to update the existing mail
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Server response:', responseData);
        alert('Data updated successfully');
        navigate("/"); // Navigate to home or another page after successful submission
      } else {
        console.error('Error submitting data:', response.statusText);
        alert('Failed to update data');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show loading state until data is fetched
  }

  if (deliveryNotFound) {
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Delivery Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The delivery was not found. Please try to do the delivery manually.
          </Typography>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            color="primary"
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Delivery Information
        </Typography>

        <Typography variant="body1" paragraph>
          Scanned Result: {scannedResult}
        </Typography>

        {/* Radio Group */}
        <FormControl component="fieldset" fullWidth margin="normal">
          <FormLabel component="legend">Bloco</FormLabel>
          <RadioGroup name="block" value={radioValue} onChange={handleRadioChange} row>
            <FormControlLabel value="A" control={<Radio />} label="A" />
            <FormControlLabel value="B" control={<Radio />} label="B" />
          </RadioGroup>
        </FormControl>

        {/* Select 1 to 18 */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="floor">Andar</InputLabel>
          <Select
            labelId="floor"
            value={select1to18}
            onChange={handleSelect1to18Change}
          >
            {[...Array(18)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select 1 to 6 */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="number">Apt</InputLabel>
          <Select
            labelId="number"
            value={select1to6}
            onChange={handleSelect1to6Change}
          >
            {[...Array(6)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Confirmation Text */}
        <Box mt={3}>
          <Typography variant="h6" align="center">
            Are the data correct?
          </Typography>
        </Box>

        {/* Actions */}
        <Box mt={2}>
          <Button
            onClick={() => navigate("/")}
            variant="outlined"
            color="secondary"
            sx={{ marginRight: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </Box>

      <div>
        <h1>Captured Image</h1>
        {capturedImage ? <img src={capturedImage} alt="Captured snapshot" /> : <p>No image captured.</p>}
      </div>
    </Container>
  );
};

export default DeliveryEdit;
