const express = require("express");
const router = express.Router();
const Faculty = require("../models/faculty"); //將在models中定義的Faculty module引入

//建立teacher主頁面, 在網頁中列印出全部學生資料
router.get("/", async (req, res, next) => {
  try {
    let facultyData = await Faculty.find({}).exec();
    return res.render("faculties", { facultyData });
  } catch (e) {
    // status 500是內部伺服器錯誤
    // return res.status(500).send("error founded when finding data.");
    next(e); //代表將此error往下傳, 傳到所有route的最下面(用來將錯誤歸類)
  }
});

//導向新增老師網頁
router.get("/new", (req, res) => {
  return res.render("new-faculty-form");
});

//用object中的老師name來到特定老師頁面獲得資料
router.get("/:id", async (req, res, next) => {
  let { id } = req.params; // 用解構object方式 {id:id} 可簡寫成{id}來拿到使用者get資料
  try {
    let facultyName = await Faculty.findOne({ _id: id }).exec();
    if (facultyName != null) {
      return res.render("faculty-page", { facultyName });
    } else {
      return res.render("faculty-not-found");
    }
  } catch (e) {
    //return res.status(400).render("student-not-found");
    next(e);
  }
});

//建立一個修改更新teacher的網頁
router.get("/:id/edit", async (req, res, next) => {
  let { id } = req.params;
  try {
    let foundFaculty = await Faculty.findOne({ _id: id }).exec();
    if (foundFaculty != null) {
      return res.render("edit-faculty", { foundFaculty });
    } else {
      return res.status(400).render("faculty-not-found");
    }
  } catch (e) {
    //return res.status(400).render("student-not-found");
    next(e);
  }
});

//post 創建新老師
router.post("/", async (req, res) => {
  try {
    let { name, age, suject } = req.body;
    // console.log(name, id, age, major, merit, other);
    let newFaculty = new Faculty({
      name,
      age,
      suject,
    });
    let saveFaculty = await newFaculty.save(); // 加.exec()會報錯 但還是會成功存入
    return res.render("faculty-save-success", { saveFaculty });
  } catch (e) {
    return res.status(400).render("faculty-save-fail");
  }
});

//建立一個刪除teacher的網頁
router.get("/:id/delete", async (req, res) => {
  let { id } = req.params;
  try {
    let foundFaculty = await Faculty.findOne({ _id: id }).exec();
    if (foundFaculty != null) {
      return res.render("delete-faculty", { foundFaculty });
    } else {
      return res.status(400).render("faculty-not-found");
    }
  } catch (e) {
    //return res.status(400).render("student-not-found");
    next(e);
  }
});

//用object中的學生id來更新特定學生資料
router.put("/:id", async (req, res) => {
  //res.send("正在接收put資料"); //用來測試是否有接收put request
  try {
    let { id } = req.params; //用來接收特定學生資料
    let { name, age, suject } = req.body; // 用解構object方式 {id:id} 可簡寫成{id}來拿到使用者get資料
    let updateData = await Faculty.findOneAndUpdate(
      { _id: id }, //找尋要更新的資料的條件
      {
        // 設定更新值
        name,
        age,
        suject,
      },
      {
        runValidators: true,
        new: true,
        overwrite: true, //用來設定覆蓋所有數據(http put request定義)
      }
    );
    res.render("faculty-update-success", { updateData });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//app.delete("")
router.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deletFaculty = await Faculty.deleteOne({ _id: id });
    // console.log(deletStudent);
    return res.render("faculty-delete-success", { deletFaculty });
    // res.render("student-delete-success", { deletStudent });
  } catch (e) {
    console.log(e);
    return res.status(500).send("can't delete faculty's data");
  }
});

//將student router匯出
module.exports = router;
