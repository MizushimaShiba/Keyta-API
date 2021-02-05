const { Router } = require('express')
const AxiosController = require('../controllers/AxiosController')

const routes = Router()

routes.get('/sort-api', AxiosController.apiFilt)
routes.get('/markup-price', AxiosController.markupPrice)
routes.get('/filtering', AxiosController.filtering)


module.exports = routes