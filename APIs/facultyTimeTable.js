/* eslint-disable no-undef */
const exp = require("express")
const facultytimetableApp = exp.Router()
let days = ['9-10', '10-11', '11-12', '12-1', '12.40-1.40', '1.40-2.40', '2.40-3.40', '3.40-4.40']
let keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const expressAsyncHandler = require("express-async-handler")
const { Code } = require("mongodb")

facultytimetableApp.get("/faculty-data/:type", expressAsyncHandler(async (req, res) => {
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj")
    console.log(facultyTimeTableObj)
    const type = req.params.type;
    console.log(type)
    const matchedfaculty = await facultyTimeTableObj.find({ facultytype: type }).toArray()
    console.log(matchedfaculty)
    res.json(matchedfaculty)
}))

// facultytimetableApp.get("/faculty-data-total", expressAsyncHandler(async (req, res) => {
//     const facultyTimeTableObj = req.app.get("facultyTimeTableObj")
//     console.log("hii")
//     const type = req.params.type;
//     console.log(type)
//     const matchedfaculty = await facultyTimeTableObj.find({ facultytype: type }).toArray()
//     console.log(matchedfaculty)
//     res.json(matchedfaculty)
// }))
facultytimetableApp.get(
  "/faculty-data-total",
  expressAsyncHandler(async (req, res) => {
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj");
    const doc = await facultyTimeTableObj.find({}).toArray(function (err, result) {
      if (err) throw err;
    });
    console.log(doc);
    res.json(doc);
  })
);

facultytimetableApp.get(
  "/classfaculty-data/:id",
  expressAsyncHandler(async (req, res) => {
    const facultyTimeTableObj= req.app.get("facultyTimeTableObj");
    const ids = req.params.id;
    console.log(ids);
    console.log("hii")
    const matchedfaculty = await facultyTimeTableObj.findOne({ username: ids })
    console.log(matchedfaculty);
    res.json(matchedfaculty);
  })
);

facultytimetableApp.post("/facultytt-insert", expressAsyncHandler(async (req, res) => {
    //get user collection object
    const classFacultyObj = req.app.get("classFacultyObj")
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj")
    const freeHoursObj = req.app.get("freeHoursObj")
    //get new user from request
    const newuser = req.body;
    const matchedclassfaculty = await classFacultyObj.findOne({ id: newuser.id })
    const headingNames1 = Object.values(req.body);
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 8; j++) {
            console.log(i, j)
            const a = (headingNames1[i][days[j]]);
            if (a) {
                aa = a.trim();
                if (aa.includes('lab')) {
                    x = aa.split(' ')
                    y = x[0].split('/')
                    arr = [y[0], y[1], y[0] + ' lab', y[1] + ' lab']
                    for (let z = 0; z < 4; z++) {
                        const facultydata1 = matchedclassfaculty[arr[z]]
                        if (facultydata1) {
                            let additionalobject = {};
                            additionalobject.roomno = facultydata1['room-no']
                            if (arr[z].includes('lab'))
                                additionalobject.subjectname = arr[z]
                            else
                                additionalobject.subjectname = arr[z] + ' lab'
                            additionalobject.class = newuser.id
                            additionalobject.classtype = 'LAB'
                            for (let k = 0; k < 3; k++) {
                                const result1 = await facultyTimeTableObj.findOne({ username: facultydata1.username });
                                const result2 = await freeHoursObj.findOne({ username: facultydata1.username });
                                console.log(result2);
                                const filter = { username: facultydata1.username };
                                const res1 = {
                                    $set: {
                                        [keys[i]]: Object.assign({}, result1[keys[i]], { [days[j + k]]: additionalobject })
                                    }
                                };
                                const res2 = { $push: { [keys[i]]: days[j + k] } };
                                console.log(res2)
                                await facultyTimeTableObj.updateOne(filter, res1);
                                const result = await freeHoursObj.updateOne(filter, res2);
                                console.log(result)
                            }
                        }
                    }
                }
                else {
                    const facultydata = matchedclassfaculty[a]
                    if (facultydata) {
                        let additionalobject = {};
                        additionalobject.roomno = facultydata['room-no']
                        additionalobject.subjectname = a
                        additionalobject.class = newuser.id
                        additionalobject.classtype = 'CLASS'
                        const result1 = await facultyTimeTableObj.findOne({ username: facultydata.username });
                        const result2 = await freeHoursObj.findOne({ username: facultydata.username });
                        console.log(result2);
                        const filter = { username: facultydata.username };
                        const res1 = {
                            $set: {
                                [keys[i]]: Object.assign({}, result1[keys[i]], { [days[j]]: additionalobject })
                            }
                        };
                        const res2 = {
                            $push: {
                                [keys[i]]: days[j]
                            }
                        };
                        console.log(res2)
                        await facultyTimeTableObj.updateOne(filter, res1);
                        const result = await freeHoursObj.updateOne(filter, res2);
                        console.log(result)
                    }
                }
            }
        }
    }
    res.status(201).send({ message: "User Created", payload: req.body })
}))

module.exports = facultytimetableApp;