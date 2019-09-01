// module.exports = {
//   getName: function () {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve('tony')
//       }, 2000)
//     })
//   }
// };

export default {
  getName: function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('hello tony')
      }, 2000)
    })
  },
  getList() {
    $.ajax({
      url: '/json/list',
      type: 'get',
      success: function (result) {
        console.log(result);
      },
      error: function () {

      }
    })
  },
  addItem() {
    $.ajax({
      url: '/json/list/result',
      type: 'post',
      data: {
        //"id": 88888,
        "positionName": "机械设计工程师助理5",
        "city": "苏州5",
        "createTime": "今天 08:55",
        "salary": "114k-116k",
        "companyId": 439164,
        "companyLogo": "i/image2/M01/7E/B9/CgoB5lt6dH-AfM1JAABBXyx3xAU274.png",
        "companyName": "华来电能源科技",
        "companyFullName": "江苏华来电能源科技有限公司1"
      },
      success: function (result) {
        console.log(result);
      },
      error: function () {

      }
    })
  }
};
