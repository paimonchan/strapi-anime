
const common = require('./cronjob')
const moment = require('moment')

const cron = common({
    active      : true,
    options     : {rule: "*/2 * * * * *"},

    task        : async ({strapi, transacting}) => {
        /** @todo move task to another folder and use module alias (jsconfig.json) */
        const page = 1
        const perPage = 20

        const dumpService = strapi.service('api::dump.dump')

        /** check if alrady pull */
        const resDate = moment().format('YYYY-MM-DD')
        const resId = `page${page}`

        const exist = await dumpService.checkExisting(transacting, resId, resDate)
        if (exist) {
            strapi.log.info('already pull recent')
            return
        }

        /** get list recent anime */
        const params = new URLSearchParams([
            ["page"          , String(page)],
            ["perPage"       , String(perPage)],
        ])
        const response = await fetch(`https://api.enime.moe/recent?${params}`, {method: 'GET'});
        const datas = (await response.json()).data || []
        if (datas.length == 0)
            return

        /** create recent anime */
        const dumpVals = {
            res_usage       :'enime-recent',
            res_id          : resId,
            res_date        : resDate,
            res_dump        : datas,
            to_delete       : false,
        }
        await strapi.entityService.create('api::dump.dump', {transacting, data:dumpVals})
        console.log(`push data ${resId}`)
    },
})
module.exports = cron