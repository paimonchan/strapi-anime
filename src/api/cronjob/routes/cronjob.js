'use strict';

/**
 * cronjob router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::cronjob.cronjob');
