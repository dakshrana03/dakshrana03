const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'Users',
    });

    User.associate = (models) => {
        User.hasMany(models.Question, {
            onDelete: "cascade",
        });
    };

    return User;
};
