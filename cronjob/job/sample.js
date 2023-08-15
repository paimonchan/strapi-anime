const common = require('./cronjob')

const cron = common({
    active      : false,
    options     : {rule: "*/2 * * * * *"},
    task        : async ({strapi}) => {
        function sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
          }
        await sleep(5000)
        console.log('test')

        // const knex = strapi.db
        // await knex.transaction(async ({transacting}) => {
        //     try {
        //         const paramService = strapi.service('api::param.param')
        //         const res = await paramService.create({data: {key: 'test', param: 'test'}, transacting})
        //         // console.log(res)
        //         // throw 'error'
        //         throw new Error('error')
        //     } catch (e) {
        //         throw e
        //     }
        // })

        const animeDumpService = strapi.service('api::anime-dump.anime-dump')
        const animeDumps = await animeDumpService.getNonDelete(false, 100000000000)

        const format = {}
        for (const dump of animeDumps) {
            const {res_dump} = dump
            format[res_dump.format] = res_dump.format
        }

        console.log(format)
    }
})
module.exports = cron