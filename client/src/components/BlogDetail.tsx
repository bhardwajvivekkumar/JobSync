import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import axios from "axios";

interface BlogPost {
  title: string;
  body_html: string;
  readable_publish_date: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the blog ID from the URL
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`https://dev.to/api/articles/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        top="65px"
        width="100%"
        sx={{
          position: { xs: "relative", sm: "sticky" },
          top: { sm: "65px", xs: "auto" },
          zIndex: 10,
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, flex: 1 }}>
          {blog?.title}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleBackClick}
          sx={{
            borderColor: "black",
            color: "black",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
            },
            fontSize: { xs: "0.75rem", sm: "1rem" },
            padding: { xs: "6px 12px", sm: "8px 16px" },
          }}
        >
          Back
        </Button>
      </Box>

      {blog ? (
        <Box mt={4}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Published on {blog.readable_publish_date}
          </Typography>

          {/* Blog Content Styling */}
          <Box
            mt={2}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: { xs: "10px", sm: "16px" },
              width: "100%",
              margin: "0 auto",
              lineHeight: 1.8,
              fontFamily: '"Roboto", sans-serif',
              overflowX: "hidden",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: blog.body_html,
              }} // Render full blog HTML content
              className="blog-content"
            />
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" color="error">
          Blog not found
        </Typography>
      )}
    </Box>
  );
};

export default BlogDetail;
