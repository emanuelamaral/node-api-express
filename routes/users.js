const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/User');
const isAuthorized = require('../middleware/isAuthorized');

const JWT_SECRET = 'asdfasdf4234y235yh4h5erther'; 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', router);
// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

/* GET users listing. */
router.get("/", async function(req, res) {
  return res.json(await User.find());
});

// Obter um usuário pelo ID
router.get("/:id", isAuthorized, async (req, res) => {
  const { id } = req.params;

  const result = await User.findById(id);

  return result 
    ? res.json(result)
    : res.status(404).send();
});

// Criar uma pessoa
router.post("/", async (req, res) => {
  const json = req.body;
  
  const salt = await bcrypt.genSalt(10);
  json.password = await bcrypt.hash(json.password, salt);

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

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const result = await User.findByIdAndUpdate(id, updates, { new: true });

    return result 
      ? res.json(result)
      : res.status(404).send('User not found');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await User.findByIdAndDelete(id);
  return result 
    ? res.json(result)
    : res.status(404).send();
});

// EXPORT DO MÓDULO
module.exports = router;
