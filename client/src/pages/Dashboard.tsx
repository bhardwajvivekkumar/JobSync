import { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
// import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BlogSection from "../components/BlogSection";
import api from "../services/api";
// import { jwtDecode } from "jwt-decode";

interface IUser {
  _id: string;
  name: string;
  email: string;
}

const Dashboard = () => {
  const [count, setCount] = useState<number>(0);
  const [trends, setTrends] = useState<{ month: string; count: number }[]>([]);
  const [statusStats, setStatusStats] = useState<{
    Applied?: number;
    Interview?: number;
    Offer?: number;
    Rejected?: number;
  }>({});
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null); // fallback if not logged in / token expired
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [c, t, s] = await Promise.all([
          api.get("/applications/dashboard/count"),
          api.get("/applications/dashboard/trends"),
          api.get("/applications/dashboard/status"),
        ]);

        setCount(c.data.count);
        setTrends(t.data);

        const statusLabelMap: Record<string, keyof typeof statusStats> = {
          applied: "Applied",
          interviewing: "Interview",
          offer: "Offer",
          rejected: "Rejected",
        };

        const formatted: typeof statusStats = {};
        for (const [status, count] of Object.entries(s.data)) {
          const key = statusLabelMap[status] || status;
          formatted[key as keyof typeof statusStats] = Number(count);
        }

        setStatusStats(formatted);
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
  const getApplicationMessage = (count: number): string => {
    if (count < 10) return "Just getting started – long way to go!";
    if (count < 20) return "Great start – keep pushing!";
    if (count < 40) return "Impressive – you're getting noticed!";
    if (count < 70) return "You're applying like a pro!";
    if (count < 100) return "You're a job application machine!";
    return "You've mastered the art of job applications!";
  };

  return (
    <Box p={3}>
      <div>
        {user ? (
          <Typography variant="h4">Hello {user.name}</Typography>
        ) : (
          <Typography variant="h4">
            You are not logged in. <a href="/login">Sign in</a>
          </Typography>
        )}
      </div>

      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        <Paper
          sx={{ p: 2, minWidth: 250, flex: "1 1 250px", cursor: "pointer" }}
          onClick={() => (window.location.href = "/applications")}
        >
          <Typography variant="h6">Total Applications</Typography>
          <Typography variant="h3" mt={1}>
            {count}
          </Typography>
          <Typography mt={1} fontSize="14px" color="text.secondary">
            {getApplicationMessage(count)}
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

      {/* ✅ Simple Text Status Breakdown */}
      <Box
        sx={{
          border: "1px solid black",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "32px",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Application Status Breakdown
        </Typography>
        <Typography color="black">
          Applied: {statusStats.Applied || 0}
        </Typography>
        <Typography color="black">
          Interview: {statusStats.Interview || 0}
        </Typography>
        <Typography color="black">Offer: {statusStats.Offer || 0}</Typography>
        <Typography color="black">
          Rejected: {statusStats.Rejected || 0}
        </Typography>
      </Box>

      {/* Blog Section */}
      <BlogSection />
    </Box>
  );
};

export default Dashboard;
