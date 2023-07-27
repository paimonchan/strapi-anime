const reserveLocker = async (strapi, key) => {
    /** @todo add locke model https://kondrahanov.medium.com/how-to-synchronize-strapi-cron-tasks-817f088c283b */
    const records = await strapi.entityService.findMany('api::param.param', {
        filters                : {key:key}
    })
    let locked = records.length > 0 ? parseInt(records[0].param || 0) : 0

    if (records.length > 0) {
        await strapi.entityService.update('api::param.param', records[0].id, {data:{param:"1"}})
    } else {
        await strapi.entityService.create('api::param.param', {data:{param:"1"}})
    }
    return !Boolean(locked)
}

const releaseLocker = async(strapi, key) => {
    const records = await strapi.entityService.findMany('api::param.param', {
        filters                 : {key:key}
    })
    await strapi.entityService.update('api::param.param', records[0].id, {data:{param:"0"}})
}
