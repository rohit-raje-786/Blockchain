pragma solidity ^0.5.0;

contract Marketplace{
    string public name;
    uint public ProductCount=0;
    mapping(uint => Product) public products;
    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

     event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public{
        name="Rohit Patil";
    }

    function createProducts(string memory _name,uint _price) public
    {
        require(bytes(_name).length>0);
        require(_price>0);
        ProductCount++;
        products[ProductCount]=Product(ProductCount,_name,_price,msg.sender,false);
        emit ProductCreated(ProductCount,_name,_price,msg.sender,false);
    }

    function purchasedProduct(uint _id) public payable
    {
        
         Product memory _product=products[_id];

         address  payable _seller=_product.owner;

        require(_product.id>0 && _product.id<=ProductCount);

        require(msg.value>=_product.price);

        require(!_product.purchased);

        require(_seller!=msg.sender);
         
        _product.owner=msg.sender;

        _product.purchased=true;

        products[_id]=_product;

        address(_seller).transfer(msg.value);
        
        emit  ProductPurchased(ProductCount,_product.name,_product.price,msg.sender,true);
    }
}