// IMPORTS
const express = require('express');
const router = express.Router();
const User = require('../model/User');
const isAuthorized = require('../middleware/isAuthorized');


// ROTAS

/* GET users listing. */
router.get("/", isAuthorized, async function(req, res) {
  return  res.json(await User.find());
});

// Obter um usuário pelo ID
router.get("/:id", isAuthorized, async (req, res) => {
  const {id} = req.params;

  const result = await User.findById(id);

  return result 
    ? res.json(result)
    : res.status(404).send();
});

// Criar uma pessoa
router.post("/", async (req, res) => {
  const json = req.body;

  const user = new User(json);

  const hasErrors = user.validateSync();

  return hasErrors
    ? res.status(400).json(hasErrors)
    : res.status(201).json(await user.save());
});


router.put("/:id", isAuthorized, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await User.findByIdAndUpdate(id, updates, { new: true });

    return result 
      ? res.json(result)
      : res.status(404).send('User not found');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.delete("/:id", isAuthorized, async (req,res)=>{
  const {id} = req.params;

  const result = await User.findByIdAndDelete(id)
  return result 
    ? res.json(result)
    : res.status(404).send();
});



// EXPORT DO MÓDULO
module.exports = router;
