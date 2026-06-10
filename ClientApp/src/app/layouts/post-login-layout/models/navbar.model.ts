export interface NavbarItemModel {
  navbarCode: string;
  navbarName: string;
  navbarIcon?: string;
  pageCode: string;
  pageUrl: string;
  seq: number;
}
export interface PrivPageResponse {
  hasAccess: boolean;
  pageCode: string;
  permissionCode: string;
  roleCode: string;
}