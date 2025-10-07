const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/constants");
const connectDB = require("./config/database");
const routes = require("./routes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(
	cors({
		origin: "*",
	})
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routes);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
