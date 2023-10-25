const router = require('express').Router();
const Controller = require('../controllers/controller');

router.get('/', Controller.home);

router.get('/login', Controller.login);
router.post('/login', Controller.loginPost);

router.get('/register', Controller.register);
router.post('/register', Controller.registerPost);

router.get('/logout', Controller.logout);

router.get('/products', Controller.products);

router.get('/products/add', Controller.addProduct);
router.post('/products/add', Controller.addProductPost);

router.get('/products/edit/:id', Controller.editProduct);
router.post('/products/edit/:id', Controller.editProductPost);

router.get('/products/delete/:id', Controller.deleteProduct);

router.get('/product/:id', Controller.detailProduct);

// router.get('/cart', Controller.cart);

// router.get('/cart/add/:id', Controller.addCart);

// router.get('/cart/delete/:id', Controller.deleteCart);

router.get('/checkout', Controller.checkout);

module.exports = router;