const express = require("express");
const router = express.Router();
const Student = require("../models/student"); //將在models中定義的student module引入
//建立student主頁面, 在網頁中列印出全部學生資料
router.get("/", async (req, res, next) => {
  try {
    let studentData = await Student.find({}).exec();
    return res.render("students", { studentData });
  } catch (e) {
    // status 500是內部伺服器錯誤
    // return res.status(500).send("error founded when finding data.");
    next(e); //代表將此error往下傳, 傳到所有route的最下面(用來將錯誤歸類)
  }
});

//導向新增學生網頁
router.get("/new", (req, res) => {
  return res.render("new-student-form");
});

//用object中的學生name來到特定學生頁面獲得該學生資料
router.get("/:id", async (req, res, next) => {
  let { id } = req.params; // 用解構object方式 {id:id} 可簡寫成{id}來拿到使用者get資料
  try {
    let studentName = await Student.findOne({ _id: id }).exec();
    if (studentName != null) {
      return res.render("student-page", { studentName });
    } else {
      return res.render("student-not-found");
    }
  } catch (e) {
    //return res.status(400).render("student-not-found");
    next(e);
  }
});

//建立一個修改更新student的網頁
router.get("/:id/edit", async (req, res, next) => {
  let { id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id: id }).exec();
    if (foundStudent != null) {
      return res.render("edit-student", { foundStudent });
    } else {
      return res.status(400).render("student-not-found");
    }
  } catch (e) {
    //return res.status(400).render("student-not-found");
    next(e);
  }
});

//建立一個刪除student的網頁
router.get("/:id/delete", async (req, res) => {
  let { id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id: id }).exec();
    if (foundStudent != null) {
      return res.render("delete-student", { foundStudent });
    } else {
      return res.status(400).render("student-not-found");
    }
  } catch (e) {
    //return res.status(400).render("student-not-found");
    next(e);
  }
});

//post 創建新學生
router.post("/", async (req, res) => {
  try {
    let { name, age, major, merit, other } = req.body;
    // console.log(name, id, age, major, merit, other);
    let newStudent = new Student({
      name,
      age,
      major,
      scholarship: {
        merit,
        other,
      },
    });
    let saveStudent = await newStudent.save(); // 加.exec()會報錯 但還是會成功存入
    return res.render("save-success", { saveStudent });
  } catch (e) {
    return res.status(400).render("student-save-fail");
  }
});

//用object中的學生id來更新特定學生資料
router.put("/:id", async (req, res) => {
  //res.send("正在接收put資料"); //用來測試是否有接收put request
  try {
    let { id } = req.params; //用來接收特定學生資料
    let { name, age, major, merit, other } = req.body; // 用解構object方式 {id:id} 可簡寫成{id}來拿到使用者get資料
    let updateData = await Student.findOneAndUpdate(
      { _id: id }, //找尋要更新的資料的條件
      {
        // 設定更新值
        name,
        age,
        major,
        scholarship: {
          merit,
          other,
        },
      },
      {
        runValidators: true,
        new: true,
        overwrite: true, //用來設定覆蓋所有數據(http put request定義)
      }
    );
    res.render("student-update-success", { updateData });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

class NewData {
  constructor() {}
  setProperty(key, value) {
    if (key !== "merit" && key !== "other") {
      this[key] = value;
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

//app.patch()  更新document中部分資料
router.patch("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let newObject = new NewData();
    //用來把req.body傳進來的物件轉換成分層更好的更適合存進資料庫的data型態
    for (let property in req.body) {
      newObject.setProperty(property, req.body[property]);
    }
    //用來看req.body與轉換後資料的差別
    // console.log(req.body);
    // console.log(newObject);
    let afterPatch = await Student.findByIdAndUpdate({ _id: id }, newObject, {
      new: true,
      runValidators: true,
      //記得不能設定overwrite:true 因為根據patch定義: 只更改部分資料, 不覆寫整個document
    });
    return res.send({
      msg: "success to update student's data",
      updatedData: afterPatch,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//app.delete("")
router.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deletStudent = await Student.deleteOne({ _id: id });
    // console.log(deletStudent);
    return res.render("student-delete-success", { deletStudent });
    // res.render("student-delete-success", { deletStudent });
  } catch (e) {
    console.log(e);
    return res.status(500).send("can't delete student's data");
  }
});

//將student router匯出
module.exports = router;
