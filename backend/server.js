const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/constants");
const routes = require("./routes");

const app = express();

app.use(
	cors({
		origin: "*",
	})
);

// Routes
app.use("/", routes);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
