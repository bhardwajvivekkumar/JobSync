import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  [key: string]: any; 
}

const Dashboard = () => {
 
  const savedJobs: Job[] = []; 

  return (
    <Box sx={{ paddingTop: "80px", px: 3 }}>
      {/* Blog section */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome to JobSync Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        JobSync is your one-stop job application tracker. Our platform allows
        you to easily add new job applications, track their status, and manage
        them all in one place. Whether you're actively applying or organizing
        saved opportunities, our dashboard keeps everything accessible.
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        To get started, simply head over to the "Add Application" page, fill in
        the job details, and you're set! You can then return here to see your
        saved jobs, or click on "My Applications" to view all of them in a
        structured list.
      </Typography>

      <Box mt={5}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Recently Saved Jobs
        </Typography>

        {savedJobs.length > 0 ? (
          <Stack spacing={2}>
            {savedJobs.slice(0, 3).map((job) => (
              <Paper
                key={job.id}
                sx={{ padding: 2, backgroundColor: "#f4f4f4", borderRadius: 2 }}
              >
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company} — {job.location}
                </Typography>
              </Paper>
            ))}
            <Button
              variant="contained"
              component={RouterLink}
              to="/applications"
              sx={{ alignSelf: "flex-start" }}
            >
              View All Applications
            </Button>
          </Stack>
        ) : (
          <Typography color="text.secondary">
            No saved jobs yet. Start by adding a new application!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;