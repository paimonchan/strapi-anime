'use strict';

/**
 * dump controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::dump.dump');
