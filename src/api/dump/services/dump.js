'use strict';

/**
 * dump service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dump.dump');
