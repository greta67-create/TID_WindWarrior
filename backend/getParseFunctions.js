// Use this function to get data from Parse Server
// pass a query as an argument i.e for Spots let query = new Parse.Query('Spot');
export const getList = async (query) => {
    query.include();
    let queryResult = await query.find();
    let jsonObject = queryResult.map(obj => { return obj.toJSON() })   // Available
    console.log(jsonObject);
    return jsonObject;
}

export const getByID = async (query, id) => {
    query.include();
        let queryResult = await query.find(id);
        let jsonObject = queryResult.toJSON() // Available
    console.log(jsonObject);
    return jsonObject;
}
