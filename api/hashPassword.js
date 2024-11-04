const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ error: 'Password is required' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            res.status(200).json({ hashedPassword });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to hash password' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
