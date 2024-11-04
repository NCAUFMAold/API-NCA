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
        upload.single('imagemNoticia')(req, res, () => {
            const titulo = req.body['tituloNoticia'];
            const tags = req.body['tags'];
            const description = req.body['descricaoNoticia'];
            req.body['imgNoticia'] = req.file
                ? utils.prepareImagePath(true, imageName, true)
                : utils.prepareImagePath(false, '', true);

            utils.saveNoticia(titulo, req.body['imgNoticia'], tags, description);
            res.status(200).json({ status: 'sucesso', mensagem: 'Formulário enviado com sucesso!' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
