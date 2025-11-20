const express = require('express');
const router = express.Router();
const { models } = require('../db');
const { User: UserModel } = models;

// POST /users - Új felhasználó létrehozása
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Az "email" mező kitöltése kötelező.' });
    }
    const newUser = await UserModel.create({ email, name });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Hiba az új user létrehozásakor:', error);
    res.status(500).json({ error: 'Szerveroldali hiba.' });
  }
});

// GET /users - Összes felhasználó lekérdezése
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a felhasználók lekérdezésekor.' });
  }
});

// DELETE /users/:id - Felhasználó és a hozzá tartozó feladatok törlése
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'A megadott ID-val nem található felhasználó.' });
    }

    // A felhasználó törlése.
    // Az onDelete: 'CASCADE' beállítás miatt a Sequelize (és az adatbázis)
    // automatikusan törli a felhasználóhoz tartozó összes feladatot is.
    await user.destroy();

    res.status(200).json({ message: `A(z) ${id} ID-jú felhasználó és az összes hozzá tartozó feladat sikeresen törölve.` });
  } catch (error) {
    console.error('Hiba a felhasználó törlésekor:', error);
    res.status(500).json({ error: 'Szerveroldali hiba a törlés során.' });
  }
});

module.exports = router;
