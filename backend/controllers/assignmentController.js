import promisePool from '../config/db.js';

export const createAssignment = async (req, res) => {
    const { sample_id, user_id } = req.body;
    try {
        await promisePool.query(
            'INSERT INTO assignments (sample_id, user_id, assigned_by) VALUES (?, ?, ?)',
            [sample_id, user_id, req.userId]
        );
        
        // Update sample status to 'Assigned'
        await promisePool.query('UPDATE samples SET status=? WHERE id=?', ['Assigned', sample_id]);
        
        // Log history
        await promisePool.query(
            'INSERT INTO history (sample_id, user_id, action) VALUES (?, ?, ?)',
            [sample_id, req.userId, `Assigned to user ID ${user_id}`]
        );

        res.status(201).json({ message: 'Sample assigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT a.*, s.code as sample_code, u.first_name, u.last_name 
            FROM assignments a
            JOIN samples s ON a.sample_id = s.id
            JOIN users u ON a.user_id = u.id
            ORDER BY a.assigned_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
