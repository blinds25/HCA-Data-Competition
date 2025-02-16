import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <Dialog open onClose={onCancel}>
      <DialogTitle>Confirm Email Send</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to send this email?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Yes
        </Button>
        <Button onClick={onCancel} variant="outlined">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationModal;
