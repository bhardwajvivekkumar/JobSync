import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token after login

        if (!token) {
          console.error("No token found, user not logged in");
          return;
        }

        const res = await axios.get("/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token to backend
          },
        });

        console.log("Fetched applications:", res.data);
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f2f2f2", p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        My Job Applications
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
        }}
      >
        {applications.map((app: any) => (
          <Paper
            key={app._id}
            elevation={6}
            onClick={() => navigate(`/applications/${app._id}`)}
            sx={{
              cursor: "pointer",
              p: 3,
              width: 320,
              borderRadius: 3,
              border: "1px solid #000",
              bgcolor: "#ffffff",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 8,
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="black"
              gutterBottom
            >
              {app.company}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              {app.jobTitle}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Status: <strong>{app.status}</strong>
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: "absolute",
                top: 8,
                right: 12,
                fontSize: "0.7rem",
              }}
            >
              Applied{" "}
              {formatDistanceToNow(new Date(app.appliedAt), {
                addSuffix: true,
              })}
            </Typography>

            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ display: "block" }}
            >
              Applied on:{" "}
              {app.appliedAt
                ? new Date(app.appliedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ApplicationList;
