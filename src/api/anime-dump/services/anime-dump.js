'use strict';

/**
 * anime-dump service
 */
const MODEL = 'api::anime-dump.anime-dump'
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::anime-dump.anime-dump', ({strapi}) => ({
    async getNonDelete(transacting, limit = 100) {
        const records = await strapi.entityService.findMany(MODEL, {
            transacting,
            limit           : limit,
            sort            : {id: 'asc'},
            filters         : {
                $or             : [
                    {to_delete  : {$null: true}},
                    {to_delete  : false},
                ]
            }
        })
        return records
    },
}));
