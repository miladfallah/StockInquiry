/**
 * StockInquiryController
 *
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  add: (req, res) => {
    let input = req.body;
    shopPhone = input.shopMobile;
    shopName = input.economic_name;
    let userInfo = req.userInfo;
    if (req.body.userInfo) userInfo = req.body.userInfo;
    if (!userInfo)
      return res.json({
        state: false,
        errorCode: -1,
        message: "user is not logged in",
      });

    async.waterfall(
      [
        //add row to orderItems table
        function (next) {
          OrderItems.add(userInfo, input, function (err, orderRes) {
            if (err)
              return next(true, {
                state: false,
                errorCode: -1,
                message: "server error in add",
              });
            return next(false);
          });
        },

        // send sms to shop for apply or reject the inquiry

        function (next) {
          //--0 Input checking
          if (!shopPhone) return res.json({ state: false, errorCode: -2 });
          //--1 send SMS
          StockInquiry.sendSms(
            shopPhone,
            shopName,
            async function (err, key, value) {
              if (err) return next(true, { state: false, errorCode: -3 });

              return next(false, { state: true });
            }
          );
        },
      ],
      function (err, finalResult) {
        /** &)---- final ----**/
        if (err) return res.json(finalResult);
        return res.json(finalResult);
      }
    );
  },
  get: function (req, res) {
    let userInfo = req.userInfo;
    user = userInfo.id;
    if (!userInfo)
      return res.json({
        state: false,
        errorCode: -1,
        message: "user is not logged in",
      });
    OrderItems.get(user, function (err, data) {
      if (err) {
        // console.log(err);
        return res.json({ state: false, errorCode: -1 });
      }
      // console.log(data);
      return res.ok({ state: true, data: data });
    });
  },
};
