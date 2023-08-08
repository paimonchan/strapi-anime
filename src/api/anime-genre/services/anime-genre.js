'use strict';

/**
 * anime-genre service
 */
const MODEL = 'api::anime-genre.anime-genre'
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::anime-genre.anime-genre', ({strapi}) => ({
    async getAll (transacting) {
        const records = await strapi.entityService.findMany(MODEL, {transacting})
        return records
    }
}));
