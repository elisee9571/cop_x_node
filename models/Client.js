module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Client", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            image: {
                type: Sequelize.DataTypes.STRING(250),
                allowNull: true
            },
            nom: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: true
            },
            date: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true
            },
            email: {
                type: Sequelize.DataTypes.STRING(150),
                allowNull: false,
                /*obliger de remplir*/
                unique: true
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            sexe: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
                /* n'est pas obliger de remplir */
            },
            pointure: {
                type: Sequelize.DataTypes.INTEGER(2),
                allowNull: true,
                /* n'est pas obliger de remplir */
            },
            information_paiement: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
                /* n'est pas obliger de remplir */
            },
            livraison: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
                /* n'est pas obliger de remplir */
            },
            adresse: {
                type: Sequelize.DataTypes.STRING(150),
                allowNull: true
            },

            ville: {
                type: Sequelize.DataTypes.STRING(150),
                allowNull: true
            },
            cp: {
                type: Sequelize.DataTypes.INTEGER(5),
                allowNull: true
            },
            pays: {
                type: Sequelize.DataTypes.STRING(60),
                allowNull: true
            },
            tel: {
                type: Sequelize.DataTypes.STRING(10),
                allowNull: true
            },
            status: {
                //set data type with max length
                type: Sequelize.DataTypes.BOOLEAN,
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true
            },
            forget: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(60),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true
            },
        }, {
            timestamps: true,
            underscored: true
        }
    );
};