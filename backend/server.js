const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cluster = require("cluster");
const os = require("os");
const { PORT } = require("./config/constants");
const connectDB = require("./config/database");
const routes = require("./routes");
require("dotenv").config();

// Get number of CPU cores
const numCPUs = os.cpus().length;

// Use clustering in production for better performance
if (process.env.NODE_ENV === "production" && cluster.isPrimary) {
    console.log(`🚀 Master process ${process.pid} is running`);
    console.log(`📊 Forking ${numCPUs} workers...`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const app = express();

    // Connect to MongoDB with optimized settings
    connectDB();

    // ===========================================
    // PERFORMANCE & SECURITY MIDDLEWARE
    // ===========================================

    // 1. Security headers (protect against common vulnerabilities)
    app.use(
        helmet({
            contentSecurityPolicy: false, // Disable for API
            crossOriginEmbedderPolicy: false,
        }),
    );

    // 2. Compression (gzip) - reduces response size by ~70%
    app.use(
        compression({
            level: 6, // Balanced compression level (1-9)
            threshold: 1024, // Only compress responses > 1KB
            filter: (req, res) => {
                if (req.headers["x-no-compression"]) {
                    return false;
                }
                return compression.filter(req, res);
            },
        }),
    );

    // 3. Rate limiting - prevent abuse
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // Limit each IP to 1000 requests per windowMs
        message: {
            error: "Too many requests, please try again later.",
            retryAfter: "15 minutes",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use("/api/", limiter);

    // 4. Strict rate limit for write operations
    const writeLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 30, // 30 write requests per minute
        message: { error: "Too many write requests, slow down." },
    });
    app.use("/api/issues", writeLimiter);

    // 5. CORS configuration
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
            exposedHeaders: ["X-Pod-Name", "X-Response-Time"], // Expose to browser JS
            maxAge: 86400, // Cache preflight for 24 hours
        }),
    );

    // 6. Body parser with size limits (prevent large payload attacks)
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // 7. Request timeout middleware
    app.use((req, res, next) => {
        req.setTimeout(30000); // 30 second timeout
        res.setTimeout(30000);
        next();
    });

    // 8a. Inject pod identity header (k8s Downward API sets POD_NAME)
    const POD_NAME = process.env.POD_NAME || `local-${process.pid}`;
    app.use((req, res, next) => {
        res.set("X-Pod-Name", POD_NAME);
        next();
    });

    // 8b. Pod info endpoint – lets clients explicitly check which pod they hit
    app.get("/pod-info", (req, res) => {
        res.json({
            pod: POD_NAME,
            namespace: process.env.POD_NAMESPACE || "local",
            node: process.env.NODE_NAME || "local",
            pid: process.pid,
            uptime: Math.round(process.uptime()),
        });
    });

    // 8. Add response time header for monitoring
    app.use((req, res, next) => {
        const start = Date.now();
        // Set header before response is sent, not after
        const originalSend = res.send;
        res.send = function (body) {
            const duration = Date.now() - start;
            if (!res.headersSent) {
                res.set("X-Response-Time", `${duration}ms`);
            }
            return originalSend.call(this, body);
        };
        next();
    });

    // ===========================================
    // ROUTES
    // ===========================================
    app.use("/", routes);

    // ===========================================
    // ERROR HANDLING
    // ===========================================

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: "Route not found" });
    });

    // Global error handler
    app.use((err, req, res, next) => {
        console.error("Server Error:", err);
        res.status(err.status || 500).json({
            error:
                process.env.NODE_ENV === "production"
                    ? "Internal server error"
                    : err.message,
        });
    });

    // ===========================================
    // SERVER CONFIGURATION
    // ===========================================

    // Increase server limits for high traffic
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Worker process ${process.pid} started`);
        console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Optimize server settings
    server.keepAliveTimeout = 65000; // Slightly higher than ALB's 60s
    server.headersTimeout = 66000;
    server.maxConnections = 10000; // Allow more concurrent connections
    server.timeout = 30000; // 30 second request timeout

    // Graceful shutdown
    process.on("SIGTERM", () => {
        console.log("SIGTERM received. Shutting down gracefully...");
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });
    });
}
