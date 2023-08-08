'use strict';

/**
 * anime service
 */
const MODEL = 'api::anime.anime'
const MODEL_ANIME_MAP = 'api::anime-map.anime-map'
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::anime.anime', ({strapi}) => ({
    async getAnimeBySourceId (transacting, sourceId, source) {
        const records = await strapi.entityService.findMany(MODEL, {
            transacting,
            limit               : 1,
            filters             : {
                anime_maps      : {
                    source      : source,
                    txt_map_id  : sourceId,
                }
            }
        })
        return records.length > 0 ? records[0] : false
    },

    async getAnimeBySourceOrderByLastCheck (transacting, source, limit=10) {
        /** @ref https://github.com/knex/knex/pull/4720/files */
        /** add this PR to order record by null first/last */

        /** TODO: filter by exclude completed anime */
        const params = (isnull) => {
            return {
                transacting,
                limit               : limit,
                filters             : {
                    anime_maps      : {
                        source      : source,
                        last_check  : {$null: isnull}
                    }
                },
                orderBy             : {
                    anime_maps      : {
                        last_check  : 'ASC',
                        name        : 'ASC'
                    }
                }
            }
        }

        /** check for null first last_check field, if exist return it */
        let records = await strapi.entityService.findMany(MODEL, params(true))
        if (records.length > 0) {
            return records
        }

        /** return for not null last_check */
        records = await strapi.entityService.findMany(MODEL, params(false))
        return records
    },

    async getAll (transacting) {
        const records = await strapi.entityService.findMany(MODEL, {transacting})
        return records
    },
}));
