import promisePool from '../config/db.js';

const generateSampleCode = async () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SMP-${timestamp}-${random}`;
};

const logHistory = async (sample_id, user_id, action) => {
    await promisePool.query(
        'INSERT INTO history (sample_id, user_id, action) VALUES (?, ?, ?)',
        [sample_id, user_id, action]
    );
};

export const getSamples = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT s.*, p.first_name as patient_first, p.last_name as patient_last 
            FROM samples s
            JOIN patients p ON s.patient_id = p.id
            ORDER BY s.id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const createSample = async (req, res) => {
    const { date_received, patient_id } = req.body;
    try {
        const code = await generateSampleCode();
        const [result] = await promisePool.query(
            'INSERT INTO samples (code, date_received, patient_id, created_by, status) VALUES (?, ?, ?, ?, ?)',
            [code, date_received, patient_id, req.userId, 'Received']
        );
        
        await logHistory(result.insertId, req.userId, 'Sample created and received');
        res.status(201).json({ id: result.insertId, code, status: 'Received' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updateSampleStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await promisePool.query('UPDATE samples SET status=? WHERE id=?', [status, id]);
        await logHistory(id, req.userId, `Status updated to ${status}`);
        res.json({ message: 'Sample status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
