const bl = require('../businessLogic/bl');
const uuid = require('uuid');
const { registerSchema, loginSchema } = require('../../../utils/schema');
const { validate } = require('../../../utils/validator');
const bcrypt = require('bcryptjs');
const moment = require('moment-jalaali');
const repository = require('../../../utils/initializer');
const { checkAccess } = require('../../../utils/accessControl');
const { sendEmail } = require('../../../utils/mailer');

async function register(req, res) {
    try {
        const { body } = req;
        await validate(body, registerSchema);
        const inputData = {
            id: uuid.v4(),
            fullName: body.fullName,
            email: body.email,
            password: body.password,
            avatar: 'http://localhost:5000/uploads',
            createdAt: moment().format('jYYYY/jMM/jDD -- HH:mm:ss'),
            age: body.age,
            role: 'USER'
        };

        const result = await bl.register(inputData);
        // send email
        sendEmail(body.email, body.fullName, 'welcome', 'hello baby welcome to my site')
        res.send(result);
    } catch (err) {
        console.log(err)
        err.status = err.status || 500;
        res.status(err.status).send({
            error: err.error || { message: 'مشکلی برای سرور رخ داده است لطفا پیگیری نمایید' },
        })
    }

}

async function login(req, res) {
    try {
        const inputData = {
            email: req.body.email,
            password: req.body.password,
            answer: req.body.answer
        }
        await validate(inputData, loginSchema)
        const captcha = await repository.mongoDB.collection('questions').findOne({ answer: inputData.answer })
        if (!captcha) {
            throw {
                status: 403,
                data: { message: "جواب سوال اشتیاه است" }
            }
        }
        let result = await bl.login(inputData);
        res.status(200).send(result);
    } catch (err) {
        const status = err.status || 400;
        res.status(status).send({
            status: "fail",
            data: err.data
        });
    }
};

module.exports = { login, register };