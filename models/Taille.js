module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // name of table
        "Taille", {
            // field name
            id: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey = true
                primaryKey: true,
                // set autoIncrement = true
                autoIncrement: true
            },
            taille: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true
            },

        }, {

            /*  By default, Sequelize will add the attributes createdAt and updatedAt to your model so you will be able to know when the database entry went into the db and when it was updated last.
             */
            timestamps: true,
            /*
             * Sequelize allow setting underscored option for Model. When true this option will set the field option on all attributes to the underscored version of its name.
             * This also applies to foreign keys generated by associations.
             * */

            underscored: true
        }
    );
};