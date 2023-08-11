'use strict';

/** strapi life cycle: https://docs.strapi.io/dev-docs/configurations/functions */
module.exports = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    async register({ strapi }) {
        
    },

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
            /** @note inject name to cronConfig */
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

    async destroy({strapi}) {
        // FIXME: this is temporary to fix bug from strapi core.
        //        bug location: (@strapi\strapi\lib\Strapi.js function async destroy()).
        //        where in strapi core db destroyed first before cronjob.
        //        it will raise error when the cron used transaction from low level knex (like strapi.db.transaction).
        //        the cause for this error because db already destroyed, but another process still using the db pool (pendingOperation).
        strapi.cron.destroy()
    }
};
