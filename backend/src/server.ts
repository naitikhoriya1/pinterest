import app from "./App";

// PORT comes from .env via dotenv (loaded in App.ts). Default matches frontend VITE_API_URL.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
