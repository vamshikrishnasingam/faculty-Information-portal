/* eslint-disable no-undef */
const { type } = require("@testing-library/user-event/dist/type");
const exp = require("express")
const classtimetableApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")

const times = { "9-10": 0, "10-11": 2, "11-12": 3, "12-1": 4, "12.40-1.40": 5, "1.40-2.40": 6, "2.40-3.40": 7, "3.40-4.40": 8 };
classtimetableApp.get('/classtt-data/:classid/:year/:graduation/:sem', async (req, res) => {
    const id = req.params.classid;
    const year = req.params.year
    const gr = req.params.graduation
    const sem = req.params.sem
    const classTimeTableObj = req.app.get("classTimeTableObj")
    let matchedclass = await classTimeTableObj.findOne({ [`${id}.${year}.${gr}.${sem}`]: { $exists: true } })
    res.json(matchedclass)
})

const freehrs = async (year, day, time, dat, freeHoursObj) => {
    const week = { 'M': 'mon', 'T': 'tue', 'W': 'wed', 'Th': 'thu', 'F': 'fri', 'S': 'sat' }
   // console.log("FAC : ",dat);
    ids = dat.username.split('/')
    names = dat.name.split('/')
    ids.forEach(async (ele, index) => {
        sn = names[index]
        if (sn) {
            sn.trim()
            if (sn.includes('(')) {
                fi = sn.indexOf('(')
                li = sn.indexOf(')')
                let l = sn.slice(fi + 1, li)
                if (week[l] !== day)
                    return;
            }
        }
        const timingsKey = `${day.trim()}.${time.replace(/\./g, '_').trim()}`;
        const updateObj = {};
        updateObj[timingsKey] = year;
        const res1 = {
            $set: updateObj
        };
        const a = await freeHoursObj.updateOne({ username: ele.trim() }, res1)
    })
}
const fun = async (year, day, timings, fac, facttobj,sem) => {
    const week = { 'M': 'mon', 'T': 'tue', 'W': 'wed', 'Th': 'thu', 'F': 'fri', 'S': 'sat' }
   // console.log("fun : ",fac)
    ids = fac.username.split('/')
    names = fac.name.split('/')
    i = 0
    let faccopy = {};
    //console.log("fun : ",fac)
    //console.log(typeof(fac['roomno']))
    faccopy['classtype'] = fac['classtype']
    faccopy['subject'] = fac['subject']
    faccopy['class']=fac['class']
    faccopy['roomno'] = fac['roomno']
    faccopy['subject'].trim()
    faccopy['classtype'].trim()
    ids.forEach(async (ele, index) => {
        sn = names[index]
        if (sn) {
            if (sn.includes('(')) {
                fi = sn.indexOf('(')
                li = sn.indexOf(')')
                let l = sn.slice(fi + 1, li)
                if (week[l] !== day)
                    return;
            }
        }
        const timingsKey = `${sem.trim()}.${day.trim()}.${timings.replace(/\./g, '_').trim()}`;
        const updateObj = {};
        updateObj[`${year}.${timingsKey}`] = faccopy;         
        const res1 = {
            $set: updateObj
        };
        const a = await facttobj.updateOne({ username: ele.trim() }, res1);
    })
}
classtimetableApp.post("/class-insert", expressAsyncHandler(async (req, res) => {
    const newUser = req.body
   // console.log(newUser)
    const classTimeTableObj = req.app.get("classTimeTableObj")
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj")
    const freeHoursObj = req.app.get("freeHoursObj")
    newUser.forEach(async (item, index) => {
        const sheetname = item.sheetname.trim();
        const sheetData = item.data;
        const semdetails = sheetData[0]
        const classinfo = sheetData[1]
        const facultyinfo = sheetData[2]
        const classarray = {}
        const p = []
       // console.log(sheetData)
        semdetails.forEach(element => {
            const x = element[0].split(':');
            x[0] = x[0].trim()
            x[1] = x[1].trim()
            p.push(x)
        })
        const sem=p[0][1].split('-')[1]
        const facultydata = {};
        for (let j = 1; j < facultyinfo.length; j++) {
            const f = {}
            for (let i = 1; i < 4; i++) {
                f[facultyinfo[0][i]] = facultyinfo[j][i]
            }
            facultydata[facultyinfo[j][0]] = f
        }
        const classdata = {};
        for (let i = 1; i < 7; i++) {
            const day = classinfo[i][0].trim();
            const obj = {};
            for (let j = 1; j < 7; j++) {
                const timings = classinfo[0][j].trim();
                if (classinfo[i][j] === -1)
                    classinfo[i][j] = classinfo[i][j - 1]
                const sub = classinfo[i][j].trim()
                //if sub is lab
                if (sub.includes('LAB')) {
                    const x = sub.split('/')
                    x[0] = x[0].trim()
                    if (!x[0].includes('LAB'))
                        x[0] = x[0] + ' LAB'
                    //if sub is 2 labs
                    if (x.length > 1) {
                        x[1] = x[1].trim()
                        if (!x[1].includes('LAB'))
                            x[1] = x[1] + ' LAB'
                        const arr = [x[1], x[0]]
                        const insertobj = { 'subject': sub }
                        let i = 0;
                        arr.forEach(ele => {
                            const d = facultydata[ele]
                            if (d) {
                                const insertobj1 = d
                                insertobj['lab' + String.fromCharCode(65+i)] = insertobj1
                                insertobj1['subject'] = ele
                                const fac = insertobj1
                                fac['class']=sheetname
                                fac['classtype'] = 'Lab'
                                freehrs(sheetname[0], day, timings, fac, freeHoursObj)
                                fun(p[2][1], day, timings, fac, facultyTimeTableObj,sem)
                                i += 1;
                            }
                        })
                        obj[timings] = insertobj
                    }
                    //if it is a single lab
                    else {
                        const d = facultydata[x[0]]
                        const insertobj = d
                        insertobj['subject'] = x[0]
                        const fac = insertobj
                        fac['classtype'] = 'Lab'
                        fac['class']=sheetname
                        freehrs(sheetname[0], day, timings, fac, freeHoursObj)
                        fun(p[2][1], day, timings, fac, facultyTimeTableObj,sem)
                        obj[timings] = insertobj

                    }
                }
                //if sub is not lab
                else {
                    const d = facultydata[sub]
                    if (d) {
                        const insertobj = d
                        insertobj['subject'] = sub
                        const fac = insertobj
                        fac['classtype'] = 'Class'
                        fac['class']=sheetname
                        obj[timings] = insertobj
                        freehrs(sheetname[0], day, timings, fac, freeHoursObj)
                        fun(p[2][1], day, timings, fac, facultyTimeTableObj,sem)
                    }
                    else {
                        const insertobj = {}
                        insertobj['subject'] = sub
                        obj[timings] = insertobj

                    }
                }
            }
            classdata[day] = obj;
        }
        const key3 = {}
        key3[p[0][1]] = classdata
        const key2 = {}
        key2[p[1][1]] = key3
        classarray[p[2][1]] = key2;
        const classtimetable = {};
        classtimetable[sheetname] = classarray;
        const query = { [sheetname]: { $exists: true } };
        let existk1 = await classTimeTableObj.findOne(query);
        if (existk1) {
            const idofata = Object.keys(existk1)[0];
            const id = existk1[idofata];
            const updateObj = {
                $set: {
                    [`${sheetname}.${p[2][1]}.${p[1][1]}.${p[0][1]}`]: classdata,
                },
            };
            let a = await classTimeTableObj.updateOne({ _id: id }, updateObj);

        }
        else {
            let a =await classTimeTableObj.insertOne(classtimetable);
        }
    });
    res.status(201).send({ message: "User Created", payload: req.body })
}))

module.exports = classtimetableApp;