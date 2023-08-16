
const common = require('./cronjob')
const moment = require('moment')

const cron = common({
    active      : true,
    options     : {rule: "*/10 * * * * *"},

    task        : async ({strapi, transacting}) => {
        const limit = 10

        const dumpService = strapi.service('api::dump.dump')
        const animeService = strapi.service('api::anime.anime')
        const animeMapService = strapi.service('api::anime-map.anime-map')

        const animes = await animeService.getAnimeBySourceOrderByLastCheck(transacting, 'enime', limit)

        for (const anime of animes) {
            const enime = await animeMapService.getAnimeMapBySource('enime', anime.id)
            if (!enime)
                continue

            /** update last_cehck */            
            const today = moment().format('YYYY-MM-DD')
            await animeMapService.update(enime.id, {data: {last_check:today}})

            /** fetch data from 3rd party */
            const sourceId = enime.txt_map_id
            const response = await fetch(`https://api.enime.moe/anime/${sourceId}`, {method: 'GET'});
            const data = await response.json()

            /** prepare resId and resDate */
            const {updatedAt} = data
            const resDate = moment(updatedAt).format('YYYY-MM-DD')
            const resId = `${sourceId}`

            /** check if exist */
            const exist = await dumpService.checkExisting(transacting, resId, resDate)
            if (exist) {
                strapi.log.info('already pull anime detail')
                return
            }

            /** create recent anime */
            const dumpVals = {
                res_usage       :'enime-anime',
                res_id          : resId,
                res_date        : resDate,
                res_dump        : data,
                to_delete       : false,
            }
            await strapi.entityService.create('api::dump.dump', {transacting, data:dumpVals})
            strapi.log.info(`insert dump ${resId}`)
        }
    },
})
module.exports = cron