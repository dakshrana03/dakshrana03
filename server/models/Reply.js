const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    const Reply = sequelize.define("Reply", {
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'Replies',
    });

    Reply.belongsTo(Reply, {as: "parentReply", foreignKey: "parentId"});
    Reply.hasMany(Reply, {as: "nestedReplies", foreignKey: "parentId", constraints: false});

    return Reply;
};
