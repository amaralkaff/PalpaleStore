const formatNumber = require('../helpers/formatDollar')
const { Category, Product, ProductCategory, User, Profile } = require('../models')

class Controller {
    static async home(req, res) {
        try {
            res.render('home.ejs')
        } catch (err) {
            res.send(err)
        }
    }

    static async login(req, res) {
        try {
            res.render('login.ejs')
        } catch (err) {
            res.send(err)
        }
    }

    static async loginPost(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({
                where: {
                    username,
                    password
                },
                include: Profile
            })
            if (user) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    profile: user.Profile
                }
                res.redirect('/products')
            } else {
                res.send('username/password salah')
            }
        } catch (err) {
            res.send(err)
        }
    }

    static async register(req, res) {
        try {
            res.render('register.ejs')
        } catch {
            res.send(err)
        }
    }

    static async registerPost(req, res) {
        try {
            const { username, password, role } = req.body
            const user = await User.create({
                username,
                password,
                role
            })
            res.redirect('/login', { user })
        } catch (err) {
            res.send(err)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy()
            res.redirect('/')
        } catch (err) {
            res.send(err)
        }
    }

    static async products(req, res) {
        try {
            const filter = req.query.filter
            const product = await Product.findAll({
                include: Category
            })
            if (filter) {
                const filteredProduct = product.filter(el => el.Category.name === filter)
                res.render('products.ejs', { product: filteredProduct, formatNumber })
            }
            res.render('products.ejs', { product, formatNumber })
        } catch (err) {
            res.send(err)
        }
    }

    static async addProduct(req, res) {
        try {
            const categories = await Category.findAll()
            res.render('addProduct.ejs', { categories })
        } catch (err) {
            res.send(err)
        }
    }

    static async addProductPost(req, res) {
        try {
            const { name, description, price, stock, productImg, category } = req.body
            const product = await Product.create({
                name,
                description,
                price,
                stock,
                productImg,
                UserId: req.session.user.id
            })
            const productCategory = await ProductCategory.create({
                ProductId: product.id,
                CategoryId: category
            })
            res.redirect('/products')
        } catch (err) {
            res.send(err)
        }
    }

    static async editProduct(req, res) {
        try {
            const product = await Product.findByPk(req.params.id)
            const categories = await Category.findAll()
            res.render('editProduct.ejs', { product, categories })
        } catch (err) {
            res.send(err)
        }
    }

    static async editProductPost(req, res) {
        try {
            const { name, description, price, stock, productImg, category } = req.body
            const product = await Product.update({
                name,
                description,
                price,
                stock,
                productImg,
                UserId: req.session.user.id
            }, {
                where: {
                    id: req.params.id
                }
            })
            const productCategory = await ProductCategory.update({
                ProductId: product.id,
                CategoryId: category
            }, {
                where: {
                    id: req.params.id
                }
            })
            res.redirect('/products', { productCategory })
        } catch (err) {
            res.send(err)
        }
    }

    static async deleteProduct(req, res) {
        try {
            const product = await Product.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.redirect('/products')
        } catch (err) {
            res.send(err)
        }
    }

    static async detailProduct(req, res) {
        try {
            const product = await Product.findByPk(req.params.id)
            res.render('productDetail.ejs', { product, formatNumber })
        } catch (err) {
            res.send(err)
        }
    }

    // static async cart(req, res) {
    //     try {
    //         res.render('cart.ejs')
    //     } catch (err) {
    //         res.send(err)
    //     }
    // }

    static async checkout(req, res) {
        try {
            res.render('checkout.ejs')
        } catch (err) {
            res.send(err)
        }
    }

}

module.exports = Controller