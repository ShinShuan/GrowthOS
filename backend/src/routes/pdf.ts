import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

const PDF_PATH = path.join(__dirname, '../../../pdf/output/Guide_10_RDV_automatiques.pdf');

router.get('/download', (_req: Request, res: Response) => {
    if (!fs.existsSync(PDF_PATH)) {
        return res.status(404).json({ success: false, message: 'PDF non trouvé. Exécutez: npm run generate:pdf' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Guide_10_RDV_automatiques.pdf"');

    const stream = fs.createReadStream(PDF_PATH);
    stream.pipe(res);
});

export default router;
