import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Button,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  url: string;
  body_html: string;
}

const BlogSection = () => {
  const [displayedBlogs, setDisplayedBlogs] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  useEffect(() => {
    const loadBlogs = async () => {
      setBlogLoading(true);
      try {
        const res = await axios.get(
          `https://dev.to/api/articles?per_page=25&page=1&search=job+market+career`
        );

        const newB = res.data as BlogPost[];
        // Divide blogs into 5 pages (5 blogs per page)
        setTotalPages(Math.ceil(newB.length / 5));
        setDisplayedBlogs(newB.slice((page - 1) * 5, page * 5));
      } catch (err) {
        console.error("Blogs error:", err);
        setError("Could not load blog posts.");
      } finally {
        setBlogLoading(false);
      }
    };

    loadBlogs();
  }, [page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box mt={4}>
      <Typography variant="h3" gutterBottom>
        Technology & Jobs related Blogs
      </Typography>

      {blogLoading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : displayedBlogs.length === 0 ? (
        <Typography>No blog posts available.</Typography>
      ) : (
        <Stack spacing={2}>
          {displayedBlogs.map((blog) => (
            <Card key={blog.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.description?.slice(0, 120) ||
                    "No description available."}
                  ...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {blog.readable_publish_date}
                </Typography>
                <Box mt={2}>
                  <Link to={`/blog/${blog.id}`}>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "black",
                        borderColor: "black",
                      }}
                    >
                      Read More
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="standard"
          siblingCount={1}
          boundaryCount={1}
          renderItem={(item) => <PaginationItem {...item} />}
        />
      </Box>
    </Box>
  );
};

export default BlogSection;
