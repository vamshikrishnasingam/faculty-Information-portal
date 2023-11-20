const exp = require("express")
const classfacultyApp = exp.Router()

const expressAsyncHandler = require("express-async-handler")

classfacultyApp.get("/classfaculty-data/:id", expressAsyncHandler(async (req, res) => {
    const classFacultyObj = req.app.get("classFacultyObj")
    const ids = req.params.id;
    const matchedfaculty = await classFacultyObj.findOne({ id: ids })
    res.json(matchedfaculty)
}))

classfacultyApp.post("/cf-insert", expressAsyncHandler(async (req, res) => {
    //get user collection object
    const classFacultyObj = req.app.get("classFacultyObj")
    //get new user from request
    const newUser = req.body
    await classFacultyObj.deleteOne({ id: newUser.id })
    await classFacultyObj.insertOne(newUser)
    res.status(200).send({ message: "User Created", payload: req.body })
}))

classfacultyApp.post("/classtt-insert", expressAsyncHandler(async (req, res) => {
    // Get user collection object
    const classFacultyObj = req.app.get("classFacultyObj");

    // Get new user from request
    const newUser = req.body;
    const acadinfo = newUser['dt1'];
    const classinfo = newUser['dt2'];
    let classs = classinfo[0][0];
    let s = acadinfo[0][0].split('-');
    const sem = s[2];
    let p = acadinfo[1][0].split(':');
    const prog = p[1].trim();
    let year = acadinfo[2][0].split(':');
    const yr = year[1].trim();
    let key = `${yr}.${prog}.${sem}`;
    const classkey = `${classs}`;

    try {
        const query = { class_key: classkey };
        let existk1 = await classFacultyObj.findOne(query);

        if (!existk1) {
            const nd = { class_key: classkey }
            await classFacultyObj.insertOne(nd);
            existk1 = await classFacultyObj.findOne(query);
        }
        const idofdata = Object.keys(existk1)[0];
        const id = existk1[idofdata];
        const updateObj = {
            $set: {
                [key]: classinfo,
            },
        };
        await classFacultyObj.updateOne({ _id: id }, updateObj);
    } catch (error) {
        console.error("Error:", error);
    }

    res.status(200).send({ message: "User Created", payload: req.body });
}));



module.exports = classfacultyApp;