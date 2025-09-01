import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Container,
  Divider,
  IconButton,
  Snackbar,
  Fade,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { marked } from "marked";
import axios from "axios";
import DOMPurify from "dompurify"; // For sanitizing HTML
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

// Register language for code syntax highlighting
SyntaxHighlighter.registerLanguage("javascript", js);

interface BlogPost {
  title: string;
  body_markdown: string;
  readable_publish_date: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const location = useLocation();
  // const fromPage = location.state?.fromPage || 1;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          background: {
            default: darkMode ? "#121212" : "#f5f5f5",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: "all 0.4s ease-in-out",
              },
            },
          },
        },
        typography: {
          fontFamily: '"Roboto", sans-serif',
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

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
    if (id) fetchBlogDetail();
  }, [id]);

  const getParsedContent = () => {
    if (!blog?.body_markdown) return "";

    marked.setOptions({});

    const dirtyHTML =
      typeof marked.parse === "function"
        ? marked.parse(blog.body_markdown)
        : "";

    const htmlString = typeof dirtyHTML === "string" ? dirtyHTML : "";

    // lazy loading
    const withLazyImages = htmlString.replace(
      /<img([^>]*)>/g,
      '<img loading="lazy" class="fade-in" $1>'
    );

    return DOMPurify.sanitize(withLazyImages);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="md">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={4}
          sx={{
            position: { xs: "relative", sm: "sticky" },
            top: { sm: "65px", xs: "auto" },
            zIndex: 10,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            px: isMobile ? 1.5 : 2,
            py: 1.5,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? "1.3rem" : "2rem",
              flex: 1,
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            {blog?.title}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{
                borderColor: "text.primary",
                color: "text.primary",
                fontSize: isMobile ? "0.75rem" : "1rem",
                "&:hover": {
                  backgroundColor: "text.primary",
                  color: theme.palette.background.paper,
                },
              }}
            >
              Back
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={showSnackbar}
          message={`Dark Mode ${darkMode ? "On" : "Off"}`}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          TransitionComponent={Fade}
          ContentProps={{
            sx: {
              backgroundColor: darkMode ? "#333" : "#000",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            },
          }}
        />

        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="70vh"
          >
            <CircularProgress color="primary" />
            <Typography mt={2} variant="body2" color="text.secondary">
              Loading blog post...
            </Typography>
          </Box>
        ) : blog ? (
          <Box mt={4}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ fontStyle: "italic", textAlign: "right" }}
            >
              Published on {blog.readable_publish_date}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box
              className="blog-content"
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                padding: isMobile ? 2 : 3,
                fontSize: "1rem",
                lineHeight: 1.8,
                overflowX: "hidden",
                wordBreak: "break-word",
                whiteSpace: "normal",
                "& img": {
                  maxWidth: "100%",
                  borderRadius: "8px",
                  margin: "1rem 0",
                  transition: "opacity 0.5s ease-in-out",
                  opacity: 1,
                },
                "& pre": {
                  background: "transparent",
                  padding: 0,
                },
              }}
              dangerouslySetInnerHTML={{
                __html: getParsedContent(),
              }}
            />
          </Box>
        ) : (
          <Typography variant="h6" color="error" mt={4}>
            Blog not found
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default BlogDetail;
