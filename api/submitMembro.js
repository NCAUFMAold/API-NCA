const multer = require('multer');
const utils = require('../util.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        imageName = Date.now() + '-' + file.originalname;
        cb(null, imageName);
    }
});
const upload = multer({ storage });

module.exports = (req, res) => {
    if (req.method === 'POST') {
        upload.single('imgMembro')(req, res, () => {
            if (!req.body) {
                return res.status(400).json({ error: 'Corpo da requisição vazio!' });
            }

            req.body['imagemMembro'] = req.file
                ? utils.prepareImageMembro(true, imageName)
                : utils.prepareImageMembro(false, '');

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

            res.status(statusOp).json({ status: 'sucesso', mensagem: 'Formulário enviado com sucesso!' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
