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
        upload.single('filefoto')(req, res, () => {
            req.body.chip = req.body.chip.filter(elem => elem !== '');
            req.body['filefoto'] = req.file
                ? utils.prepareImagePath(true, imageName, false)
                : utils.prepareImagePath(false, '', false);

            utils.addNewProject(req.body);
            res.status(200).json({ status: 'sucesso', mensagem: 'Formulário enviado com sucesso!' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
