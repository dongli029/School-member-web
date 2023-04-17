const mongoose = require("mongoose");
const { Schema } = mongoose; //解構mongoose裡的  Schema class映射

// 用mongoose裡的Schema class建構一個新collections模型
const facultySchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 25 },
    age: {
      type: Number,
      min: [20, "年齡不能小於0"],
      max: [80, "可能有點太老了"],
    }, //設定age不可以小於0,與小於0時報錯提示
    suject: {
      type: String,
      required: [
        true,
        // function () {
        //   return this.scholarship.merit >= 3000; //當要新增學生的merit >= 3000時為必填,
        // },
        "suject為必填項目", //客制化報錯提示
      ],
      enum: [
        "Chemistry",
        "CS",
        "Mathematics",
        "Civil Engineering",
        "undecided",
      ], //要在enum選項內
    },
  },
  {
    // schema的第二個參數可以設定 instance methods 每個依此schema製作的instance均可使用, 與屬於此schema的static methods
    methods: {
      teacherSuject() {
        //這裡的this是指用此schema的model創建的每個instance
        return this.name + "'s suject is " + this.suject + ".";
      },
    },
    statics: {
      async findAllSujectTeacher(course) {
        //console.log(this);
        //這裡的this是代表用此schema創建的model
        //創一個變數data用來接收 用await 等待promise物件fullfilled後回傳的參數(這邊是一個array)
        data = await this.find({ suject: course }).exec();
        try {
          console.log(data); //印出data
        } catch (e) {
          console.log(e);
        }
      },
    },
  }
);

// //訂定schema所屬的instance method 第二種方式
// studentSchema.methods.studentMajor = function () {
//   return this.name + "'s major is " + this.major + ".";
// };

//訂定schema所屬的static method 第二種方式
// studentSchema.statics.findAllMeritStudents = async function (money) {
//   data = await this.find({ "scholarship.merit": money }).exec();
//   try {
//     console.log(data);
//   } catch (e) {
//     console.log(e);
//   }
// };

/*
用上面構建的studentSchema collection映射來實體化collection: 命名為Student
mongoose.model(參數一,參數二)要實體化定義的studentSchema映射,
參數一設定實體化後的collection名稱,參數二為要映射的schema
*/
const Faculty = mongoose.model("Faculty", facultySchema);
//將建構的collections model物件 Student export
module.exports = Faculty;
