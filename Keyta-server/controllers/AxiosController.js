const axios = require('axios')

module.exports = class AxiosController {
  static async apiFilt(req, res, next) {
    const token = req.headers.token ? req.headers.token : "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMSwiZXhwIjoxNjQzODc1MjYzfQ.j4S10cHErkAD12qZ2P2HrimusB7QzlGQywLFTATjSHs"
    const body = Object.keys(req.body).length > 0 ? req.body : {
      "dest_address": "Jl. Anyelir, RT.9/RW.1, Jatipulo, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, Indonesia",
      "dest_lat": "-6.1779499",
      "dest_lng": "106.8010439",
      "dest_postal_code": "11430",
      "src_address": "Keyta (PT Kita Teknologi Andalan), Jalan Kamboja, RT.4/RW.7, Kota Bambu Utara, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, Indonesia", "src_lat": "-6.1816664",
      "src_lng": "106.802901",
      "src_postal_code": "11420",
      "weight": 1 }
    try {
      const axiosApi = await axios.post("https://sandbox.keyta.id/api/v1/costs", body, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const results = []
      const axiosed = axiosApi.data.results
      if (axiosApi.data) {
        axiosed.forEach(x => {
          if (x.name == "GOJEK") results[0] = x
          if (x.name == "GrabExpress") results[1] = x
          if (x.name == "JNE") results[2] = x
          if (x.name == "SiCepat") results[3] = x
          if (x.name == "Paxel") results[4] = x
          if (x.name == "AnterAja") results[5] = x
          if (x.name == "Deliveree") results[6] = x
        })
      }
      if (req.bool == true) return {results}
      else return res.status(200).json({results})
    } catch (error) {
      next(error)
    }
  }

  static async markupPrice(req, res, next) {
    try {

      req.bool = true
      const axiosed = await AxiosController.apiFilt(req)
      delete req.bool

      for (const x of axiosed.results) {
        for (const y of x.services) {
          y.courierPrice = y.totalPrice

          if (0 < y.totalPrice && y.totalPrice <= 17000 ) {
            y.markupPrice = 1000
            y.totalPrice += y.markupPrice
          }
          if (17001 < y.totalPrice && y.totalPrice <= 30000 ) {
            y.markupPrice = 2000
            y.totalPrice += y.markupPrice
          }
          if (30001 < y.totalPrice && y.totalPrice <= 40000 ) {
            y.markupPrice = 3000
            y.totalPrice += y.markupPrice
          }
          if (40001 < y.totalPrice && y.totalPrice <= 1290000 ) {
            y.markupPrice = 5000
            y.totalPrice += y.markupPrice
          }
          if (129001 < y.totalPrice) {
            y.markupPrice = 7000
            y.totalPrice += y.markupPrice
          }
        }
      }

      if (req.boolean == true) return axiosed
      return res.status(200).send(axiosed)
    } catch (error) {
      next(error)
    }
  }

  static async filtering(req, res, next) {
    try {
      req.boolean = true
      const markedPrice = await AxiosController.markupPrice(req)

      const results = []

      for (const courier of markedPrice.results) {
        if (courier.code == "grab_express") results[0] = courier
        if (courier.code == "deliveree") results[1] = courier
        if (courier.code == "paxel") results[2] = courier  
      }

      return res.status(200).send({results})
    } catch (error) {
      next(error)
    }
  }
}