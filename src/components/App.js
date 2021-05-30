import React, { Component } from 'react';

import './App.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {

  async componentWillMount()
  {
    await this.loadWeb3();
    await this.loadBlockChaindata();
  }

  async loadWeb3()
  {
    const ethEnabled = () => {
      if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        window.ethereum.enable();
        return true;
      }
      return false;
    }
    if (!ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    } 
  }
  async loadBlockChaindata()
  {
    const web3=window.web3;
    const acc=await web3.eth.getAccounts();
    this.setState({
      account:acc[0]
    })
   
    const networkData=await web3.eth.net.getId();
    if(networkData)
    {
     
      const address=Marketplace.networks[networkData].address;
      const marketplace=web3.eth.Contract(Marketplace.abi,address);
      
      this.setState({marketplace});
      const productCount=await marketplace.methods.ProductCount().call();
      this.setState({productCount});
      for(var i=1;i<=productCount;i++)
      {
        const product=await marketplace.methods.products(i).call();
        this.setState({
          products:[...this.state.products,product]
        });
      }
      console.log(this.state.products);
      this.setState({loading:false})
      console.log(marketplace);
    }
    else
    {
      Window.alert('Contract not deployed to the correct network');
    }
  
  }
  constructor(props)
  {
    super(props)
    this.state={
      account:'',
      productCount:0,
      products:[],
      loading:true
    };
    this.createProducts=this.createProducts.bind(this);
    this.purchasedProduct=this.purchasedProduct.bind(this);
  }
  createProducts(name,price)
  {
    this.setState({loading:true});
    this.state.marketplace.methods.createProducts(name,price).send({from:this.state.account}).once('receipt',(receipt)=>{
      this.setState({loading:false});
    })


  }
  purchasedProduct(id,price)
  {
    this.setState({loading:true})
    this.state.marketplace.methods.purchasedProduct(id).send({from:this.state.account,value:price}).once('receipt',(receipt)=>{
    this.setState({loading:false});
    });
  }
  render() {
    return (
      <div>
       <Navbar account={this.state.account}/>
       <div className="container-fluid mt-5">
         <div className="row">
           <main role="main" className="col-lg-12 d-flex">
             {this.state.loading? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>: <Main createProducts={this.createProducts} products={this.state.products} purchasedProduct={this.purchasedProduct}/>}
            
           </main>
         </div>
       </div>
      </div>
    );
  }
}

export default App;
