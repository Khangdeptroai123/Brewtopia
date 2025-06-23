const autoPopulateUser = function (next) {
  this.populate("user", "name avatar");
  next();
};

module.exports = autoPopulateUser;
