const express = require('express');
const router = express.Router();
const Event = require('../model/Event');
const isAuthorized = require('../middleware/isAuthorized');

router.get("/", async function(req, res) {
    return res.json(await Event.find());
});

router.get("/:id", async (req, res) => {
    const {id} = req.params;

    const result = await Event.findById(id);
    return result
        ? res.json(result)
        : res.status(404).send();

});

router.post("/", async (req, res) => {
    const json = req.body;
    const event = new Event(json);
    const hasErrors = event.validateSync();

    return hasErrors
        ? res.status(400).json(hasErrors)
        : res.status(201).json(await event.save());
});

module.exports = router;

