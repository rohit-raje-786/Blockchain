const { assert } = require("chai");
require('chai').use(require('chai-as-promised')).should()
const Marketplace = artifacts.require("MarketPlace");

contract('Marketplace',([deployer,seller,buyer])=>{
    let marketplace

    before(async()=>{
        marketplace=await Marketplace.deployed()
    })

    describe('deployment',async()=>{
        it('deploys successfully',async()=>{
            const address=Marketplace.address;
            assert.notEqual(address,'0x0');
        })
        it('has a name',async()=>{
            const name=await marketplace.name();
            assert.equal(name,'Rohit Patil')
        })
    })

    describe('deployment',async()=>{
        let result,productCount;
        before(async()=>{
            result=await marketplace.createProducts('iphoneX',web3.utils.toWei('1','Ether'),{from:seller});
            productCount=await marketplace.ProductCount();
        })
        it('product created',async()=>{
            assert.equal(productCount,1);

            const product=result.logs[0].args;
            assert.equal(product.id.toNumber(),productCount.toNumber(),'id is correct');
            assert.equal(product.name,'iphoneX','name is correct');
            assert.equal(product.price,'1000000000000000000','price is correct');
            assert.equal(product.owner,seller,'owner is correct');
            assert.equal(product.purchased,false,'purchase is correct');

            await marketplace.createProducts('',web3.utils.toWei('1','Ether'),{from:seller}).should.be.rejected;

            await marketplace.createProducts('iphoneX',0,{from:seller}).should.be.rejected;
 
        })

        it('list product',async()=>{
            
            const product=await marketplace.products(productCount);

            assert.equal(product.id.toNumber(),productCount.toNumber(),'id is correct');
            assert.equal(product.name,'iphoneX','name is correct');
            assert.equal(product.price,'1000000000000000000','price is correct');
            assert.equal(product.owner,seller,'owner is correct');
            assert.equal(product.purchased,false,'purchase is correct');
 
        })

        it('Purchased product',async()=>{
            
            let oldsellerbalance;
            oldsellerbalance=await web3.eth.getBalance(seller)
            oldsellerbalance=new web3.utils.BN(oldsellerbalance);

           result=await marketplace.purchasedProduct(productCount,{from:buyer,value:web3.utils.toWei('1','Ether')});

           const event=result.logs[0].args;
           assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct');
           assert.equal(event.name,'iphoneX','name is correct');
           assert.equal(event.price,'1000000000000000000','price is correct');
           assert.equal(event.owner,buyer,'owner is correct');
           assert.equal(event.purchased,true,'purchase is correct');

           let newsellerbalance=await web3.eth.getBalance(seller);
           newsellerbalance=new web3.utils.BN(newsellerbalance)

           let price;
           price= web3.utils.toWei('1','Ether');
           price=new web3.utils.BN(price);
     
            const expectedbalance=oldsellerbalance.add(price)

           assert.equal(expectedbalance.toString(),newsellerbalance.toString());

          await marketplace.purchasedProduct(99,{from:buyer,value:web3.utils.toWei('1','Ether')}).should.be.rejected;

          await marketplace.purchasedProduct(productCount,{from:buyer,value:web3.utils.toWei('0.5','Ether')}).should.be.rejected;

          await marketplace.purchasedProduct(99,{from:deployer,value:web3.utils.toWei('1','Ether')}).should.be.rejected;

          await marketplace.purchasedProduct(99,{from:seller,value:web3.utils.toWei('1','Ether')}).should.be.rejected;

        })
        
        
    })

})