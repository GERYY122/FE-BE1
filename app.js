// 1. Importáljuk az Express modult
const express = require('express');
const { connectToDatabase, models } = require('./db'); // Adatbázis modul importálása

// 2. Létrehozzuk az alkalmazás példányát
const app = express();
//middleware a JSON body-k kezeléséhez
app.use(express.json());

// 3. Beállítunk egy portot, amit a szerver figyelni fog
const PORT = 3000;

// Modellek kinyerése a `models` objektumból
const { User: UserModel, Task: TaskModel } = models;

// 4. Alkalmazás inicializálása és szerver indítása
async function initializeApp() {
  await connectToDatabase(); // Kapcsolódás az adatbázishoz
  app.listen(PORT, () => {
    console.log(`A Szerver fut a http://localhost:${PORT} címen.`);
  });
}

initializeApp();

app.post('/tasks', async (req, res) => {
  try {
    // 1. Kinyerjük a szükséges mezőket a kérés testéből
    const { title, description, userId } = req.body;

    // 2. Ellenőrzés: A kötelező mezők nem lehetnek üresek
    if (!title || !userId) {
      return res.status(400).json({ error: 'A "title" és "userId" mezők kitöltése kötelező.' });
    }
  //  console.log(req.body );
    // 3. Sequelize: Új rekord létrehozása a modell alapján
    const newTask = await TaskModel.create({ title, description, userId });

    // 4. Válasz küldése a létrehozott objektummal (HTTP 201 Created)
    res.status(201).json(newTask);

  } catch (error) {
    console.error('Hiba az új feladat létrehozásakor:', error);
    res.status(500).json({ error: 'Szerveroldali hiba.' });
  }
});

// user létrehozása

app.post('/users', async (req, res) => {
  try {
    // 1. Kinyerjük a szükséges mezőket a kérés testéből
    const { email, name } = req.body;

    // 2. Ellenőrzés: Az email mező nem lehet üres
    if (!email) {
      return res.status(400).json({ error: 'Az "email" mező kitöltése kötelező.' });
    }

    // 3. Sequelize: Új rekord létrehozása a modell alapján
    const newUser = await UserModel.create({ email, name });

    // 4. Válasz küldése a létrehozott objektummal (HTTP 201 Created)
    res.status(201).json(newUser);

  } catch (error) {
    console.error('Hiba az új user létrehozásakor:', error);
    res.status(500).json({ error: 'Szerveroldali hiba.' });
  }
});


// Összes feladat lekérdezése
// Példa: Összes feladat lekérdezése Sequelize-vel
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.findAll(); // SQL helyett JS metódus!
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a feladatok lekérdezésekor.' });
  }
});

// Összes user lekérdezése
// Példa: Összes user lekérdezése Sequelize-vel
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.findAll(); // SQL helyett JS metódus!
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Hiba a felhasználók lekérdezésekor.' });
  }
});
