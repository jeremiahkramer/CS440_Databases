
module.exports = (connection) => {
    let module = {}
    module.queryDB = (query, constraint) => {
        return new Promise((resolve, reject) => {
            connection.query(query + constraint, (err, results) => {
                if (err) {
                    reject(new Error("Failed Query"))
                }
                const jsonStr = JSON.stringify(results);
                if (jsonStr !== undefined) {
                    resolve(JSON.parse(jsonStr));
                } else {
                    resolve({});
                }
            });
        });
    }
    return module;
}
