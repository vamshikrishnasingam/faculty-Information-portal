const exp = require("express")
const classfacultyApp = exp.Router()

const expressAsyncHandler = require("express-async-handler")

classfacultyApp.get("/classfaculty-data/:id", expressAsyncHandler(async (req, res) => {
    const classFacultyObj = req.app.get("classFacultyObj")
    const ids = req.params.id;
    const matchedfaculty = await classFacultyObj.findOne({ id: ids })
    res.json(matchedfaculty)
}))

classfacultyApp.get("/delete_data/:academicyear/:graduation/:semester", expressAsyncHandler(async (req, res) => {
    const acad = req.params.academicyear;
    const grad = req.params.graduation;
    const sem = req.params.semester;
    const classTimeTableObj = req.app.get("classTimeTableObj")
    classtt = await classTimeTableObj.find({}).toArray()
    for (const element of classtt) {
        key = Object.keys(element)[1];
        yearkey = key[0];
        semkey = `${yearkey}-${sem}`;
        const query = {};
        query[`${key}.${acad}.${grad}.${semkey}`] = { $exists: true };
        const update = { $unset: { [`${key}.${acad}.${grad}.${semkey}`]: 1 } };
        // Use query instead of filter
        const result = await classTimeTableObj.updateOne(query, update);
    }
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj");
    factt = await facultyTimeTableObj.find({}).toArray();
    for (const element of factt) {
        const key = element._id; 
        const query = { _id: key };
        const update = { $unset: { [`${acad}.${sem}`]: 1 } };
        const result = await facultyTimeTableObj.updateOne(query, update);
        console.log(result);
    }
    const freeHoursObj = req.app.get("freeHoursObj");
    freehrs = await freeHoursObj.find({}).toArray();
    console.log(freehrs)
    for (const element of freehrs) {
        const key = element._id;  // Assuming _id is a valid ObjectId
        const p = await freeHoursObj.deleteOne(
            { _id: key }
        );
        console.log(p)
    }

}))
function nestedPropertyExists(obj, keys) {
    return keys.reduce((acc, curr) => acc && acc[curr], obj) !== undefined;
}
function getNestedValue(obj, keys) {
    return keys.reduce((acc, curr) => acc && acc[curr], obj);
}
classfacultyApp.get("/classtt-data/:keys/:mainkey", expressAsyncHandler(async (req, res) => {
    const classFacultyObj = req.app.get("classFacultyObj");
    const fa = [];
    const nfa = [];
    const class_keys = req.params.keys.split(',');
    const mainkeys = req.params.mainkey.split('.');
    const returnarray = await Promise.all(class_keys.map(async (key) => {
        const a = await classFacultyObj.findOne({ 'class_key': key });
        const dummy_array = mainkeys.slice();
        dummy_array.push(key);
        if (a && nestedPropertyExists(a, mainkeys)) {
            const nestedValue = getNestedValue(a, mainkeys);
            fa.push(dummy_array);
            return { [key]: nestedValue };
        } else {
            nfa.push(dummy_array);
            return null;
        }
    }));
    const responseObj = {
        returnarray: returnarray.filter(Boolean), // Filter out null values
        fa: fa,
        nfa: nfa
    };
    res.json(responseObj);
}));



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
    const classs = classinfo[0][0];
    const [_, __, sem] = acadinfo[0][0].split('-');
    const prog = acadinfo[1][0].split(':')[1].trim();
    const yr = acadinfo[2][0].split(':')[1].trim();
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
        const { _id } = existk1;
        const updateObj = {
            $set: {
                [key]: classinfo,
            },
        };
        await classFacultyObj.updateOne({ _id }, updateObj);
    } catch (error) {
    }

    res.status(200).send({ message: "User Created", payload: req.body });
}));



module.exports = classfacultyApp;