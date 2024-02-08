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

classtimetableApp.get('/academicyearkeys', async (req, res) => {
    const classTimeTableObj = req.app.get("classTimeTableObj")
    key = '4cse1'
    let matchedclass = await classTimeTableObj.findOne({ [key]: { $exists: true } })
    try {
        keys = Object.keys(matchedclass[key])
    console.log(keys)
    res.json(keys)
    } catch (error) {
        console.log('wait')   
    }
    
})

const freehrs = async (year, day, time, dat, freeHoursObj) => {
    const week = { 'M': 'mon', 'T': 'tue', 'W': 'wed', 'Th': 'thu', 'F': 'fri', 'S': 'sat' };
    const ids = dat.username.split('/');
    const names = dat.name.split('/');

    await Promise.all(ids.map(async (ele, index) => {
        const sn = names[index];
        if (sn && sn.includes('(')) {
            const fi = sn.indexOf('(');
            const li = sn.indexOf(')');
            const l = sn.slice(fi + 1, li);
            if (week[l.toUpperCase()] !== day) {
                return;
            }
        }

        const timingsKey = `${day.trim()}.${time.replace(/\./g, '_').trim()}`;
        const existingData = await freeHoursObj.findOne({ username: ele.trim() });

        if (existingData) {
            const updateObj = {
                $addToSet: { [timingsKey]: year }
            };
            await freeHoursObj.updateOne({ username: ele.trim() }, updateObj);
        }
    }));
};

const fun = async (year, day, timings, fac, facttobj, sem) => {
    const week = { 'M': 'mon', 'T': 'tue', 'W': 'wed', 'Th': 'thu', 'F': 'fri', 'S': 'sat' };
    console.log(fac)
    const ids = fac.username.split('/');
    const names = fac.name.split('/');

    let faccopy = {
        classtype: fac.classtype.trim(),
        subject: fac.subject.trim(),
        class: fac.class,
        roomno: fac.roomno
    };

    for (const [index, ele] of ids.entries()) {
        const sn = names[index];
        if (sn && sn.includes('(')) {
            const fi = sn.indexOf('(');
            const li = sn.indexOf(')');
            const l = sn.slice(fi + 1, li);
            if (week[l.toUpperCase()] !== day) return;
        }

        const timingsKey = `${sem.trim()}.${day.trim()}.${timings.replace(/\./g, '_').trim()}`;
        const d = await facttobj.findOne({ username: ele.trim() });

        if (d?.[year]?.[sem.trim()]?.[day.trim()]?.[timings.replace(/\./g, '_').trim()]) {
            const existingSubject = d[year][sem.trim()][day.trim()][timings.replace(/\./g, '_').trim()]['subject'].toLowerCase().trim();
            const facSubject = fac.subject.toLowerCase().trim();

            if (!existingSubject.includes(facSubject)) {
                faccopy.subject = `${existingSubject}/${facSubject}`;
                faccopy.classtype = `${d[year][sem.trim()][day.trim()][timings.replace(/\./g, '_').trim()]['classtype'].trim()}/${fac.classtype.trim()}`;
                faccopy.class = `${d[year][sem.trim()][day.trim()][timings.replace(/\./g, '_').trim()]['class'].trim()}/${fac.class.trim()}`;
                faccopy.roomno = `${d[year][sem.trim()][day.trim()][timings.replace(/\./g, '_').trim()]['roomno'].trim()}/${fac.roomno.trim()}`;
            }
        }

        const updateObj = { $set: { [`${year}.${timingsKey}`]: faccopy } };
        await facttobj.updateOne({ username: ele.trim() }, updateObj);
    }
};

classtimetableApp.post("/class-insert", expressAsyncHandler(async (req, res) => {
    const newUser = req.body
    const classTimeTableObj = req.app.get("classTimeTableObj")
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj")
    const freeHoursObj = req.app.get("freeHoursObj")
    try {
        for (const item of newUser) {
            const sheetname = item.sheetname.trim();
            const sheetData = item.data;
            const semdetails = sheetData[0]
            const classinfo = sheetData[1]
            const facultyinfo = sheetData[2]
            const classarray = {}
            const p = []
            semdetails.forEach(element => {
                const x = element[0].split(':');
                x[0] = x[0].trim()
                x[1] = x[1].trim()
                p.push(x)
            })
            const sem = p[0][1].split('-')[1]
            const facultydata = {};
            for (let j = 1; j < facultyinfo.length; j++) {
                const f = {}

                for (let i = 1; i < 4; i++) {
                    f[facultyinfo[0][i]] = facultyinfo[j][i].toString().toUpperCase().trim()
                }
                facultydata[facultyinfo[j][0].toUpperCase()] = f
            }
            console.log(sheetname)
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
                    if (sub.toUpperCase().includes('LAB')) {
                        let x = sub.split('/')
                        x[0] = x[0].trim()
                        if (!x[0].toUpperCase().includes('LAB'))
                            x[0] = x[0] + ' LAB'
                        //if sub is 2 labs
                        if (x.length > 1) {
                            x[1] = x[1].trim()
                            if (!x[1].toUpperCase().includes('LAB'))
                                x[1] = x[1] + ' LAB'
                            const arr = [x[1].toUpperCase(), x[0].toUpperCase()]
                            const insertobj = { 'subject': sub.toUpperCase() }
                            let i = 0;
                            arr.forEach(ele => {
                                const d = facultydata[ele]
                                if (d) {
                                    const insertobj1 = d
                                    insertobj['lab' + String.fromCharCode(65 + i)] = insertobj1
                                    insertobj1['subject'] = ele
                                    const fac = insertobj1
                                    fac['class'] = sheetname
                                    fac['classtype'] = 'Lab'
                                    freehrs(sheetname[0], day, timings, fac, freeHoursObj)
                                    fun(p[2][1], day, timings, fac, facultyTimeTableObj, sem)
                                    i += 1;
                                }
                            })
                            obj[timings] = insertobj
                        }
                        //if it is a single lab
                        else {
                            const d = facultydata[x[0].toUpperCase()]
                            const insertobj = d
                            insertobj['subject'] = x[0].toUpperCase()
                            const fac = insertobj
                            fac['classtype'] = 'Lab'
                            fac['class'] = sheetname
                            freehrs(sheetname[0], day, timings, fac, freeHoursObj)
                            fun(p[2][1], day, timings, fac, facultyTimeTableObj, sem)
                            obj[timings] = insertobj

                        }
                    }
                    //if sub is not lab
                    else {
                        const d = facultydata[sub.toUpperCase()]
                        if (d) {
                            const insertobj = d
                            insertobj['subject'] = sub.toUpperCase()
                            const fac = insertobj
                            fac['classtype'] = 'Class'
                            if (sub.toUpperCase().includes("PROJECT"))
                                fac['classtype'] = 'Project'
                            fac['class'] = sheetname
                            obj[timings] = insertobj
                            freehrs(sheetname[0], day, timings, fac, freeHoursObj)
                            fun(p[2][1], day, timings, fac, facultyTimeTableObj, sem)
                        }
                        else {
                            const insertobj = {}
                            insertobj['subject'] = sub.toUpperCase()
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
                let a = await classTimeTableObj.insertOne(classtimetable);
            }
        };
    } catch (error) {
    res.status(500).send({ error: "An internal server error occurred" });
}
res.status(201).send({ message: "User Created", payload: req.body })
}))

module.exports = classtimetableApp;