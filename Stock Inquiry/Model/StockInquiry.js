module.exports = {
  // call send sms helper
  sendSms: function (mob, shop, callback) {
    let originalMobNumber = mob;
    sails.helpers
      .inquiry(mob, shop)
      .then((data) => {
        return callback(false, data, originalMobNumber);
      })
      .catch((err) => {
        return callback(true, err, originalMobNumber);
      });
  },
};
