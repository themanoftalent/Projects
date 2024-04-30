const { MongoClient, ObjectId } = require('mongodb');
const { customAlphabet } = require('nanoid');




/*
* @class
* @alias module:Bar
* @param {connection} MongoClient
*/
let connection;
let retry = 2;
let maxRetry = 10;

module.exports.connector = async () => {
    if (retry < maxRetry) {
        try {
            retry++;
            let uri = 'mongodb://localhost:27017/admin';
            if(process.env.NODE_ENV === 'test') {
                uri = 'mongodb://localhost:27017/admin';
            }

            const mongoClient = new MongoClient(uri, {
                minPoolSize: 5,
                maxPoolSize: 10,
                connectTimeoutMS: 30 * 1000,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                retryWrites: true,
                retryReads: true
            });
            connection = await mongoClient.connect();
            console.log(Error('MongoDB -> Connected'), true);
            return connection;

        } catch (error) {
            console.log(error);
            retry++;
            this.connector();
        }
    } else {
        console.log(Error('MongoDB max try connect error!'));
    }
    connection = false;
};

module.exports.close = async () => {
    try {
        await connection.close();
    } catch (error) {
        console.log(error);
    }
};

/**
 * Object içinde ki bazı keyleri object id ye çevirir.
 * 
 * @param {Object} query 
 * @returns {Object}
 */
function toObjector(query) {
    try {
        // neler object id ye çevirilecek ?
        let keys = ['_id'];
        // array ise farklı şekilde handle ediyoruz.
        if (Array.isArray(query)) {
            for (let index = 0; index < query.length; index++) {
                for (let [key, value] of Object.entries(query[index])) {
                    if (keys.includes(key)) {
                        if (typeof value !== 'undefined' && value !== null) {
                            if (Array.isArray(value)) {
                                for (let index = 0; index < value.length; index++) {
                                    if (value[index] !== null) {
                                        query[index][key][index] = new ObjectId(value[index].toString());
                                    }
                                }
                            } else {
                                if (value !== null && typeof value !== 'object') {
                                    query[index][key] = new ObjectId(value.toString());
                                }
                            }
                        }
                    }
                }
            }
        } else {
            for (let [key, value] of Object.entries(query)) {
                if (keys.includes(key)) {
                    if (typeof value !== 'undefined' && value !== null) {
                        if (Array.isArray(value)) {
                            for (let index = 0; index < value.length; index++) {
                                if (value[index] !== null) {
                                    query[key][index] = new ObjectId(value[index].toString());
                                }
                            }
                        } else {
                            if (value !== null && typeof value !== 'object') {
                                query[key] = new ObjectId(value.toString());
                            }
                        }
                    }
                }
            }
        }
        return query;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * aggregate içinde sadece $match objesinin içinde kileri object id ye çevirir.
 * 
 * @param {Array} aggregate 
 * @returns {Array}
 */
function aggregateObjector(aggregate) {
    try {
        let newAgg = [];
        if (aggregate && Array.isArray(aggregate) && aggregate.length > 0) {
            for (let index = 0; index < aggregate.length; index++) {
                if (typeof aggregate[index]['$match'] !== 'undefined') {
                    if(!toObjector(aggregate[index]['$match'])) {
                        return false;
                    }
                    aggregate[index]['$match'] = toObjector(aggregate[index]['$match']);
                }
                newAgg.push(aggregate[index]);
            }
            return newAgg;
        }
    } catch (error) {
        console.log(error);
    }
    return aggregate;
}

/**
 * MongoDB CRUD Operation class
 */
class CRUD {
    /**
     * constructor for mongodb
     * 
     * @param {String} db 
     * @param {String} collection 
     */
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
        if (process.env.NODE_ENV === 'development') {
            this.db = 'dev_' + db;
        }else if (process.env.NODE_ENV === 'test') {
            this.db = 'dev_test_' + db;
        }
    }

    /**
     * 
     * Find operator for mongodb
     * 
     * @param {Object} query 
     * @param {Array} limit 
     * @param {Object} project 
     * @param {Object} sort 
     * @param {Object} options 
     * @returns {Promise<Array>}
     */
    async find(query = {}, limit = [0, 10], project = {}, sort = {}, collation = {}) {
        try {
            if (connection) {
                query = toObjector(query);
                if (query === false) {
                    return { objectIdError: true };
                }
                let result = await connection.db(this.db).collection(this.collection)
                    .find(query).sort(sort).collation(collation)
                    .skip(limit[0])
                    .limit(limit[1])
                    .project(project).toArray();
                return result;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Count data with query
     * 
     * @param {Object} query 
     * @returns 
     */
    async count(query = {}) {
        try {
            if (connection) {
                query = toObjector(query);
                if (query === false) {
                    return false;
                }
                let result = await connection.db(this.db).collection(this.collection)
                    .find(query).count();
                return result;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * mongodb insert operator for object
     * 
     * @param {Object} data 
     * @returns 
     */
    async insert(data) {   
        try {    
            if (connection) {
                data = toObjector(data);
                if (data === false) {
                    return { objectIdError: true };
                }
                let result = await connection.db(this.db).collection(this.collection)
                    .insertOne(data);
                if (result && result.insertedId) {
                    return [result.insertedId];
                }
                return false;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * mongodb insert operator for array
     * 
     * @param {Array} data 
     * @returns 
     */
    async insertMany(data, objector = true) {
        try {
            if (connection) {
                if (objector) {
                    data = toObjector(data);
                }
                if (data === false) {
                    return { objectIdError: true };
                }
                let result = await connection.db(this.db).collection(this.collection)
                    .insertMany(data);
                if (result && result.insertedCount && result.insertedCount > 0) {
                    return result.insertedIds;
                }
                return false;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * mongodb update operator for multiple or single
     * 
     * @param {Object} query 
     * @param {Object} update 
     * @param {Boolean} multiple 
     * @returns 
     */
    async update(query = null, update = null, multiple = false) {
        if (query === null || update === null) {
            return false;
        }
        try {
            if (connection) {
                query = toObjector(query);
                if (query === false) {
                    return { objectIdError: true };
                }
                if (typeof update['$set'] !== 'undefined') {
                    update['$set'] = toObjector(update['$set']);
                }
                let result;
                if (multiple) {
                    result = await connection.db(this.db).collection(this.collection).updateMany(query, update);
                } else {
                    result = await connection.db(this.db).collection(this.collection).updateOne(query, update);
                }
                if (result) {
                    return { modifiedCount: result.modifiedCount, matchedCount: result.matchedCount };
                }
                return false;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * mongodb delete operation for delete multiple document
     * 
     * @param {Object} query 
     * @returns 
     */
    async delete(query, objector = true) {
        try {
            if (connection) {
                if (objector) {
                    query = toObjector(query);
                }
                if (query === false) {
                    return { objectIdError: true };
                }
                let result = await connection.db(this.db).collection(this.collection)
                    .deleteMany(query);
                if (result) {
                    return { result: result.deletedCount };
                }
                return false;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    /**
     * mongodb aggregation pipelines
     * 
     * @param {Object} pipeline aggregation pipeline stages
     */
    async aggregate(pipeline) {
        try {
            if (connection) {
                pipeline = aggregateObjector(pipeline);
                if(!pipeline) {
                    return { objectIdError: true };
                }
                let result = await connection.db(this.db).collection(this.collection)
                    .aggregate(pipeline, { allowDiskUse: true }).toArray();
                if (result) {
                    return result;
                }
                return false;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}


module.exports.CRUD = CRUD;
module.exports.ObjectId = ObjectId;
module.exports.toObjector = toObjector;
module.exports.id= customAlphabet('01ABCDEFGHIJKLMNOPRSTUVYZ23456789', 18); //şifrelemede için 