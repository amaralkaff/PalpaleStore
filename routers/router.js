const router = require('express').Router();
const path = require('path');
const Controller = require('../controllers/controller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        console.log(file, '11');
        const filePath = Date.now() + path.extname(file.originalname)
        req.body.productImg = filePath

        cb(null, filePath)
    }
})


const upload = multer({ storage: storage })


router.get('/', Controller.home);

router.get('/register', Controller.register);
router.post('/register', Controller.registerPost);

router.get('/login', Controller.login);
router.post('/login', Controller.loginPost);

router.use((req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/login')
    }

    
})

router.get('/logout', Controller.logout);

router.get('/products', Controller.showProducts);

router.get('/products/add', Controller.addProduct);
router.post('/products/add', upload.single('productImg'), Controller.addProductPost);

router.get('/products/edit/:id', Controller.editProduct);
router.post('/products/edit/:id', Controller.editProductPost);

router.get('/products/delete/:id', Controller.deleteProduct);

router.get('/product/:id', Controller.detailProduct);

router.get('/products/buy/:id', Controller.buyProduct);

router.get('/userProfile', Controller.userProfile);

router.get('/checkout', Controller.checkout);



module.exports = router;