var express = require("express");
var cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./db/globalwireless.db");
var port = 3000;

app.get("/create-table", function (req, res) {
  // open database in memory
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run(
      `CREATE TABLE globalwireless (
          valueNumber INTEGER 
        );`,
      function (err) {
        if (err) {
          res.send(err.message);
        }
        console.log(`create table success`);
        res.json(`create table success`);
      }
    );
  });
});

app.get("/values", async (req, res) => {
  let result = await findVal();
  let val = {};
  if (result) {
    val = {
      returnCode: "200",
      msg: "complete",
      result,
    };
  } else {
    val = {
      returnCode: "500",
      msg: "error",
      result,
    };
  }
  res.json(val);
});

app.post("/values", async (req, res) => {
  const payload = req.body;
  let result = {};
  payload.val.map(async (res) => {
    await insertrow(res.num);
  });
  result = {
    returnCode: "200",
    msg: "complete",
  };
  res.json(result);
});

app.listen(port, function () {
  console.log("Starting node.js on port " + port);
});

const insertrow = (val) => {
  db.serialize(function () {
    db.run(`Insert into globalwireless VALUES (${val})`);
  });
};

const findVal = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      db.all("SELECT *  from globalwireless", function (err, rows) {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    } catch (err) {
      reject(err.message);
    }
  });
};

app.get("/findZero", async (req, res) => {
  let result = await findvalzero();
  console.log(result)
  let t = getNumberGame(1000, 10);
  console.log(t)
  res.json(result);
});

app.delete("/delete", async (req, res) => {
  let result = await DeleteData();
  const ress = {
    result,
    msg: "Delete Complete",
  };
  res.status(200).json(ress);
});

const findvalzero = async () => {
  return new Promise(async (resolve, reject) => {
    let arrModZero = [];
    try {
      let result = await findVal();
      result.map((res) => {
        if (res.valueNumber % 2 === 0) {
          arrModZero.push(res);
        }
      });
      resolve(arrModZero);
    } catch (err) {
      reject(err.message);
    }
  });
};

const DeleteData = () => {
  db.run(`delete from globalwireless`, function (err) {
    if (err) {
      return console.log(err.message);
    }
  });
};


function getNumberGame(target, length) {
    var dataset = [];
    var methods = {
        'add' : function (a, b) {
            return (a + b);
        },
        'subtract' : function (a, b) {
            return a - b;
        },
        'multiply' : function (a, b) {
            if (a !== 0 && b !== 0 && a < Infinity && b < Infinity) {
                return Math.round(a * b);
            } else {
                return false;
            }
        },
        'divide' : function (a, b) {
            if (a !== 0 && b !== 0 && a < Infinity && b < Infinity) {
                return Math.round(a / b);
            } else {
                return false;
            }
        }
    }
    for (var i = 0; i < length - 1; i++) {
        var obj = {
            value : Math.round(Math.random().toFixed(2) * target) + 1,
            method : Object.keys(methods)[Math.floor(Math.random() * Object.keys(methods).length)]
        };
        console.log(obj.value)
        console.log(obj)
        dataset.push(obj);
    }
    delete dataset[0].method;
    var data = dataset[0].value * 1;
    console.log('Start with ' + data);
    for (var i = 1; i < dataset.length; i++) {
        data = methods[dataset[i].method](data, dataset[i].value);
        console.log(dataset[i].method + " " + dataset[i].value + " to get " + data);
    }
    if (data > target) {
        dataset.push({
            value : Math.round(Math.abs(data - target)),
            method : 'subtract'
        });
        console.log("subtract " + dataset[dataset.length - 1].value + " to get " + target);
    } else if (data < target) {
        dataset.push({
            value : Math.round(Math.abs(data - target)),
            method : 'add'
        });
        console.log("add " + dataset[dataset.length - 1].value + " to get " + target);
    }
    var returnArray = [];
    while (dataset.length > 0) {
        var i = Math.floor(Math.random() * dataset.length);
        returnArray.push(dataset[i].value);
        dataset.splice(i, 1);
    }
    return returnArray;
}

