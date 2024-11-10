const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
require('dotenv').config(); // Carrega variáveis de ambiente
const bcrypt = require('bcrypt');


const utils = require('./util.js');

/*

    TODO: Trabalhar melhor o método POST
          Melhorar método GET
          Melhorar respostas de retorno dos métodos (STATUS CODE E MSG)

*/

// TODO: CRIAR FUNÇÕES PARA SALVAR O NOME DAS IMG DE FORMA DISTINTA
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta para salvar as imagens
    },
    filename: (req, file, cb) => {
        imageName = Date.now() + '-' + file.originalname;
        cb(null, imageName);
    }
});

const upload = multer({ storage });

app.use(cors());
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get("/getProjects", (req, res, next) => {
    const doc = utils.getAllProjectsInfo();
    if (doc) {
        res.status(200).json({ message: doc });
    } else {
        res.status(400).json({ message: 'Problema ao retornar projetos' });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota POST para receber os dados do formulário
app.post('/submitProjeto', upload.single('filefoto'), (req, res) => {
    req.body.chip = req.body.chip.filter(elem => elem !== '');
    req.body['filefoto'] = !req.file ? utils.prepareImagePath(false, '', false) : utils.prepareImagePath(true, imageName, false);
    let objProjeto = JSON.stringify(req.body);

    console.log(req.body);
    utils.addNewProject(req.body);
    res.status(200);
    res.json({ status: 'sucesso', mensagem: 'Formulário enviado com sucesso!' });
});

app.post('/submitMembro', upload.single('imgMembro'), async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Corpo da requisição vazio!' });
    }

    req.body['imagemMembro'] = !req.file ? utils.prepareImageMembro(false, '') : utils.prepareImageMembro(true, imageName);

    const statusOp = utils.saveMembro(
        req.body['nome_membro'],
        req.body['desc_membro'],
        req.body['cargo_membro'],
        req.body['afiliacao'],
        {
            'linkemail': req.body['email_membro'],
            'linkinstagram': req.body['insta_membro'],
            'linklinkedin': req.body['linkedin_membro'],
            'linkgithub': req.body['git_membro'],
            'linkorcid': req.body['orcid_membro']
        },
        req.body['imagemMembro']
    );

    res.status(statusOp);
    res.json({ status: 'sucesso', mensagem: 'Formulário enviado com sucesso!' });
});

// Rota POST para cadastrar notícias
app.post('/submitNoticias', upload.single('imagemNoticia'), (req, res) => {
    const titulo = req.body['tituloNoticia'];
    const tags = req.body['tags'];
    const description = req.body['descricaoNoticia'];
    req.body['imgNoticia'] = !req.file ? utils.prepareImagePath(false, '', true) : utils.prepareImagePath(true, imageName, true);

    utils.saveNoticia(titulo, req.body['imgNoticia'], tags, description);
    res.status(200);
    res.json({ status: 'sucesso', mensagem: 'Formulário enviado com sucesso!' });
});

// Nova rota para retornar as chaves do Firebase
app.get('/getSecretKeys', (req, res) => {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    res.status(200).json(firebaseConfig);
});

app.post('/hashPassword', async (req, res) => {
    try {
        const { password } = req.body; // Recebe a senha do corpo da requisição
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Gera o hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Retorna o hash para o cliente
        res.status(200).json({ hashedPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to hash password' });
    }
});

app.post('/verifyPassword', async (req, res) => {
    const { password, hashedPassword } = req.body;

    if (!password || !hashedPassword) {
        return res.status(400).json({ error: 'Password and hash are required' });
    }

    try {
        // Compara a senha com o hash usando bcrypt
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        res.status(200).json({ isPasswordCorrect });
    } catch (error) {
        console.error('Erro ao comparar senha:', error);
        res.status(500).json({ error: 'Erro ao verificar senha' });
    }
});