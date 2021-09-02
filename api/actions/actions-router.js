const express = require('express')
const Actions = require('./actions-model');
const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            if (!actions) {
                res.status(200).json([])
            } else {
                res.status(200).json(actions)
            }
        })
})

module.exports = router;