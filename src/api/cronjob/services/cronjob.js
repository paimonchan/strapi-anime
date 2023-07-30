'use strict';

/**
 * cronjob service
 * @note transaction scope:  https://strapi.io/blog/using-database-transactions-to-write-queries-in-strapi
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cronjob.cronjob', ({strapi}) => ({
    async createCron(name, active) {
        const vals = {
            name            : name,
            active          : active
        }
        const res = await strapi.entityService.create('api::cronjob.cronjob', {data: vals})
        return res
    },

    async getCron(name) {
        const res = await strapi.entityService.findMany('api::cronjob.cronjob', {
            limit           : 1,
            filters         : {name: name}
        })
        if (res.length > 0)
            return res[0]
        return false
    },

    async processCron(name, job) {
        const knex = strapi.db.connection
        await knex.transaction(async (transacting) => {
            try {
                /** @todo do transaction nowait noupdate here */
                const response = await knex('cronjob')
                                .select('*')
                                .where({name: name})
                                .transacting(transacting)
                                .forUpdate()
                                .noWait()
                await job()
                return response
            } catch (e) {
                console.log(e)
            }
        })
    }
}));
