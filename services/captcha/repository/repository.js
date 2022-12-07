const config = require('../../../utils/initializer');
async function crerateQuestion(inputData) {
    await config.mongoDB.collection('questions').insertOne(inputData);
}
async function getQuestion() {
    return await config.mongoDB.collection('questions').aggregate().toArray();
}

module.exports = { crerateQuestion, getQuestion };