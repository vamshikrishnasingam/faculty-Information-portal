const exp = require("express");
const freehoursapp = exp.Router();

const expressAsyncHandler = require("express-async-handler");

freehoursapp.post(
  "/freehours-insert",
  expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj");
    const result = req.body;
    res.status(200).send({ message: "User Created", payload: req.body });
  })
);

freehoursapp.post(
  "/fac-update/:id/:key/:value",
  expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj");
    const un = req.params.id;
    const key = req.params.key;
    const value = req.params.value;
    console.log(un, key, value);
    const updateObj = {};
    updateObj[key] = value;
    const res1 = {
      $set: updateObj,
    };
    console.log(updateObj);
    a = await freeHoursObj.updateOne({ username: un }, res1);
    console.log(a);
    console.log(k, arr[ele]);
    res.status(201).send({ message: "User Created", payload: req.body });
  })
);

freehoursapp.get(
  "/faculty-data-total",
  expressAsyncHandler(async (req, res) => {
    console.log("hi");
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
    console.log("done");
    const t = req.params.time;
    const day = req.params.date;
    const y = req.params.year;
    const times = t.split(",");
    const years = y.split(",");
    console.log(Array.isArray(times), Array.isArray(years));
    console.log(times, day, years);
    let array = [];
    let barray = [];
    console.log(doc);
    doc.forEach((ele, index) => {
      let value = true;
      const d = ele[day];
      if (d) {
        times.forEach(async (time, index) => {
          const dt = d[time.replace(/\./g, "_").trim()];
          if (dt) {
            if (!years.includes(dt)) {
              value = false;
              console.log(dt, years, ele.username);
            }
          }
        });
      }
      if (value === true) array.push(ele.username);
      else barray.push(ele.username);
    });
    console.log(array.length, array);
    console.log(barray.length, barray);
    if (array) res.json(array);
    else res.json(null);
  })
);
module.exports = freehoursapp;
