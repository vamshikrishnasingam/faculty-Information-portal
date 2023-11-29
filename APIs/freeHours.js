const exp = require("express");
const freehoursapp = exp.Router();
const schedule = require('node-schedule');

const expressAsyncHandler = require("express-async-handler");
const { promises } = require("nodemailer/lib/xoauth2");

freehoursapp.post(
  "/freehours-insert",
  expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj");
    const result = req.body;
    res.status(200).send({ message: "User Created", payload: req.body });
  })
);

freehoursapp.post(
  "/fac-update",
  expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj");
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj");
    const data = req.body;
    const upd = data.dataupdate;
    const opt = data.reasons;
    const ids = data.selectedfaculty;
    let timevalue = data.timevalue;
    let lastkey;
    await Promise.all(
      ids.forEach((username) => {
        console.log(username)
        Object.keys(upd).forEach(async (ele, index) => {
          console.log(ele, index)
          if (timevalue.toUpperCase() === 'SEM') {
            const res = {
              $addToSet: {
                [ele]: upd[ele]
              }
            }
            const updobj={
              $addToSet : {
                'special' : {
                  [ele]: opt[ele]
                }
              }
            }
            a = await freeHoursObj.updateOne({ username: username.trim() }, res);
            b = await facultyTimeTableObj.updateOne({ username: username.trim() }, updobj);

          }

          else {
            const times = parseInt(timevalue, 10) * 60 * 1000;
            const res = {
              $addToSet: {
              [ele]   : { 'special': upd[ele] }
              }
            }
            const updobj={
              $addToSet : {
                'special' : {
                  [ele]: opt[ele]
                }
              }
            }
            // Set the object in the database for only particular time
            a = await freeHoursObj.updateOne({ username: username.trim() }, res);
            b = await facultyTimeTableObj.updateOne({ username: username.trim() }, updobj);
            // Schedule the deletion of the data after the specified time
            schedule.scheduleJob(new Date(Date.now() + times), async () => {
              const deleteResult = await freeHoursObj.updateOne(
                { username: username.trim() },
                {
                  $unset: {
                    [ele]   : { 'special': upd[ele] }
                  }
                }
              );
              console.log(`Data for ${ele} deleted after the scheduled time.`, deleteResult);
            });
            schedule.scheduleJob(new Date(Date.now() + times), async () => {
              const deleteResult = await facultyTimeTableObj.updateOne(
                { username: username.trim() },
                {
                  $unset: {
                    'special'   : { [ele]: upd[ele] }
                  }
                }
              );
              console.log(`Data for ${ele} deleted after the scheduled time.`, deleteResult);
            });
          }
        })
      })
    )
    res.status(201).send({ message: "Status Created", payload: req.body });
  }));

freehoursapp.get(
  "/faculty-data-total",
  expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj");
    const doc = await freeHoursObj.find({}).toArray(function (err, result) {
      if (err) throw err;
    });
    res.json(doc);
  })
);

freehoursapp.get(
  "/full-data/:id",
  expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj");
    const id = req.params.id;
    const doc = await freeHoursObj.findOne({ username: id });
    res.json(doc);
  })
);

freehoursapp.get(
  "/freehours-get/:date/:time/:year",
  expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj");
    const doc = await freeHoursObj.find({}).toArray(function (err, result) {
      if (err) throw err;
    });
    const t = req.params.time;
    const day = req.params.date;
    const y = req.params.year;
    const times = t.split(",");
    const years = y.split(",");
    let array = [];
    let barray = [];
    doc.forEach((ele, index) => {
      let value = true;
      const d = ele[day];
      if (d) {
        times.forEach((time, index) => {
          if (d[time]) {
            if (!d[time.replace(/\./g, '_')].every(value => years.includes(value))) { value = false }
          }
          console.log(day, time, ele.username, d[time.replace(/\./g, '_')], years, value)

        })
      }
      if (value === true) array.push(ele.username);
      else barray.push(ele.username);
    });
    if (array) res.json(array);
    else res.json(null);
  })
);
module.exports = freehoursapp;
