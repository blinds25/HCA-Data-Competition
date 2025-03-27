// frontend/src/components/EmailModal.js

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Autocomplete,
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TemplateIcon from "@mui/icons-material/Description";
import ScheduleIcon from "@mui/icons-material/Schedule";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EmailModal({ open, onClose, resources, currentFacility }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  // List of email templates
  const emailTemplates = [
    {
      name: "Emergency Response Request",
      subject: "Emergency Response Resources Needed",
      body: "Dear Team,\n\nWe are currently responding to [EMERGENCY TYPE] and require the following resources:\n\n[RESOURCE LIST]\n\nPlease confirm availability and estimated delivery time.\n\nThank you,\n[YOUR NAME]\n[FACILITY]",
    },
    {
      name: "Staff Alert Notification",
      subject: "URGENT: Staff Alert for Emergency Response",
      body: "ATTENTION ALL STAFF:\n\nDue to [EMERGENCY SITUATION], we are implementing our emergency response protocol. All personnel should report to their designated areas.\n\nCritical staff needed in the following departments:\n- Emergency Department\n- ICU\n- Surgery\n\nPlease confirm receipt of this message.\n\nEmergency Response Team",
    },
    {
      name: "Resource Allocation Update",
      subject: "Resource Allocation Update - [DATE]",
      body: "Team,\n\nThis is an update on our current resource allocation status:\n\n- Medical Supplies: [STATUS]\n- Staff Coverage: [STATUS]\n- Facility Operations: [STATUS]\n\nPriority needs:\n1. [NEED 1]\n2. [NEED 2]\n3. [NEED 3]\n\nPlease direct all questions to the command center.\n\nThank you,\nEmergency Management",
    },
  ];

  // Simulated email contacts for the Autocomplete component
  const contactOptions = [
    { name: "Emergency Response Team", email: "ert@hca.com" },
    { name: "Resource Management", email: "resources@hca.com" },
    { name: "Medical Coordination", email: "medical@hca.com" },
    { name: "Facility Operations", email: "facilities@hca.com" },
    { name: "Regional Coordinator", email: "regional@hca.com" },
    { name: "Supply Chain", email: "supplies@hca.com" },
    { name: "Executive Team", email: "executives@hca.com" },
  ];

  const handleTemplateSelect = (template) => {
    setSubject(template.subject);
    setMessage(template.body);
    setShowTemplates(false);
  };

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachments([...attachments, ...files]);
  };

  const handleRemoveAttachment = (fileToRemove) => {
    setAttachments(attachments.filter((file) => file !== fileToRemove));
  };

  const handleSendEmail = () => {
    if (!subject.trim()) {
      setError("Please enter a subject for your email");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a message for your email");
      return;
    }

    if (recipients.length === 0 && !sendToAll) {
      setError("Please select at least one recipient or choose 'Send to All'");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate sending email
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        if (open) {
          // Only reset if the modal is still open
          setSuccess(false);
          setSubject("");
          setMessage("");
          setRecipients([]);
          setAttachments([]);
          setSendToAll(false);
          setScheduled(false);
          setScheduleDate("");
          onClose();
        }
      }, 2000);
    }, 2000);
  };

  const getRandomResource = () => {
    const resourceTypes = [
      "Ventilators",
      "Medical Staff",
      "Beds",
      "Oxygen",
      "PPE",
    ];
    return resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          backgroundColor: "#1a2942",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          background: "linear-gradient(to bottom, #1f3154, #121f36)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          py: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 600 }}>
          {scheduled
            ? "Schedule Emergency Communication"
            : "Send Emergency Communication"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#b0bbd4" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              color: "#ff5252",
              border: "1px solid rgba(211, 47, 47, 0.2)",
              "& .MuiAlert-icon": {
                color: "#ff5252",
              },
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              backgroundColor: "rgba(56, 142, 60, 0.1)",
              color: "#66bb6a",
              border: "1px solid rgba(56, 142, 60, 0.2)",
              "& .MuiAlert-icon": {
                color: "#66bb6a",
              },
            }}
          >
            {scheduled
              ? "Email scheduled successfully!"
              : "Email sent successfully!"}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sendToAll}
                onChange={(e) => setSendToAll(e.target.checked)}
                sx={{
                  color: "#FF6600",
                  "&.Mui-checked": {
                    color: "#FF6600",
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: "#ffffff" }}>
                Send to all emergency contacts
              </Typography>
            }
          />
          {!sendToAll && (
            <Autocomplete
              multiple
              options={contactOptions}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              onChange={(event, newValue) => {
                setRecipients(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    sx={{
                      backgroundColor: "#2a4270",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "& .MuiChip-deleteIcon": {
                        color: "#b0bbd4",
                        "&:hover": {
                          color: "#ffffff",
                        },
                      },
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Recipients"
                  placeholder="Add recipients"
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 1,
                      color: "#ffffff",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#FF6600",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#b0bbd4",
                    },
                  }}
                />
              )}
            />
          )}
        </Box>

        <TextField
          fullWidth
          label="Subject"
          variant="outlined"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 1,
              color: "#ffffff",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FF6600",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#b0bbd4",
            },
          }}
        />

        <TextField
          fullWidth
          multiline
          rows={8}
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 1,
              color: "#ffffff",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FF6600",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#b0bbd4",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Button
              startIcon={<TemplateIcon />}
              onClick={() => setShowTemplates(!showTemplates)}
              sx={{
                backgroundColor: "#1f3154",
                color: "#ffffff",
                borderRadius: 1,
                mr: 2,
                "&:hover": {
                  backgroundColor: "#2a4270",
                },
              }}
            >
              Templates
            </Button>

            <Button
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{
                backgroundColor: "#1f3154",
                color: "#ffffff",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#2a4270",
                },
              }}
            >
              Attach Files
              <input
                type="file"
                multiple
                hidden
                onChange={handleAttachmentChange}
              />
            </Button>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
                sx={{
                  color: "#FF6600",
                  "&.Mui-checked": {
                    color: "#FF6600",
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ScheduleIcon
                  sx={{ mr: 1, color: scheduled ? "#FF6600" : "#b0bbd4" }}
                />
                <Typography sx={{ color: "#ffffff" }}>
                  Schedule for later
                </Typography>
              </Box>
            }
          />
        </Box>

        {scheduled && (
          <TextField
            type="datetime-local"
            label="Schedule Date & Time"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 1,
                color: "#ffffff",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FF6600",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#b0bbd4",
              },
            }}
          />
        )}

        {attachments.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#b0bbd4", mb: 1 }}>
              Attachments ({attachments.length})
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                p: 1,
                borderRadius: 1,
              }}
            >
              {attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => handleRemoveAttachment(file)}
                  sx={{
                    backgroundColor: "#2a4270",
                    color: "#ffffff",
                    "& .MuiChip-deleteIcon": {
                      color: "#b0bbd4",
                      "&:hover": {
                        color: "#ffffff",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {showTemplates && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 1,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>
              Email Templates
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {emailTemplates.map((template, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: "#1f3154",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#2a4270",
                    },
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ffffff", fontWeight: 500 }}
                  >
                    {template.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0bbd4" }}>
                    Subject: {template.subject}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {currentFacility && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 1,
              backgroundColor: "rgba(255, 102, 0, 0.1)",
              borderLeft: "3px solid #FF6600",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "#ffffff", fontWeight: 600, mb: 1 }}
            >
              Resource Request Information
            </Typography>
            <Typography variant="body2" sx={{ color: "#ffffff", mb: 1 }}>
              Facility: {currentFacility.name || "Selected Facility"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#ffffff", mb: 1 }}>
              Critical Need: {getRandomResource()}
            </Typography>
            <Typography variant="body2" sx={{ color: "#ffffff" }}>
              Request ID: EM-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#b0bbd4",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "#ffffff",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSendEmail}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{
            backgroundColor: "#FF6600",
            color: "#ffffff",
            px: 3,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "#e55c00",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255, 102, 0, 0.3)",
              color: "rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          {scheduled ? "Schedule" : "Send"} Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmailModal;
