/**
 * Simple In-Memory Cache Middleware
 * For production, use Redis for distributed caching
 */

class CacheService {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 60 * 1000; // 1 minute default

        // Cleanup expired entries every minute
        setInterval(() => this.cleanup(), 60 * 1000);
    }

    /**
     * Get item from cache
     */
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    /**
     * Set item in cache
     */
    set(key, value, ttl = this.defaultTTL) {
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttl,
        });
    }

    /**
     * Delete item from cache
     */
    delete(key) {
        this.cache.delete(key);
    }

    /**
     * Clear cache entries matching a pattern
     */
    clearPattern(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Cleanup expired entries
     */
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Get cache stats
     */
    stats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

// Singleton instance
const cacheService = new CacheService();

/**
 * Cache middleware factory
 * @param {number} ttl - Time to live in milliseconds
 */
const cacheMiddleware = (ttl = 60000) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        const key = `${req.originalUrl}`;
        const cached = cacheService.get(key);

        if (cached) {
            res.set("X-Cache", "HIT");
            return res.json(cached);
        }

        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json method to cache response
        res.json = (body) => {
            // Only cache successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cacheService.set(key, body, ttl);
            }
            res.set("X-Cache", "MISS");
            return originalJson(body);
        };

        next();
    };
};

/**
 * Invalidate cache middleware (use after write operations)
 */
const invalidateCache = (pattern) => {
    return (req, res, next) => {
        // Clear cache after response is sent
        res.on("finish", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (pattern) {
                    cacheService.clearPattern(pattern);
                } else {
                    // Clear based on request params
                    const { username, repo } = req.params;
                    if (username && repo) {
                        cacheService.clearPattern(
                            `/api/issues/${username}/${repo}`,
                        );
                    }
                }
            }
        });
        next();
    };
};

module.exports = {
    cacheService,
    cacheMiddleware,
    invalidateCache,
};
