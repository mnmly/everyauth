Object.defineProperty(Object.prototype, "extend", {
  enumerable: false,
  value: function(from) {
    var props = Object.getOwnPropertyNames(from);
    var dest = this;
    props.forEach(function(name) {
      if (name in dest) {
        var destination = Object.getOwnPropertyDescriptor(from, name);
        Object.defineProperty(dest, name, destination);
      }
    });
    return this;
  }
});

module.exports = function (app, opts) {
  var everyauth = this
    , helpers = {}
    , userAlias = opts && opts.userAlias || 'user';
  helpers.everyauth = function (req, res) {
    var ea = {}
      , sess = req.session;
    ea.loggedIn = sess.auth && !!sess.auth.loggedIn;

    // Copy the session.auth properties over
    var auth = sess.auth;
    for (var k in auth) {
      ea[k] = auth[k];
    }

    // Add in access to loginFormFieldName() and passwordFormFieldName()
    // TODO Don't compute this if we
    // aren't using password module
    ea.password || (ea.password = {});
    ea.password.loginFormFieldName = everyauth.password.loginFormFieldName();
    ea.password.passwordFormFieldName = everyauth.password.passwordFormFieldName();

    ea.user = req.user;

    res.locals.extend(ea)
  };
  helpers[userAlias] = function (req, res) {
    res.locals.user = req.user;
  };
  app.locals.use(helpers.everyauth);
  app.locals.use(helpers[userAlias]);
};
