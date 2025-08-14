import { useForm } from "react-hook-form";
import type { JobApplication } from "../types/job";
import api from "../services/api";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const defaultValues: JobApplication = {
  company: "",
  jobTitle: "",
  jobLink: "",
  location: "",
  status: "Applied",
  appliedAt: new Date().toISOString().split("T")[0],
  followUpReminder: new Date().toISOString().split("T")[0],
  followUpDone: false,
  tags: "",
};

export default function JobApplicationForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobApplication>({ defaultValues });

  const onSubmit = async (data: JobApplication) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Not Logged In",
          text: "You must be logged in to submit a job application.",
          confirmButtonColor: "#000",
        });
        return;
      }

      const tags =
        typeof data.tags === "string"
          ? data.tags.split(",").map((tag) => tag.trim())
          : [];

      const payload = { ...data, tags };

      // Send request with Authorization header
      await api.post("/applications", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your job application was submitted successfully!",
        confirmButtonColor: "#000",
      });

      reset();
      navigate("/applications");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong while submitting your application.",
        confirmButtonColor: "#000",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e9e6e6ff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 0 12px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Add Job Application
            </Typography>

            <TextField
              label="Company"
              {...register("company", { required: "Company is required" })}
              error={!!errors.company}
              helperText={errors.company?.message}
              sx={textFieldStyle}
            />

            <TextField
              label="Job Title"
              {...register("jobTitle", { required: "Job title is required" })}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle?.message}
              sx={textFieldStyle}
            />

            <TextField
              label="Job Link"
              {...register("jobLink")}
              sx={textFieldStyle}
            />

            <TextField
              label="Location"
              {...register("location")}
              sx={textFieldStyle}
            />

            <TextField
              label="Status"
              select
              defaultValue="Applied"
              {...register("status")}
              sx={textFieldStyle}
            >
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Interview">Interview</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Offer">Offer</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              label="Applied Date"
              type="date"
              {...register("appliedAt")}
              sx={textFieldStyle}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Follow-Up Reminder"
              type="date"
              {...register("followUpReminder")}
              sx={textFieldStyle}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Tags (comma separated)"
              {...register("tags")}
              sx={textFieldStyle}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
};
