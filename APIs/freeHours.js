const exp = require("express")
const freehoursapp = exp.Router()

const expressAsyncHandler = require("express-async-handler")

freehoursapp.get("/freehours-get/:date/:time", expressAsyncHandler(async (req, res) => {
    const freeHoursObj = req.app.get("freeHoursObj")
    const facultyTimeTableObj = req.app.get("facultyTimeTableObj")
    const doc = await freeHoursObj.find({}).toArray(function (err, result) {
        if (err) throw err;
    });
    const times = req.params.time;
    const dates = req.params.date;
    let arr = []
    arr = times.split(',')
    let array = []
    for (let i = 0; i < doc.length; i++) {
        let value = true;
        const d = doc[i][dates]
        if (d) {
            for (let j = 0; j < d.length; j++) {
                for (let k = 0; k < arr.length; k++) {
                    if (d[j] === arr[k])
                        value = false
                }
            }
        }
        if (value)
            array.push(doc[i].username)
    }
    console.log("free-hours : ", array.length)
    if (array)
        res.json(array)
    else
        res.json(null)
}))
module.exports = freehoursapp;