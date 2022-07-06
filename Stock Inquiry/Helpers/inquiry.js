module.exports = {
  friendlyName: "Inquiry",

  description: "Sms something.",

  inputs: {
    mob: {
      type: "string",
    },
    shopName: {
      type: "string",
    },
  },
  exits: {
    success: {
      outputFriendlyName: "Recent users",
      outputDescription: "An array of shops who want to check inquiry stocks.",
    },

    noUsersFound: {
      description:
        "Could not find any users who logged in during the specified time frame.",
    },
  },

  fn: async (inputs, exits) => {
    //return new Promise(function (resolve, reject) {

    var mob = inputs.mob;

    // -- fix mob number
    if (mob.charAt(0) == "0") mob = mob.slice(1); // remove `0` from 09*****
    mob = "98" + mob;

    var request = require("request");
    var options = {
      method: "POST",
      url: "https://api.ghasedak.me/v2/verification/send/simple",
      headers: {
        "cache-control": "no-cache",
        apikey:
          "5ae388ae789074f53d0efe6debe02eb0d0bb9a79fb3d72c01552833cd1df5e3b",
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        template: "stockInquiry",
        type: "1",
        receptor: inputs.mob,
        param1: inputs.shopName,
      },
    };

    try {
      request(options, function (error, response, body) {
        if (typeof callback == "function") callback(false, true);
        exits.success(true);
      });
    } catch (err) {
      console.log(err);
      exits.error(body.toString());
      if (typeof callback == "function") callback(body.toString(), false);
    }
  },
};
