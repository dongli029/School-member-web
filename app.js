const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // 因為瀏覽器端無法寄送PUT/PATCH故要引入此套件
const studentRoutes = require("./routes/student-routes"); //引入student routes
const facultyRoutes = require("./routes/faculty-routes");
// 用ODM module mongoose連接至mongoDB database : restfulDB
//注意mongoose會回傳一個Promise object
mongoose
  .connect("mongodb://127.0.0.1:27017/restfulDB") //選好要用的database, 記得不要寫localhost,直接寫127.0.0.1,不然會連接錯誤
  .then(() => {
    console.log("success to connect to mongoDB database: restfulDB");
  })
  .catch((e) => {
    console.log(e);
  });

//設定middleware
app.set("view engine", "ejs"); //設定可以不用寫ejs後綴

//以下是express框架中用來處理post轉成json或是轉碼用的middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //記得 _method加底線

//設定url 與 router之間映射
app.use("/students", studentRoutes); //studentRoutes是上面引入的student routes, 用/students代表
app.use("/faculties", facultyRoutes);
// 用來接住上面丟下來的error e, 自動套入err參數
app.use((err, req, res, next) => {
  console.log("use middleware to show error data");
  return res.status(400).render("error");
});

app.get("/", (req, res) => {
  res.render("XXX-School");
});

//設定監聽3000 port
app.listen(3000, () => {
  console.log("server listen to port 3000");
});
