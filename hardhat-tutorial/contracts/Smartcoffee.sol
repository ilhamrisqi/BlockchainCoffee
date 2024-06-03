
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCoffeeSupplyChain {
    // Enum untuk peran pengguna dan status pesanan
    enum Role { Producer, Supplier, Distributor, Retailer, Consumer }
    enum OrderStatus { Created, Shipped, Delivered, Completed }

    // Struktur untuk menyimpan informasi pengguna
    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
    }

    // Struktur untuk menyimpan informasi pesanan
    struct Order {
        uint orderId;
        address producer;
        address supplier;
        address distributor;
        address retailer;
        address consumer;
        OrderStatus status;
        uint256 amount;
    }

    // Counter untuk ID pesanan
    uint public orderCounter;
    // Mapping alamat pengguna ke struktur User
    mapping(address => User) public users;
    // Mapping ID pesanan ke struktur Order
    mapping(uint => Order) public orders;
    // Mapping alamat pengguna ke daftar ID pesanan yang terkait
    mapping(address => uint[]) public userOrders;

    // Event untuk mencatat tindakan tertentu
    event UserRegistered(address userAddress, Role role);
    event OrderCreated(uint orderId, address producer, address consumer);
    event OrderStatusUpdated(uint orderId, OrderStatus status);
    event PaymentExecuted(uint orderId, address recipient, uint256 amount);

    // Modifier untuk memastikan pengguna terdaftar
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    // Modifier untuk memastikan pengguna memiliki peran tertentu
    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Unauthorized role");
        _;
    }

    // Fungsi untuk mendaftarkan pengguna dengan peran tertentu
    function registerUser(Role _role) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User(msg.sender, _role, true);
        emit UserRegistered(msg.sender, _role);
    }

    // Fungsi untuk membuat pesanan baru oleh produsen
    function createOrder(address _consumer, uint256 _amount) public onlyRole(Role.Producer) {
        orderCounter++;
        orders[orderCounter] = Order(orderCounter, msg.sender, address(0), address(0), address(0), _consumer, OrderStatus.Created, _amount);
        userOrders[msg.sender].push(orderCounter);
        userOrders[_consumer].push(orderCounter);
        emit OrderCreated(orderCounter, msg.sender, _consumer);
    }

    // Fungsi untuk memperbarui status pesanan oleh pengguna terdaftar sesuai dengan perannya
    function updateOrderStatus(uint _orderId, OrderStatus _status) public onlyRegistered {
        Order storage order = orders[_orderId];
        require(order.orderId == _orderId, "Order not found");

        if (_status == OrderStatus.Shipped) {
            require(users[msg.sender].role == Role.Supplier, "Only supplier can mark as shipped");
            order.supplier = msg.sender;
        } else if (_status == OrderStatus.Delivered) {
            require(users[msg.sender].role == Role.Distributor, "Only distributor can mark as delivered");
            order.distributor = msg.sender;
        } else if (_status == OrderStatus.Completed) {
            require(users[msg.sender].role == Role.Retailer, "Only retailer can mark as completed");
            order.retailer = msg.sender;
            executePayment(order.orderId);
        }

        order.status = _status;
        emit OrderStatusUpdated(_orderId, _status);
    }

    // Fungsi internal untuk melakukan pembayaran kepada produsen setelah pesanan selesai
    function executePayment(uint _orderId) internal {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Completed, "Order not completed");

        payable(order.producer).transfer(order.amount);
        emit PaymentExecuted(_orderId, order.producer, order.amount);
    }

    // Fungsi untuk mendapatkan detail pesanan berdasarkan ID pesanan
    function getOrder(uint _orderId) public view returns (Order memory) {
        return orders[_orderId];
    }

    // Fungsi untuk mendapatkan daftar ID pesanan yang terkait dengan pengguna tertentu
    function getUserOrders(address _user) public view returns (uint[] memory) {
        return userOrders[_user];
    }
}




