export default {
  get(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        type: 'get',
        success(result) {
          resolve(result);
        }
      })
    })
  }
}