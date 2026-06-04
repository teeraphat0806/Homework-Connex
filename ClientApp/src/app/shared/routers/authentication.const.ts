export class AuthenticationRoute {
  static prefix = '';

  static login = 'login';
  static loginFullPath = `${AuthenticationRoute.prefix}/${AuthenticationRoute.login}`;

  // static register = 'register';
  // static registerFullPath = `${AuthenticationRoute.prefix}/${AuthenticationRoute.register}`;

  static selectRole = 'select-role';
  static selectRoleFullPath = `${AuthenticationRoute.prefix}/${AuthenticationRoute.selectRole}`;

}
