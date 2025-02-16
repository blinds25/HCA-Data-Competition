import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button 
} from '@mui/material';
import ConfirmationModal from './ConfirmationModal';

function EmailModal({ emailData, onClose }) {
  const [subject, setSubject] = useState(emailData.subject);
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSendClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSend = () => {
    fetch('http://localhost:8000/api/send-email/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, recipient: emailData.recipient }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.success ? data.success : data.error);
        setShowConfirmation(false);
        onClose();
      })
      .catch((err) => {
        console.error(err);
        alert('Error sending email');
        setShowConfirmation(false);
      });
  };

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Dialog open onClose={onClose}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Subject"
            fullWidth
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendClick} variant="contained" color="primary">
            Send Email
          </Button>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {showConfirmation && (
        <ConfirmationModal onConfirm={handleConfirmSend} onCancel={handleCancelConfirm} />
      )}
    </>
  );
}

export default EmailModal;
