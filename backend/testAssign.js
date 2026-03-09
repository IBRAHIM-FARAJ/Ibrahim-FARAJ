async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        const usersRes = await fetch('http://localhost:5000/api/auth/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        const doctor = usersData.find(u => u.role_id === 4);
        console.log('Available Doctor:', doctor ? doctor.last_name : 'None');

        const samplesRes = await fetch('http://localhost:5000/api/samples', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const samplesData = await samplesRes.json();
        const sample = samplesData.find(s => s.status === 'Received');
        console.log('Available Sample:', sample ? sample.code : 'None');

        if (doctor && sample) {
            const assignRes = await fetch('http://localhost:5000/api/assignments', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ sample_id: sample.id, user_id: doctor.id })
            });
            const assignData = await assignRes.json();
            console.log('Assignment Result:', assignData);
            
            const assignmentsListRes = await fetch('http://localhost:5000/api/assignments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const assignmentsListData = await assignmentsListRes.json();
            console.log('Total Assignments:', assignmentsListData.length);
        }
    } catch(err) {
        console.error('Test Failed:', err);
    }
}
test();
