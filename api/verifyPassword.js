const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { password, hashedPassword } = req.body;

        if (!password || !hashedPassword) {
            return res.status(400).json({ error: 'Password and hash are required' });
        }

        try {
            const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
            res.status(200).json({ isPasswordCorrect });
        } catch (error) {
            console.error('Erro ao comparar senha:', error);
            res.status(500).json({ error: 'Erro ao verificar senha' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
