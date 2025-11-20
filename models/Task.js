module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Idegen kulcs mező, ami a User-re hivatkozik
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Egy Task-nak mindig lennie kell szerzőjének
      // A reláció definíciója:
      references: { // A reláció definíciója:
        model: 'Users', // A tábla neve, amire hivatkozunk (alapértelmezetten a modell neve többes számban)
        key: 'id'      // A hivatkozott kulcs a User táblában
      }
    }
  }, {
        // Ezzel kikapcsoljuk az automatikus 'createdAt' és 'updatedAt' mezők létrehozását
    timestamps: false 
    // További modell beállítások (pl. tableName: 'tasks')
  });

  // Itt definiáljuk a relációt.
  Task.associate = function(models) {
    // Egy Task egy User-hez tartozik (Many-to-One)
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author' // Ezt az alias-t használjuk az include-oknál
    });
  };

  return Task;
};