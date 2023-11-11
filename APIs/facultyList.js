/* eslint-disable no-undef */
const exp = require("express")
const userApp = exp.Router()

const expressAsyncHandler = require("express-async-handler")

userApp.post("/facultylist-insert", expressAsyncHandler(async (req, res) => {
    //get user collection object
    const newUser = req.body
    const facultyListObj = req.app.get("facultyListObj")
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj")
    const freeHoursObj = req.app.get("freeHoursObj")
    //get new user from request
    await facultyListObj.deleteOne({ username: newUser.username })
    await facultyListObj.insertOne(newUser)
    await facultyTimeTableObj.deleteOne({ username: newUser.username })
    await facultyTimeTableObj.insertOne(newUser)
    await freeHoursObj.deleteOne({ username: newUser.username })
    await freeHoursObj.insertOne(newUser)
    res.status(201).send({ message: "User Created", payload: req.body })
}))

userApp.get("/faculty-data/:id", expressAsyncHandler(async (req, res) => {
    //get user collection object
    const newUser = req.params.id;
    console.log(newUser)
    const facultyListObj = req.app.get("facultyListObj")
    const obj1 = await facultyListObj.findOne({ username: newUser })
    //get new user from request   
    res.json(obj1)
}))

userApp.post("/facultycheck", expressAsyncHandler(async (req, res) => {
    //get user collection object
    const receivedData = req.body;
    //excel sheet
    receivedData.forEach((item, index) => {
        const sheetname = item.sheetname;
        const sheetData = item.data;
        console.log(`Sheet Name: ${sheetname}`);
        semdetails = sheetData[0]
        classinfo = sheetData[1]
        facultyinfo = sheetData[2]
        classarray = {}
        const p = []
        semdetails.forEach(element => {
            const x = element[0].split(':');
            x[0] = x[0].trim()
            x[1] = x[1].trim()
            p.push(x)
        })
        facultydata = {};
        for (j = 1; j < facultyinfo.length; j++) {
            const f = {}
            for (i = 1; i < 4; i++) {
                f[facultyinfo[0][i]] = facultyinfo[j][i]
            }
            if (facultyinfo[j][0].indexOf('lab') === -1)
                facultyinfo[j][0] = facultyinfo[j][0].replace(/\s/g, '')
            facultydata[facultyinfo[j][0]] = f
        }
        classdata = {};
        for (i = 1; i < 7; i++) {
            const day = classinfo[i][0];
            const obj = {};
            for (j = 1; j < 7; j++) {
                const timings = classinfo[0][j];
                if (classinfo[i][j] === -1)
                    classinfo[i][j] = classinfo[i][j - 1]
                const sub = classinfo[i][j].trim()
                if (sub.includes('lab')) {
                    x = sub.split('/')
                    x[0].trim()
                    if (x.length > 1) {
                        x[1].trim()
                        y = x[0].trim() + ' lab'
                        arr = [y, x[1].trim()]
                        a = []
                        arr.forEach(ele => {
                            const d = facultydata[ele]
                            const insertobj = d
                            insertobj['subject'] = ele
                            a.push(insertobj)

                        })
                        obj[timings] = a
                    }
                    else {
                        const d = facultydata[x[0]]
                        const insertobj = d
                        insertobj['subject'] = x[0]
                        obj[timings] = insertobj

                    }
                }
                else {
                    const d = facultydata[sub.replace(/\s/g, '')]
                    if (d) {
                        const insertobj = d
                        insertobj['subject'] = sub
                        obj[timings] = insertobj
                    }
                    else {
                        const insertobj={}
                        insertobj['subject']=sub
                        obj[timings] = insertobj

                    }
                }
            }
            classdata[day] = obj;
        }
        const a1={}
        a1[p[0][1]]=classdata
        const b1={}
        b1[p[1][1]]=a1
        classarray[p[2][1]] = b1;
        console.log(classarray)
    });
    res.json(receivedData);

}))

module.exports = userApp;