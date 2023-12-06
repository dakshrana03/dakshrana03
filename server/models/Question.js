const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    const Question = sequelize.define("Question", {
            topic: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            question: {
                type: DataTypes.TEXT('long'),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        },
        {
            tableName: 'Questions',
        });

    Question.associate = (models) => {
        Question.hasMany(models.Reply, {
            onDelete: "cascade",
        });
    };

    return Question;
};
