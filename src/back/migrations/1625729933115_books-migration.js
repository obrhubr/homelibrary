exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('books', {
        id: 'id',
        title: { type: 'varchar(1000)', notNull: true },
        time: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
        author: { type: 'varchar(1000)', notNull: true },
        description: { type: 'text', notNull: true },
        image: { type: 'text', notNull: false },
        filepath: { type: 'text', notNull: false },
        keywords: { type: 'text', notNull: false},
    });
    //pgm.createIndex('books', 'keywords');
};

exports.down = pgm => {};
