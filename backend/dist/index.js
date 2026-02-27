"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const leads_1 = __importDefault(require("./routes/leads"));
const pdf_1 = __importDefault(require("./routes/pdf"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL || 'http://localhost:19006', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/leads', leads_1.default);
app.use('/api/pdf', pdf_1.default);
// Health check & Root
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/', (_req, res) => {
    res.send('GrowthOS Backend is running. Access API at /api/...');
});
// Export the app for Vercel Serverless
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 GrowthOS Backend running on http://localhost:${PORT}`);
    });
}
exports.default = app;
module.exports = app;
