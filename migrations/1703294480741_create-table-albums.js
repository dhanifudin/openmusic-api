/* eslint-disable camelcase */

const table = 'albums';

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable(table, {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable(table);
};
