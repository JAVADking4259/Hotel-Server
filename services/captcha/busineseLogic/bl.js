const repository = require('../repository/repository');


async function createQuestion(inputData) {
    await repository.crerateQuestion(inputData);
    delete inputData._id;
    return {
        message: 'اطلاعات شما با موفقیت ثبت شد',
        result: inputData
    }
}
async function getQuestion() {
    const result = await repository.getQuestion();
    const Result = {
        question: result[0].question,
        id: result[0].id
    }
    return {
        message: 'success',
        result: Result
    }
}

module.exports = { createQuestion, getQuestion };