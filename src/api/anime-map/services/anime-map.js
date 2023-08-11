'use strict';

/**
 * anime-map service
 */

const MODEL = 'api::anime-map.anime-map'
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::anime-map.anime-map', ({strapi}) => ({
    async getAnimeMapBySource (source, animeId) {
        const records = await strapi.entityService.findMany(MODEL, {
            limit           : 1,
            filters         : {
                source      : source,
                anime       : {
                    id      : animeId
                }
            }
        })

        return records.length > 0 ? records[0] : false
    }
}));