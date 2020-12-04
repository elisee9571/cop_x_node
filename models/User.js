module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "user", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true
            },
            prenom: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: true
            },
            email: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false
            },
            role: {
                type: Sequelize.DataTypes.STRING(45),
                allowNull: false
            },
        }, {
            timestamps: false,
            underscored: true
        }
    );
};