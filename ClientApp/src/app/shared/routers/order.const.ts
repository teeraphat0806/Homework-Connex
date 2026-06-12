export class OrderRoute {
    static prefix = 'main';
    static orderList = 'orders';
    static orderDetails = 'order-details'
    static fullOrderListPath = `${OrderRoute.prefix}/${OrderRoute.orderList}`;
    static fullOrderDetailsPath = `${OrderRoute.prefix}/${OrderRoute.orderDetails}`;
}   