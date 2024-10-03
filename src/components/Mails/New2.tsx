import React, {useRef, useState } from 'react';
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

const New2: React.FC = () => {
  // Retrieve the scannedResult passed from the QrReader page
  const location = useLocation();
  const navigate = useNavigate();
  const { scannedResult, capturedImage } = location.state || { scannedResult: "", capturedImage: "" };
  const canvasEl = useRef<HTMLCanvasElement>(null); // New canvas element ref

  const [radioValue, setRadioValue] = useState<string>('A');
  const [select1to18, setSelect1to18] = useState<number>(1);
  const [select1to6, setSelect1to6] = useState<number>(1);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  const handleSelect1to18Change = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelect1to18(event.target.value as number);
  };

  const handleSelect1to6Change = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelect1to6(event.target.value as number);
  };

  console.log('scan:', scannedResult);
  console.log('image:', capturedImage);
  

  const handleSubmit = async () => {
    console.log({ radioValue, select1to18, select1to6, scannedResult });

    // Prepare form data to send
    const formData = {
      reader_code: scannedResult,
      block: radioValue,
      number: Number(select1to18.toString() + select1to6.toString()),
      apartment_id: 1,
    };

    console.log('Sending form data:', formData);
    console.log('image:', capturedImage);

    // Send the data using fetch API
    try {
      const response = await fetch(`${apiDomain}/deliveries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success response from server
        const responseData = await response.json();
        console.log('Server response:', responseData);
        alert('Data submitted successfully');
        navigate("/"); // Navigate to home or another page after successful submission
      } else {
        // Error response from server
        console.error('Error submitting data:', response.statusText);
        alert('Failed to submit data');
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
          QR Code Scanned - Enter Information
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
            // @ts-ignore
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
            // @ts-ignore
            onChange={handleSelect1to6Change}
          >
            {[...Array(6)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
      {/* <canvas ref={canvasEl} style={{ display: "none" }}></canvas> */}
    </div>
    </Container>
  );
};

export default New2;
