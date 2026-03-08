import promisePool from '../config/db.js';

export const getPatients = async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM patients ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const createPatient = async (req, res) => {
    const { first_name, last_name, birth_date, gender } = req.body;
    try {
        const [result] = await promisePool.query(
            'INSERT INTO patients (first_name, last_name, birth_date, gender) VALUES (?, ?, ?, ?)',
            [first_name, last_name, birth_date, gender]
        );
        res.status(201).json({ id: result.insertId, first_name, last_name, birth_date, gender });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, birth_date, gender } = req.body;
    try {
        await promisePool.query(
            'UPDATE patients SET first_name=?, last_name=?, birth_date=?, gender=? WHERE id=?',
            [first_name, last_name, birth_date, gender, id]
        );
        res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        await promisePool.query('DELETE FROM patients WHERE id=?', [id]);
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
