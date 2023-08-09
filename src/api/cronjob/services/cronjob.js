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

    async writeCron(cron, name, active) {
        const vals = {
            name            : name,
            active          : active
        }
        const res = await strapi.entityService.update('api::cronjob.cronjob', cron.id, {data: vals})
        return res
    },

    async processCron(name, job) {
        /** this technic not used auto commit and rollback */
        const knex = strapi.db.connection
        await knex.transaction(async (transacting) => {
            try {
                // @ts-ignore
                const response = await knex('cronjobs')
                                .select('*')
                                .where({name: name})
                                .transacting(transacting)
                                .forUpdate()
                                .noWait()
                                .first()
                /** 
                 * @note no need to create one if not exist.
                 * because if user intended delete cronjob record,
                 * that mean the cron shouldn't be running.
                 */
                if (!response || !response.active) {
                    return
                }
                
                await job()
                return response
            } catch (e) {
                if (e.code == '55P03') {
                    strapi.log.info(`[${name}] Another cronjob is already busy running`)
                } else {
                    throw e
                }
            }
        })
    }
}));
