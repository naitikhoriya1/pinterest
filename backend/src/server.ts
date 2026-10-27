import app from "./App";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
