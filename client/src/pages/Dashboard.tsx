import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BlogSection from "../components/BlogSection";

const getColor = (count: number) => {
  if (count === 0) return "#b9b9b9ff";
  if (count === 1) return "#4a4b4aff";
  if (count === 2) return "#1c1d1cff";
  if (count === 3) return "#050505ff";
  return "#196127";
};

const Dashboard = () => {
  const [count, setCount] = useState<number>(0);
  const [trends, setTrends] = useState<{ month: string; count: number }[]>([]);
  const [activity, setActivity] = useState<{ date: string; count: number }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [c, t, a] = await Promise.all([
          axios.get("/api/applications/dashboard/count"),
          axios.get("/api/applications/dashboard/trends"),
          axios.get("/api/applications/dashboard/activity"),
        ]);
        setCount(c.data.count);
        setTrends(t.data);
        const act = Object.entries(a.data).map(([d, ct]) => ({
          date: d,
          count: Number(ct), // ✅ Explicitly convert to number
        }));

        setActivity(act);
      } catch (err) {
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Hello, {username}!
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        <Paper
          sx={{ p: 2, minWidth: 250, flex: "1 1 250px", cursor: "pointer" }}
          onClick={() => (window.location.href = "/applications")}
        >
          <Typography variant="h6">Total Applications</Typography>
          <Typography variant="h3" mt={1}>
            {count}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: "2 1 400px" }}>
          <Typography variant="h6" gutterBottom>
            Applications Over Time
          </Typography>
          <ResponsiveContainer height={250} width="100%">
            <BarChart data={trends}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f0f0fff" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
      {/* daily activity shown */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Daily Application Activity
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", maxWidth: 600, p: 1 }}>
          {activity.map((day) => (
            <Box
              key={day.date}
              sx={{
                width: 14,
                height: 14,
                m: "2px",
                bgcolor: getColor(day.count),
                borderRadius: "2px",
              }}
              title={`${day.date}: ${day.count}`}
            />
          ))}
        </Box>
      </Box>
      {/* Blog Section */}
      <BlogSection />
    </Box>
  );
};

export default Dashboard;
