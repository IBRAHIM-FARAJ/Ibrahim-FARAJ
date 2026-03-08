import promisePool from './config/db.js';
import bcrypt from 'bcrypt';

async function fixAdmin() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        await promisePool.query('UPDATE users SET password = ? WHERE username = ?', [hash, 'admin']);
        console.log('Admin password updated successfully to ' + hash);
        process.exit(0);
    } catch (error) {
        console.error('Error updating admin: ', error);
        process.exit(1);
    }
}

fixAdmin();
