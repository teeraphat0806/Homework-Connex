export class OrderRoute {
    static prefix = 'main';
    static orderList = 'orders';
    static orderDetails = 'order-details';
    static orderAdminList = 'orders/admin';
    static orderAdminDetails = 'orders/admin/detail';
    static fullOrderListPath = `${OrderRoute.prefix}/${OrderRoute.orderList}`;
    static fullOrderDetailsPath = `${OrderRoute.prefix}/${OrderRoute.orderDetails}`;
    static fullOrderAdminListPath = `${OrderRoute.prefix}/${OrderRoute.orderAdminList}`;
    static fullOrderAdminDetailsPath = `${OrderRoute.prefix}/${OrderRoute.orderAdminDetails}`;
}   