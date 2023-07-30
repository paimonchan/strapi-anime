'use strict';

/**
 * cronjob controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cronjob.cronjob');
