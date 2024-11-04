const utils = require('../util.js');

module.exports = (req, res) => {
    if (req.method === 'GET') {
        const doc = utils.getAllProjectsInfo();
        if (doc) {
            res.status(200).json({ message: doc });
        } else {
            res.status(400).json({ message: 'Problema ao retornar projetos' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
