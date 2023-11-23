const exp = require("express")
const classfacultyApp = exp.Router()

const expressAsyncHandler = require("express-async-handler")

classfacultyApp.get("/classfaculty-data/:id", expressAsyncHandler(async (req, res) => {
    const classFacultyObj = req.app.get("classFacultyObj")
    const ids = req.params.id;
    const matchedfaculty = await classFacultyObj.findOne({ id: ids })
    res.json(matchedfaculty)
}))

classfacultyApp.get("/classtt-data/:keys/:mainkey", expressAsyncHandler(async (req, res) => {
    const classFacultyObj = req.app.get("classFacultyObj")
    let returnarray = []
    let fa = []
    let nfa = []
    const class_keys = req.params.keys.split(',');
    const mainkeys = req.params.mainkey;
    const mainkey=mainkeys.split('.')
    for (const key of class_keys) {
        let a = await classFacultyObj.findOne({ 'class_key': key });
        let obj = {};
        console.log(a)
        if (a) {
            if (a[mainkey[0]]) {
                if (a[mainkey[0]][mainkey[1]]) {
                    if (a[mainkey[0]][mainkey[[1]]][mainkey[2]]) {
                        returnarray.push({[key] : a[mainkey[0]][mainkey[[1]]][mainkey[2]]})
                        let dummy_array=mainkeys.split('.')
                        dummy_array.push(key)
                        fa.push(dummy_array)
                    }
                    else {
                        let dummy_array=mainkeys.split('.')
                        dummy_array.push(key)
                        nfa.push(dummy_array)
                    }
                }
                else {
                    let dummy_array=mainkeys.split('.')
                        dummy_array.push(key)
                        nfa.push(dummy_array)
                }
            }
            else {
                let dummy_array=mainkeys.split('.')
                        dummy_array.push(key)
                        nfa.push(dummy_array)
            }
        }
        else {
            let dummy_array=mainkeys.split('.')
                        dummy_array.push(key)
                        nfa.push(dummy_array)
        }
    }
    
    const responseObj = {
        returnarray: returnarray,
        fa: fa,
        nfa: nfa
    };
    res.json(responseObj)
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