const path = require("path");
const router = require("express").Router({ mergeParams: true });
const apiRoutes = require('./classRoutes');
const userController = require('../controllers/userController.js');


router.use('/users', userController);

// Rotas da API
router.use('/api', apiRoutes);


//Rotas da API externa
// router.route('rota para métodos diretamente para um controlador')
// .get('requer o controller acima e então traga o método')

// Se nenhuma rota de API for atingida, envie o aplicativo React
router.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;