const express = require('express');
const router = express.Router();
const { models } = require('../db');
const { Task: TaskModel } = models;

// POST /tasks - Új feladat létrehozása
router.post('/', async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: 'A "title" és "userId" mezők kitöltése kötelező.' });
    }
    const newTask = await TaskModel.create({ title, description, userId });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Hiba az új feladat létrehozásakor:', error);
    res.status(500).json({ error: 'Szerveroldali hiba.' });
  }
});

// GET /tasks - Összes feladat lekérdezése
router.get('/', async (req, res) => {
  try {
    const tasks = await TaskModel.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a feladatok lekérdezésekor.' });
  }
});

// DELETE /tasks/:id - Feladat törlése ID alapján
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID kinyerése az URL paraméterből
    const task = await TaskModel.findByPk(id); // Feladat megkeresése az elsődleges kulcs (ID) alapján

    // Ellenőrizzük, hogy létezik-e a feladat
    if (!task) {
      // Ha nincs ilyen feladat, 404-es (Not Found) hibát küldünk
      return res.status(404).json({ error: 'A megadott ID-val nem található feladat.' });
    }

    await task.destroy(); // Feladat törlése az adatbázisból

    // Sikeres törlés esetén 200 (OK) státuszt és egy megerősítő üzenetet küldünk.
    res.status(200).json({ message: `A(z) ${id} ID-jú feladat sikeresen törölve.` });
  } catch (error) {
    console.error('Hiba a feladat törlésekor:', error);
    res.status(500).json({ error: 'Szerveroldali hiba a törlés során.' });
  }
});

module.exports = router;
