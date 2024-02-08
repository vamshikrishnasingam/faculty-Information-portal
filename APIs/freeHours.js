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

freehoursapp.post("/fac-update", expressAsyncHandler(async (req, res) => {
  try {
    const freeHoursObj = req.app.get("freeHoursObj");
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj");
    const data = req.body;
    const upd = data.dataupdate;
    const opt = data.reasons;
    const ids = data.selectedfaculty;
    const timevalue = data.timevalue;

    for (const username of ids) {
      console.log(username);

      for (const [ele, value] of Object.entries(upd)) {
        console.log(ele);

        const updateQuery1 = {
          $set: {
            [`special.${ele}`]: value
          }
        };
        const updateQuery2 = {
          $set: {
            [`special.${ele}`]: opt[ele]
          }
        };

        const updateOptions = {
          upsert: true,
          returnDocument: 'after'
        };

        // Update the freeHoursObj
        const a = await freeHoursObj.findOneAndUpdate(
          { username: username.trim() },
          updateQuery1,
          updateOptions
        );

        // Update the facultyTimeTableObj
        const b = await facultyTimeTableObj.findOneAndUpdate(
          { username: username.trim() },
          updateQuery2,
          updateOptions
        );

        if (timevalue.toUpperCase() !== 'SEM') {
          // Schedule the deletion of the data after the specified time
          const times = parseInt(timevalue, 10) * 60 * 1000 * 60 *24 ;
          schedule.scheduleJob(new Date(Date.now() + times), async () => {
            const deleteResult1 = await freeHoursObj.updateOne(
              { username: username.trim() },
              {
                $unset: {
                  [`special.${ele}`]: value
                }
              }
            );
            console.log(`Data for ${ele} deleted after the scheduled time.`, deleteResult1);
          });

          schedule.scheduleJob(new Date(Date.now() + times), async () => {
            const deleteResult2 = await facultyTimeTableObj.updateOne(
              { username: username.trim() },
              {
                $unset: {
                  [`special.${ele}`]: opt[ele]
                }
              }
            );
            console.log(`Data for ${ele} deleted after the scheduled time.`, deleteResult2);
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

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
    try {
      const freeHoursObj = req.app.get("freeHoursObj");
      const doc = await freeHoursObj.find({}).toArray();

      const t = req.params.time;
      const day = req.params.date;
      const y = req.params.year;
      const times = t.split(",").map((year) => year.replace(/\./g, '_'));
      const years = y.split(",");
      let array = [];
      let barray = [];
      doc.forEach((ele) => {
        let value = true;
        const d = ele[day];
        const events = ele?.['special']?.[day];
        times.forEach((time) => {
          console.log(d?.[time])
          if (d?.[time]) {
            if (!d[time].every((opt) => years.includes(opt))) {
              value = false;
            }
            if(years[0]==='0')
            value=false;
          }
          if (events?.[time]) {
            if (!years.includes(events[time])) {
              value = false;
            }
            if(years[0]==='0')
            value=false;
          }
        });
        if (value === true) {
          array.push(ele.username);
        } else {
          barray.push(ele.username);
        }
      });
      // Check array length instead of truthiness
      if (array.length > 0) {
        res.json(array);
      } else {
        res.json(null);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

module.exports = freehoursapp;
