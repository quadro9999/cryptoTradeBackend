module.exports = class UserDto {
  email;
  id;
  isActivated;
  veridication;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.isAdmin = model.isAdmin;
    this.veridication = model.verification;
  }
};
