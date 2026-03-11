import promisePool from '../config/db.js';

const logHistory = async (sample_id, user_id, action) => {
    await promisePool.query(
        'INSERT INTO history (sample_id, user_id, action) VALUES (?, ?, ?)',
        [sample_id, user_id, action]
    );
};

export const getSamples = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT s.*, t.name as team_name 
            FROM samples s
            LEFT JOIN teams t ON s.team_id = t.id
            ORDER BY s.id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const createSample = async (req, res) => {
    const { reference, patient_reference, type, service, date_reception, nombre } = req.body;
    try {
        const [result] = await promisePool.query(
            'INSERT INTO samples (reference, patient_reference, type, service, date_reception, nombre, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [reference, patient_reference, type, service, date_reception, nombre || 1, req.userId, 'En attente']
        );
        
        await logHistory(result.insertId, req.userId, 'Prélèvement créé et reçu');
        res.status(201).json({ id: result.insertId, reference, status: 'En attente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updateSample = async (req, res) => {
    const { id } = req.params;
    const { reference, patient_reference, type, service, date_reception, nombre } = req.body;
    try {
        // Enforce restriction: specific fields modify only if status is 'En attente'
        const [current] = await promisePool.query('SELECT status FROM samples WHERE id=?', [id]);
        if (current.length === 0) return res.status(404).json({error: 'Sample not found'});
        if (current[0].status !== 'En attente') {
            return res.status(403).json({error: 'Modification interdite car le statut n est plus "En attente".'});
        }

        await promisePool.query(
            'UPDATE samples SET reference=?, patient_reference=?, type=?, service=?, date_reception=?, nombre=? WHERE id=?',
            [reference, patient_reference, type, service, date_reception, nombre, id]
        );
        await logHistory(id, req.userId, 'Prélèvement modifié');
        res.json({ message: 'Modifié avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const deleteSample = async (req, res) => {
    const { id } = req.params;
    try {
        // Enforce restriction: delete only if status is 'En attente'
        const [current] = await promisePool.query('SELECT status FROM samples WHERE id=?', [id]);
        if (current.length === 0) return res.status(404).json({error: 'Sample not found'});
        if (current[0].status !== 'En attente') {
            return res.status(403).json({error: 'Suppression interdite car le statut n est plus "En attente".'});
        }

        await promisePool.query('DELETE FROM samples WHERE id=?', [id]);
        res.json({ message: 'Supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updateSampleStatus = async (req, res) => {
    const { id } = req.params;
    const { status, team_id } = req.body;
    try {
        if (team_id) {
            await promisePool.query('UPDATE samples SET status=?, team_id=? WHERE id=?', [status, team_id, id]);
            await logHistory(id, req.userId, `Statut et Assignation modifiés: ${status}`);
        } else {
            await promisePool.query('UPDATE samples SET status=? WHERE id=?', [status, id]);
            await logHistory(id, req.userId, `Statut modifié: ${status}`);
        }
        res.json({ message: 'Mise à jour réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getTeams = async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM teams');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
