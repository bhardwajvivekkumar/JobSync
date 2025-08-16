import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import api from "../services/api";

const ApplicationDetails = () => {
  const { id } = useParams();
  const [appData, setAppData] = useState<any>(null);
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
    {}
  );
  const [tempData, setTempData] = useState<any>({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [changedFields, setChangedFields] = useState<Record<string, any>>({});
  const [isGlobalEdit, setIsGlobalEdit] = useState(false);

  const dateFields = ["appliedAt", "followUpReminder"];
  const fields = [
    "company",
    "jobTitle",
    "jobLink",
    "location",
    "status",
    "appliedAt",
    "followUpReminder",
    "tags",
  ];

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setAppData(res.data);
        setTempData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplication();
  }, [id]);

  const handleEditToggle = (field: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: string, value: any) => {
    setTempData((prev: any) => ({
      ...prev,
      [field]: value ? dayjs(value).format("YYYY-MM-DD") : "",
    }));
  };

  const handleOpenConfirm = () => {
    const changes: Record<string, any> = {};
    Object.keys(tempData).forEach((key) => {
      if (tempData[key] !== appData[key]) {
        changes[key] = { from: appData[key], to: tempData[key] };
      }
    });

    if (Object.keys(changes).length === 0) {
      alert("No changes made.");
      return;
    }

    setChangedFields(changes);
    setOpenConfirm(true);
  };

  const handleConfirmSave = async () => {
    try {
      await api.put(`/applications/${id}`, tempData);
      setAppData(tempData);
      setEditableFields({});
      setIsGlobalEdit(false);
      setOpenConfirm(false);
      alert("Changes saved.");
    } catch (err) {
      alert("Failed to update!");
    }
  };

  const toggleGlobalEdit = () => {
    const allEditable: Record<string, boolean> = {};
    fields.forEach((f) => {
      allEditable[f] = false;
    });
    setEditableFields(allEditable);
    setIsGlobalEdit((prev) => !prev);
  };

  if (!appData)
    return (
      <Typography align="center" mt={4}>
        Loading...
      </Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
        backgroundColor: "#fafafa",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 800,
          p: { xs: 3, sm: 4 },
          position: "relative",
          borderRadius: 3,
          overflow: "visible",
          boxSizing: "border-box",
        }}
      >
        {/* Global Edit Button */}
        <Tooltip title={isGlobalEdit ? "Exit Edit Mode" : "Edit All"}>
          <IconButton
            onClick={toggleGlobalEdit}
            sx={{ position: "absolute", top: 16, right: 16 }}
            color={isGlobalEdit ? "primary" : "default"}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Typography variant="h5" gutterBottom fontWeight="bold">
          Application Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box display="flex" flexDirection="column" gap={3}>
          {fields.map((field) => {
            const isDate = dateFields.includes(field);
            const value = tempData[field];

            return (
              <Box
                key={field}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                py={2}
                sx={{ borderBottom: "1px solid #e0e0e0" }}
              >
                <Box flexGrow={1}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Typography>

                  {editableFields[field] ? (
                    isDate ? (
                      <DatePicker
                        value={value ? dayjs(value) : null}
                        onChange={(newDate) => handleDateChange(field, newDate)}
                        slotProps={{
                          textField: { fullWidth: true, size: "small" },
                        }}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        name={field}
                        value={value || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    )
                  ) : (
                    <Typography variant="body1">
                      {isDate && value
                        ? dayjs(value).format("DD-MM-YYYY")
                        : field === "tags"
                        ? (value || []).join(", ")
                        : value || "—"}
                    </Typography>
                  )}
                </Box>

                {isGlobalEdit && (
                  <IconButton
                    onClick={() => handleEditToggle(field)}
                    sx={{ ml: 2 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>

        {isGlobalEdit && (
          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "#333",
                  backgroundColor: "#f0f0f0",
                },
              }}
              onClick={() => {
                setTempData(appData);
                setEditableFields({});
                setIsGlobalEdit(false);
              }}
            >
              Cancel Changes
            </Button>

            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
              onClick={handleOpenConfirm}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent dividers>
          {Object.entries(changedFields).map(([field, change]) => (
            <Box key={field} mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                From: <strong>{change.from || "—"}</strong>
              </Typography>
              <Typography variant="body2">
                To: <strong>{change.to || "—"}</strong>
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationDetails;
