/* eslint-disable camelcase */

const table = 'songs';

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(table, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable(table);
};
