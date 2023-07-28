'use strict';

/**
 * anime-dump service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::anime-dump.anime-dump');
