/* code from functions/todos-read-all.js */
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: fnADhPCkZfACE83iqAPR2Q215kuLMUW3xVEHZBvC
})

exports.handler = (event, context, callback) => {
  console.log("Function `todo-read-all` invoked")
  return client.query(q.Paginate(q.Match(q.Ref("indexes/all_parts"))))
  .then((response) => {
    const Refs = response.data
    console.log("Todo refs", Refs)
    console.log(`${Refs.length} todos found`)
    // create new query out of todo refs. http://bit.ly/2LG3MLg
    const getAllDataQuery = Refs.map((ref) => {
      return q.Get(ref)
    })
    // then query the refs
    return client.query(getAllDataQuery).then((ret) => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(ret)
      })
    })
  }).catch((error) => {
    console.log("error", error)
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}