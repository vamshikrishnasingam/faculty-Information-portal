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
    const updateObj = {};
    updateObj[key] = value;
    const res1 = {
      $set: updateObj,
    };
    a = await freeHoursObj.updateOne({ username: un }, res1);
    res.status(201).send({ message: "User Created", payload: req.body });
  })
);

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
        if(d[time])
        {
          if(!d[time.replace(/\./g,'_')].every(value => years.includes(value)))
          { value=false}
        }
        console.log(day,time,ele.username,d[time.replace(/\./g,'_')],years,value)

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
