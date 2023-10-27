const formatNumber = require('../helpers/formatDollar')
const { Category, Product, ProductCategory, User, Profile } = require('../models')
const xendit = require('xendit-node');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

class Controller {

    // static async webhook(req, res) {
    //     try {
    //         // console.log(req.body)
    //         res.status(200).json({
    //             message: 'webhook'
    //         })
    //     } catch (err) {
    //         res.send(err)
    //     }
    // }

    static async home(req, res) {
        try {
            res.render('home.ejs')
        } catch (err) {
            res.send(err)
        }
    }

    static async login(req, res) {
        try {
            let error = []
            if (req.query.err) {
                error = req.query.err.split(',')
            }
            res.render('login.ejs'), { error }
        } catch (error) {
            res.send(error)
        }
    }

    static async loginPost(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({
                where: {
                    username
                }
            })
            if (user) {
                const isPassword = bcrypt.compareSync(password, user.password)
                // console.lo(isPassword);
                if (isPassword) {
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        Profile: user.Profile
                    }
                    // console.log(req.session);
                    res.redirect('/products')
                } else {
                    res.redirect('/login?error=Invalid Password')
                }
            } else {
                res.redirect('/login?error=Invalid Username')
            }
        } catch (error) {
            if (err.name === 'SequelizeValidationError') {
                const err = error.errors.map(err => err.message);
                res.redirect(`/login?err=${err}`);
            }
        }
    }

    static async register(req, res) {
        try {
            let error = []
            if (req.query.err) {
                error = req.query.err.split(',')
            }
            res.render('register.ejs', { error })
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
            // console.log(user);
            res.redirect('/login')
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const err = error.errors.map(err => err.message);
                res.redirect(`/register?err=${err}`);
            }
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy()
            res.redirect('/login')
        } catch (err) {
            res.send(err)
        }
    }

    static async showProducts(req, res) {
        try {
            let sortPrice = req.query.sortPrice
            let search = req.query.search
            const data = await Product.getSearchFilter(sortPrice, search)
            const username = req.session.user.username
            const role = req.session.user.role

            res.render('products.ejs', { data, username, role, formatNumber })
        } catch (err) {
            // console.log(err);
            res.send(err.message)
        }
    }

    static async addProduct(req, res) {
        try {
            let error = []
            if (req.query.err) {
                error = req.query.err.split(',')
            }
            const categories = await Category.findAll()
            res.render('addProduct.ejs', { categories, error })
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
                productImg: productImg,
                UserId: req.session.user.id
            })
            const productCategory = await ProductCategory.create({
                ProductId: product.id,
                CategoryId: category
            })
            res.redirect('/products')
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const err = error.errors.map(err => err.message);
                res.redirect(`/products/add?err=${err}`);
            }
        }
    }

    static async editProduct(req, res) {
        try {
            let error = []
            if (req.query.err) {
                error = req.query.err.split(',')
            }
            const product = await Product.findByPk(req.params.id)
            const categories = await Category.findAll()
            // console.log(product, categories);
            res.render('editProduct.ejs', { product, categories, error })
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
            // console.log(product);
            const productCategory = await ProductCategory.update({
                ProductId: product.id,
                CategoryId: category
            }, {
                where: {
                    id: req.params.id
                }
            })
            // console.log(productCategory);
            res.redirect('/products')
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const err = error.errors.map(err => err.message);
                res.redirect(`/products/edit/${req.params.id}?err=${err}`);
            }
        }
    }

    static async deleteProduct(req, res) {
        try {
            const productCategory = await ProductCategory.destroy({
                where: {
                    ProductId: req.params.id
                }
            })
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
            const product = await Product.increment('stock', {
                by: 1,
                where: {
                    id: req.params.id
                }
            })
            const data = await Product.findByPk(req.params.id, {
                include: Category
            })
            const role = req.session.user.role
            res.render('detailProduct.ejs', { data, product, role, formatNumber })
        } catch (err) {
            res.send(err)
        }
    }

    static async checkout(req, res) {
        try {
            const data = await Product.findByPk(req.params.id, {
                include: Category,
                where: {
                    id: req.params.id
                },
                exclude: ['createdAt', 'updatedAt']
            })
            const username = req.session.user.username
            const role = req.session.user.role
            const name = req.body.name
            const product = await Product.update({
                name: name
            }, {
                where: {
                    id: req.params.id
                },
                include: Category
            })
            res.render('checkout.ejs', { product, username, role, data, formatNumber })
        } catch (err) {
            res.send(err)
        }
    }
    

    
    static async userProfile(req, res) {
        try {
            const data = await User.findAll({
                where: {
                    id: req.session.user.id
                },
                include: Profile
            })
            // console.log(data);
            res.render('userProfile.ejs', { data })
        } catch (err) {
            res.send(err)
        }
    }

    static async buyProduct(req, res) {
        try {
            const product = await Product.update({
                stock: req.body.stock
            }, {
                where: {
                    id: req.params.id
                }
            })
            console.log(product);
            res.redirect('/products')
        } catch (err) {
            res.send(err)
        }
    }


    
    
    
    
    
}

module.exports = Controller