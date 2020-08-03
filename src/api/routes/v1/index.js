const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  return res.status(200).send({
    message: 'Ahhha! The API is UP && RUNNING!'
  })
})

router.get('/status', (req, res) => res.send('OK'))
router.use('/docs', express.static('docs'))

router.use('/auth', require('./auth.route'))
router.use('/users', require('./user.route'))

router.use('/claims', require('./claims.route'))

module.exports = router
