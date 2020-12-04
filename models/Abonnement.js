module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // name of table
        "Abonnement", {
            // field name
            id: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey = true
                primaryKey: true,
                // set autoIncrement = true
                autoIncrement: true
            },
            nom: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true
            },
            description: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true
            },
            avantage1: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true
            },
            avantage2: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true
            },
            avantage3: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true
            },
            avantage4: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true
            },
            avantage5: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true
            },
            prix: {
                type: Sequelize.DataTypes.TEXT,
            },
        }, {

            /*By default Sequelize will add the attributes createdAt and updatedAt to your model so you will be able to know when the database entry went into the db and when it was updated last.
             /
            timestamps: true,

             /Sequelize allow setting underscored option for Model. When true this option will set the field option on all attributes to the underscored version of its name.
             * This also applies to foreign keys generated by associations.
             * */

            underscored: true
        }
    );
};