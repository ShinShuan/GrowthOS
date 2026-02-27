"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const PDF_PATH = path_1.default.join(__dirname, '../../../pdf/output/Guide_10_RDV_automatiques.pdf');
router.get('/download', (_req, res) => {
    if (!fs_1.default.existsSync(PDF_PATH)) {
        return res.status(404).json({ success: false, message: 'PDF non trouvé. Exécutez: npm run generate:pdf' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Guide_10_RDV_automatiques.pdf"');
    const stream = fs_1.default.createReadStream(PDF_PATH);
    stream.pipe(res);
});
exports.default = router;
