import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';

interface DeliveryModalProps {
  open: boolean;
  onClose: () => void;
  scannedResult: string | undefined;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ open, onClose, scannedResult }) => {
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

    // Send the data using fetch API
    try {
      const response = await fetch('https://pp-back.onrender.com/deliveries', {
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
        onClose(); // Close the modal after submission
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>QR Code Scanned - Enter Information</DialogTitle>
      <DialogContent>
        <p>Scanned Result: {scannedResult}</p>
        
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
      </DialogContent>

      {/* Modal actions */}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryModal;
