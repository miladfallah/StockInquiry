module.exports = {
  tableName: "orderitems",
  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
    },
    userId: {
      model: "user",
    },
    productId: {
      type: "number",
    },
    productName: {
      type: "string",
    },
    productPic: {
      type: "string",
    },
    shopId: {
      type: "number",
    },
    shopName: {
      type: "string",
    },
    size: {
      type: "string",
    },
    color: {
      type: "string",
    },
    quantity: {
      type: "number",
    },
    price: {
      type: "number",
    },
    sendPrice: {
      type: "number",
    },
    discount: {
      type: "number",
    },
    stockStatus: {
      type: "string",
    },
    create_time: {
      type: "number",
    },

    update_time: {
      type: "number",
      allowNull: true,
    },
    createdAt: false,
    updatedAt: false,
  },
  add: function (userInfo, input, callback) {
    let userId = userInfo.id;
    let productId = input.productId;
    let productName = input.productName;
    let productPic = input.productPic;
    let shopName = input.shopName;
    let size = "";
    if (input.size) size = input.size;
    let color = "";
    if (input.color) color = input.color;
    let quantity = input.quantity;
    let shopId = input.shopId;
    let sendPrice = input.sendPrice;
    let price = input.price;
    let discount = "";
    if (input.discount) discount = input.discount;
    let stockStatus = 0;

    OrderItems.create({
      userId: userId,
      productId: productId,
      productName: productName,
      productPic: productPic,
      shopName: shopName,
      size: size,
      color: color,
      quantity: quantity,
      shopId: shopId,
      sendPrice: sendPrice,
      price: price,
      discount: discount,
      stockStatus: stockStatus,
      create_time: new Date() / 1000,
      update_time: new Date() / 1000,
    })
      .fetch()
      .exec((err, result) => {
        if (err) return callback(err, "");
        return callback(false, result);
      });
  },

  get: (user, finalCallback) => {
    OrderItems.find({ where: { userId: user } }).exec((err, order) => {
      if (err) return res.json({ state: false, errorCode: -2 });
      async.eachOf(
        order,
        function (targetItem, itemIndex, eachofCallback) {
          async.parallel(
            {
              /*  [2] -> convert relative address to absolute */
              // it stick Min Io addres to first of pic address
              productPic: (callback) => {
                Main.convertRelativeAddressToAbsolute(
                  targetItem.productPic,
                  callback
                );
              },
            },
            (err, shopExtraInfo) => {
              if (err) {
                return eachofCallback(true, err);
              }

              order[itemIndex]["productPic"] = shopExtraInfo.productPic;
              return eachofCallback(false, order);
            }
          );
        },
        function (err) {
          //-- final callback of eachof

          finalCallback(err, order);
        }
      );
    });
  },
};
