import {Pool} from 'pg'

export {query}

//Ref: https://node-postgres.com/features/connecting#environment-variables
const pgPool = new Pool()

//Ref: https://node-postgres.com/guides/project-structure
async function query(sql: any) {
    const start = Date.now()
    const response = await pgPool.query(sql)
    const duration = Date.now() - start
    console.log('executed query', {sql: sql, duration: duration, rowCount: response.rowCount})
    return response
}
