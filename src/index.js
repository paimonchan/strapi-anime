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
        /** @ref https://tsmx.net/jest-process-exit/ unit test for mocking process.exit*/
        /** @ref https://nodejs.org/api/events.html#error-events */
        /** module node-schedule emit('error') and because no one listen to this, */
        /** by default the node.js process will be terminated */
        /** @hack so we listend to this event and do log stack error instead terminated the server. */
        const cronjobs = strapi.cron.jobs || []
        for (const cronjob of cronjobs) {
            const job = cronjob.job
            job.on('error', (err) => strapi.log.error(err))
        }

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
