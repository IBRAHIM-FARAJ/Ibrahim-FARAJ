import promisePool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        const [totalSamples] = await promisePool.query('SELECT COUNT(*) as count FROM samples');
        const [todaySamples] = await promisePool.query('SELECT COUNT(*) as count FROM samples WHERE DATE(created_at) = CURDATE()');
        const [inAnalysisSamples] = await promisePool.query('SELECT COUNT(*) as count FROM samples WHERE status = "En analyse"');
        const [completedSamples] = await promisePool.query('SELECT COUNT(*) as count FROM samples WHERE status = "Résultat prêt"');

        res.json({
            total: totalSamples[0].count,
            today: todaySamples[0].count,
            enAnalyse: inAnalysisSamples[0].count,
            resultatPret: completedSamples[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getHistory = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT h.*, s.reference as sample_code, u.first_name, u.last_name 
            FROM history h
            JOIN samples s ON h.sample_id = s.id
            JOIN users u ON h.user_id = u.id
            ORDER BY h.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
