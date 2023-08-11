'use strict';

/**
 * anime controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::anime.anime', ({strapi}) => ({
    async delete(...args) {
        console.log('delete')
        // @ts-ignore
        return await super.delete(...args)
    },

    async deleteBulk(...args) {
        console.log('delete bulk')
        // @ts-ignore
        return await super.deleteBulk(...args)
    }
}));
