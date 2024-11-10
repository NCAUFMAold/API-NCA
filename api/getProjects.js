const utils = require('../util.js');

module.exports = (req, res) => {
    const allowedOrigins = ['https://ncaufma.github.io', 'http://localhost:4000'];
    const origin = req.headers.origin;
  
    // Verifique se a origem da solicitação está na lista de origens permitida
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', ''); // Define como vazio para outras origens
    }
  
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Permite apenas o método GET
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Permite apenas cabeçalhos específicos
  
    if (req.method === 'OPTIONS') {
      // Responde a preflight requests (opcional para suportar CORS com métodos HTTP seguros)
      res.status(200).end();
    } else if (req.method === 'GET') {
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
