export const mockUsers = [
  {
    userId: 1,
    username: 'admin01',
    firstName: 'Admin',
    lastName: 'System',
    age: 30,
    phone: '0811111111',
    birthDate: '1996-01-01',
    createdTime: '2026-06-10T09:00:00',
  },
  {
    userId: 2,
    username: 'approver01',
    firstName: 'Somchai',
    lastName: 'Approver',
    age: 35,
    phone: '0822222222',
    birthDate: '1991-02-02',
    createdTime: '2026-06-10T09:05:00',
  },
  {
    userId: 3,
    username: 'user01',
    firstName: 'Teerapat',
    lastName: 'User',
    age: 24,
    phone: '0833333333',
    birthDate: '2002-03-03',
    createdTime: '2026-06-10T09:10:00',
  },
];

export const mockRefRoles = [
  { roleId: 1, roleCode: 'ADMIN', roleName: 'Administrator' },
  { roleId: 2, roleCode: 'APPROVER', roleName: 'Approver' },
  { roleId: 3, roleCode: 'USER', roleName: 'Normal User' },
];

export const mockUserRoles = [
  {
    userRoleId: 1,
    userId: 1,
    roleCode: 'ADMIN',
    approvedByUserId: 1,
    approvedTime: '2026-06-10T09:00:00',
    expiredTime: null,
    createdTime: '2026-06-10T09:00:00',
  },
  {
    userRoleId: 2,
    userId: 2,
    roleCode: 'APPROVER',
    approvedByUserId: 1,
    approvedTime: '2026-06-10T09:10:00',
    expiredTime: null,
    createdTime: '2026-06-10T09:10:00',
  },
  {
    userRoleId: 3,
    userId: 3,
    roleCode: 'USER',
    approvedByUserId: 1,
    approvedTime: '2026-06-10T09:20:00',
    expiredTime: null,
    createdTime: '2026-06-10T09:20:00',
  },
];

export const mockUserRoleLogs = [
  {
    userRoleLogId: 1,
    userRoleId: 1,
    userId: 1,
    roleCode: 'ADMIN',
    createdTime: '2026-06-10T09:00:00',
  },
  {
    userRoleLogId: 2,
    userRoleId: 2,
    userId: 2,
    roleCode: 'APPROVER',
    createdTime: '2026-06-10T09:10:00',
  },
];

export const mockRefPages = [
  {
    pageCode: 'DASHBOARD',
    pageDesc: 'Dashboard Page',
    pageUrl: 'dashboard',
    isActive: true,
  },
  {
    pageCode: 'PRODUCT',
    pageDesc: 'Product Management Page',
    pageUrl: 'products',
    isActive: true,
  },
  {
    pageCode: 'ORDER_MEMBER',
    pageDesc: 'Order Member',
    pageUrl: '/orders/member',
    isActive: true,
  },
  {
    pageCode: 'ORDER_DETAIL_MEMBER',
    pageDesc: 'Order Detail Member',
    pageUrl: '/orders/member/detail',
    isActive: true,
  },
  {
    pageCode: 'ORDER_ADMIN',
    pageDesc: 'Order Admin',
    pageUrl: '/orders/admin',
    isActive: true,
  },
  {
    pageCode: 'ORDER_DETAIL_ADMIN',
    pageDesc: 'Order Detail Admin',
    pageUrl: '/orders/admin/detail',
    isActive: true,
  },
  {
    pageCode: 'USER',
    pageDesc: 'User Management Page',
    pageUrl: 'users',
    isActive: true,
  },
  {
    pageCode: 'ROLE',
    pageDesc: 'Role Management Page',
    pageUrl: 'roles',
    isActive: true,
  },
];

export const mockRefNavbar = [
  {
    navbarCode: 'NAV_DASHBOARD',
    navbarName: 'Dashboard',
    pageCode: 'DASHBOARD',
    seq: 1,
    navbarIcon: 'dashboard',
  },
  {
    navbarCode: 'NAV_PRODUCT',
    navbarName: 'Products',
    pageCode: 'PRODUCT',
    seq: 2,
    navbarIcon: 'inventory_2',
  },
  {
    navbarCode: 'NAV_ORDER_MEMBER',
    navbarName: 'ใบเบิกของ',
    pageCode: 'ORDER_MEMBER',
    seq: 3,
    navbarIcon: 'receipt',
  },
  {
    navbarCode: 'NAV_ORDER_ADMIN',
    navbarName: 'Order Admin',
    pageCode: 'ORDER_ADMIN',
    seq: 50,
    navbarIcon: 'receipt',
  },
  {
    navbarCode: 'NAV_USER',
    navbarName: 'Users',
    pageCode: 'USER',
    seq: 4,
    navbarIcon: 'group',
  },
];

export const mockRefPermissions = [
  { permissionId: 1, permissionCode: 'DASHBOARD_VIEW', permissionName: 'View Dashboard' },
  { permissionId: 2, permissionCode: 'PRODUCT_VIEW', permissionName: 'View Product' },
  { permissionId: 3, permissionCode: 'PRODUCT_CREATE', permissionName: 'Create Product' },
  { permissionId: 4, permissionCode: 'PRODUCT_EDIT', permissionName: 'Edit Product' },
  { permissionId: 5, permissionCode: 'PRODUCT_DELETE', permissionName: 'Delete Product' },
  { permissionId: 6, permissionCode: 'ORDER_MEMBER_VIEW', permissionName: 'View Order Member' },
  { permissionId: 7, permissionCode: 'ORDER_DETAIL_MEMBER_VIEW', permissionName: 'View Order Detail Member' },
  { permissionId: 8, permissionCode: 'ORDER_ADMIN_VIEW', permissionName: 'View Order Admin' },
  { permissionId: 11, permissionCode: 'ORDER_DETAIL_ADMIN_VIEW', permissionName: 'View Order Detail Admin' },
  { permissionId: 9, permissionCode: 'USER_VIEW', permissionName: 'View User' },
  { permissionId: 10, permissionCode: 'ROLE_MANAGE', permissionName: 'Manage Role' },
];

export const mockRolePermissions = [
  { roleCode: 'ADMIN', permissionCode: 'DASHBOARD_VIEW' },
  { roleCode: 'ADMIN', permissionCode: 'PRODUCT_VIEW' },
  { roleCode: 'ADMIN', permissionCode: 'PRODUCT_CREATE' },
  { roleCode: 'ADMIN', permissionCode: 'PRODUCT_EDIT' },
  { roleCode: 'ADMIN', permissionCode: 'PRODUCT_DELETE' },
  { roleCode: 'ADMIN', permissionCode: 'ORDER_ADMIN_VIEW' },
  { roleCode: 'ADMIN', permissionCode: 'ORDER_DETAIL_ADMIN_VIEW' },
  { roleCode: 'ADMIN', permissionCode: 'USER_VIEW' },
  { roleCode: 'ADMIN', permissionCode: 'ROLE_MANAGE' },

  { roleCode: 'APPROVER', permissionCode: 'DASHBOARD_VIEW' },

  { roleCode: 'USER', permissionCode: 'DASHBOARD_VIEW' },
  { roleCode: 'USER', permissionCode: 'PRODUCT_VIEW' },
  { roleCode: 'USER', permissionCode: 'ORDER_MEMBER_VIEW' },
  { roleCode: 'USER', permissionCode: 'ORDER_DETAIL_MEMBER_VIEW' },
];

export const mockPermissionPages = [
  { permissionCode: 'DASHBOARD_VIEW', pageCode: 'DASHBOARD' },
  { permissionCode: 'PRODUCT_VIEW', pageCode: 'PRODUCT' },
  { permissionCode: 'PRODUCT_CREATE', pageCode: 'PRODUCT' },
  { permissionCode: 'PRODUCT_EDIT', pageCode: 'PRODUCT' },
  { permissionCode: 'PRODUCT_DELETE', pageCode: 'PRODUCT' },
  { permissionCode: 'ORDER_MEMBER_VIEW', pageCode: 'ORDER_MEMBER' },
  { permissionCode: 'ORDER_DETAIL_MEMBER_VIEW', pageCode: 'ORDER_DETAIL_MEMBER' },
  { permissionCode: 'ORDER_ADMIN_VIEW', pageCode: 'ORDER_ADMIN' },
  { permissionCode: 'ORDER_DETAIL_ADMIN_VIEW', pageCode: 'ORDER_DETAIL_ADMIN' },
  { permissionCode: 'USER_VIEW', pageCode: 'USER' },
  { permissionCode: 'ROLE_MANAGE', pageCode: 'ROLE' },
];

export const mockFunctionPageMapping = [
  {
    functionCode: 'PRODUCT_VIEW',
    pageCode: 'PRODUCT',
    permissionCode: 'PRODUCT_VIEW',
  },
  {
    functionCode: 'PRODUCT_CREATE',
    pageCode: 'PRODUCT',
    permissionCode: 'PRODUCT_CREATE',
  },
  {
    functionCode: 'PRODUCT_EDIT',
    pageCode: 'PRODUCT',
    permissionCode: 'PRODUCT_EDIT',
  },
];

export const mockRefCategories = [
  {
    categoryId: 1,
    name: 'Electronics',
    createdByUserId: 1,
    createdTime: '2026-06-10T09:00:00',
  },
  {
    categoryId: 2,
    name: 'Office Supplies',
    createdByUserId: 1,
    createdTime: '2026-06-10T09:00:00',
  },
  {
    categoryId: 3,
    name: 'Furniture',
    createdByUserId: 1,
    createdTime: '2026-06-10T09:00:00',
  },
];

export const mockProducts = [
  {
    productId: 1,
    ProductCode: 'P-KEYBOARD-001',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard',
    price: 2500,
    stockQty: 20,
    categoryId: 1,
    isActive: true,
    createdByUserId: 1,
    createdTime: '2026-06-10T09:00:00',
  },
  {
    productId: 2,
    ProductCode: 'P-MOUSE-001',
    name: 'Wireless Mouse',
    description: 'Bluetooth wireless mouse',
    price: 890,
    stockQty: 50,
    categoryId: 1,
    isActive: true,
    createdByUserId: 1,
    createdTime: '2026-06-10T09:10:00',
  },
];

export const mockProductCategoryMapping = [
  { mappingId: 1, productId: 1, categoryId: 1 },
  { mappingId: 2, productId: 2, categoryId: 1 },
  { mappingId: 3, productId: 3, categoryId: 3 },
];

export const mockOrders = [
  {
    orderId: 1,
    orderNo: 'ORD-20260610-001',
    orderDate: '2026-06-10T10:00:00',
    totalAmount: 3390,
    vatAmount: 237.3,
    status: 'PENDING',
    createdByUserId: 3,
    createdTime: '2026-06-10T10:00:00',
    modifiedByUserId: 3,
    modifiedTime: '2026-06-10T10:00:00',
    approvedByUserId: null,
    approvedTime: null,
    rejectedByUserId: null,
    rejectedTime: null,
    confirmedByUserId: null,
    confirmedTime: null,
  },
  {
    orderId: 2,
    orderNo: 'ORD-20260610-002',
    orderDate: '2026-06-10T11:00:00',
    totalAmount: 4500,
    vatAmount: 315,
    status: 'APPROVED',
    createdByUserId: 3,
    createdTime: '2026-06-10T11:00:00',
    modifiedByUserId: 2,
    modifiedTime: '2026-06-10T11:30:00',
    approvedByUserId: 2,
    approvedTime: '2026-06-10T11:30:00',
    rejectedByUserId: null,
    rejectedTime: null,
    confirmedByUserId: null,
    confirmedTime: null,
  },
];

export const mockOrderItems = [
  {
    orderItemId: 1,
    orderId: 1,
    productId: 1,
    qty: 1,
    unitPrice: 2500,
    discount: 0,
    netAmount: 2500,
    orderItemStatus: 'PENDING',
    approvedByUserId: null,
    approvedTime: null,
    orderItemStatusCode: 'PENDING',
    rejectedByUserId: null,
    rejectedTime: null,
    rejectedReason: null,
  },
  {
    orderItemId: 2,
    orderId: 1,
    productId: 2,
    qty: 1,
    unitPrice: 890,
    discount: 0,
    netAmount: 890,
    orderItemStatus: 'PENDING',
    approvedByUserId: null,
    approvedTime: null,
    orderItemStatusCode: 'PENDING',
    rejectedByUserId: null,
    rejectedTime: null,
    rejectedReason: null,
  },
  {
    orderItemId: 3,
    orderId: 2,
    productId: 3,
    qty: 1,
    unitPrice: 4500,
    discount: 0,
    netAmount: 4500,
    orderItemStatus: 'APPROVED',
    approvedByUserId: 2,
    approvedTime: '2026-06-10T11:30:00',
    orderItemStatusCode: 'APPROVED',
    rejectedByUserId: null,
    rejectedTime: null,
    rejectedReason: null,
  },
];

export const mockUserRefreshTokens = [
  {
    userRefreshTokenId: 1,
    userId: 1,
    refreshToken: 'mock-refresh-token-admin',
    accessToken: 'mock-access-token-admin',
    expiredTime: '2026-06-17T09:00:00',
    createdTime: '2026-06-10T09:00:00',
    revokedTime: null,
    revokedByUserId: null,
    revokedReason: null,
  },
  {
    userRefreshTokenId: 2,
    userId: 3,
    refreshToken: 'mock-refresh-token-user',
    accessToken: 'mock-access-token-user',
    expiredTime: '2026-06-17T09:00:00',
    createdTime: '2026-06-10T09:00:00',
    revokedTime: null,
    revokedByUserId: null,
    revokedReason: null,
  },
];

export const mockLogOrders = [
  {
    logOrderId: 1,
    orderId: 1,
    orderNo: 'ORD-20260610-001',
    orderDate: '2026-06-10T10:00:00',
    totalAmount: 3390,
    vatAmount: 237.3,
    status: 'PENDING',
    createdByUserId: 3,
    action: 'CREATE',
    logTime: '2026-06-10T10:00:00',
  },
  {
    logOrderId: 2,
    orderId: 2,
    orderNo: 'ORD-20260610-002',
    orderDate: '2026-06-10T11:00:00',
    totalAmount: 4500,
    vatAmount: 315,
    status: 'APPROVED',
    createdByUserId: 3,
    action: 'APPROVE',
    logTime: '2026-06-10T11:30:00',
  },
];

export const mockLogProducts = [
  {
    logProductId: 1,
    productId: 1,
    ProductCode: 'P-KEYBOARD-001',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard',
    price: 2500,
    stockQty: 20,
    categoryId: 1,
    isActive: true,
    createdByUserId: 1,
    action: 'CREATE',
    logTime: '2026-06-10T09:00:00',
  },
];

export const mockLogSystemErrors = [
  {
    logSystemErrorId: 1,
    errorCode: 'ERR-500-001',
    message: 'Mock internal server error',
    stackTrace: 'Mock stack trace',
    source: 'ProductController',
    path: '/api/products',
    httpMethod: 'GET',
    userId: 1,
    createdTime: '2026-06-10T12:00:00',
  },
];

export const mockLogUserRoles = [
  {
    logUserRoleId: 1,
    userId: 2,
    username: 'approver01',
    roleCode: 'APPROVER',
    action: 'ASSIGN',
    createdByUserId: 1,
    logTime: '2026-06-10T09:10:00',
  },
];

export const mockDatabase = {
  users: mockUsers,
  refRoles: mockRefRoles,
  userRoles: mockUserRoles,
  userRoleLogs: mockUserRoleLogs,
  refPages: mockRefPages,
  refNavbar: mockRefNavbar,
  refPermissions: mockRefPermissions,
  rolePermissions: mockRolePermissions,
  permissionPages: mockPermissionPages,
  functionPageMapping: mockFunctionPageMapping,
  refCategories: mockRefCategories,
  products: mockProducts,
  productCategoryMapping: mockProductCategoryMapping,
  orders: mockOrders,
  orderItems: mockOrderItems,
  userRefreshTokens: mockUserRefreshTokens,
  logOrders: mockLogOrders,
  logProducts: mockLogProducts,
  logSystemErrors: mockLogSystemErrors,
  logUserRoles: mockLogUserRoles,
};
