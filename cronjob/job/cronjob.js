const doNothing = async () => {
    // this function is called when cron is set to deactive
}
const common = (cron) => {
    const wrapTask = async ({strapi}) => {
        const job = async() => {
            const knex = strapi.db
            await knex.transaction( async ({transacting}) => {
                strapi.log.info(`[${cron.name}] start cron`)
                await cron.task({strapi, transacting})
                strapi.log.info(`[${cron.name}] end cron`)
            })
        }
        const cronService = strapi.service('api::cronjob.cronjob')
        /** @note cron.name will be assign in src/index.js */
        await cronService.processCron(cron.name, job)
    }
    const cronTask = {
        /** carry property */
        cron        : cron,
        active      : cron.active,
        /** node-schedule property */
        options     : cron.options,
        task        : cron.active ? wrapTask : doNothing
    }

    return cronTask
}
module.exports = common