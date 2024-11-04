module.exports = (req, res) => {
    const allowedOrigins = ['https://ncaufma.github.io', 'http://localhost:4000'];
    const origin = req.headers.origin;
  
    // Verifique se a origem da solicitação está na lista de origens permitidas
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
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      };
  
      res.status(200).json(firebaseConfig);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };
  