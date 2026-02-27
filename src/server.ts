import app from "./app";

process.on("uncaughtException", (err) => {
  console.error(err);
});

const PORT = process.env.PORT || 8000;

// Start Server
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT} ✅`));
