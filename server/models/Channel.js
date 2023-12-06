const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    const Channel = sequelize.define("Channel", {
        channelName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'Channels',
    });

    Channel.associate = (models) => {
        Channel.hasMany(models.Question, {
            onDelete: "cascade",
        });
    };

    return Channel;
};
