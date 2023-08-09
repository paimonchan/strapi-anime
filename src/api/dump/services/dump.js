'use strict';

/**
 * dump service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dump.dump', ({strapi}) => ({
    async checkExisting(transacting, resId, resDate) {
        const existing = await strapi.entityService.findMany('api::dump.dump', {
            transacting,
            limit           : 1,
            filters         : {
                res_id      : resId,
                res_date    : resDate,
            }
        })
        const exist = existing.length  > 0
        return exist
    }
}));
