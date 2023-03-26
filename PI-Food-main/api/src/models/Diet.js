const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Diet = sequelize.define('Diet', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Diet;
}
