'use strict';

/** strapi life cycle: https://docs.strapi.io/dev-docs/configurations/functions */
module.exports = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register(/*{ strapi }*/) {},

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({strapi}) {
        console.log(strapi.cron)
        const cronjobService = strapi.service('api::cronjob.cronjob')
        const cronsConfig = require('../cronjob')
        for (const name in cronsConfig) {
            const cronConfig = cronsConfig[name]
            cronConfig.cron.name = name

            const {active} = cronConfig
            const cron = await cronjobService.getCron(name)
            if (!cron) {
                await cronjobService.createCron(name, active)
            } else {
                await cronjobService.writeCron(cron, name, active)
            }
        }
    },
};
