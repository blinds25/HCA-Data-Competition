// frontend/src/components/EmailModal.js

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material';

// Confirmation dialog component with off-white background, blue text, and orange buttons.
function ConfirmDialog({ open, onClose, onConfirm, count }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { backgroundColor: '#f8f8f8' } }}>
      <DialogTitle sx={{ color: '#003366' }}>Confirm Send Email</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#003366' }}>
          Are you sure you want to send this email to {count} {count === 1 ? 'person' : 'people'}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#FF6600', color: '#FF6600' }}>
          No
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={{ backgroundColor: '#FF6600', color: '#ffffff' }}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Success dialog component with similar styling.
function SuccessDialog({ open, onClose, count }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { backgroundColor: '#f8f8f8' } }}>
      <DialogTitle sx={{ color: '#003366' }}>Email Sent</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#FF6600', color: '#ffffff' }}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EmailModal({ emailData, onClose }) {
  // emailData.recipients is a count (number)
  const recipientsCount =
    typeof emailData.recipients === 'number'
      ? emailData.recipients
      : 0;

  const [subject, setSubject] = useState(emailData.subject || '');
  const [message, setMessage] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // When "Send Email" is clicked in the EmailModal, open the confirmation dialog.
  const handleSendClick = () => {
    setConfirmOpen(true);
  };

  // When confirmed, close the confirmation dialog, then open the success dialog.
  const handleConfirm = () => {
    setConfirmOpen(false);
    // Here you would normally send the email.
    setSuccessOpen(true);
  };

  // When the success dialog is closed, close the entire EmailModal.
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open onClose={onClose} PaperProps={{ sx: { backgroundColor: '#f8f8f8' } }}>
        <DialogTitle sx={{ color: '#003366' }}>Send Email</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ color: '#003366' }}>
            {`You are about to send an email to ${recipientsCount} ${recipientsCount === 1 ? 'person' : 'people'}.`}
          </Typography>
          <TextField
            margin="dense"
            label="Subject"
            fullWidth
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-input': { color: '#003366' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#003366' },
              },
            }}
            InputLabelProps={{ sx: { color: '#003366' } }}
          />
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-input': { color: '#003366' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#003366' },
              },
            }}
            InputLabelProps={{ sx: { color: '#003366' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#FF6600', color: '#FF6600' }}>
            Cancel
          </Button>
          <Button onClick={handleSendClick} variant="contained" sx={{ backgroundColor: '#FF6600', color: '#ffffff' }}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        count={recipientsCount}
      />

      <SuccessDialog
        open={successOpen}
        onClose={handleSuccessClose}
        count={recipientsCount}
      />
    </>
  );
}

export default EmailModal;
