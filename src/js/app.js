// let web3;
let linkToApp;

class App {
  constructor() {
    this.web3Provider = null,
    this.contracts = {},

    this.init();
    this.initWeb3('http://localhost:7545');

    this.initContract();

    this.setInstanceToGlobalVar();
    this.bindEvents();
  }

  init() {
    $.getJSON('../planets.json', function(data) {
      var planetsRow = $('#planetsRow');
      var planetTemplate = $('#planetTemplate');
      for (let i = 0; i < data.length; i ++) {
        planetTemplate.find('.panel-title').text(data[i].name);
        planetTemplate.find('img').attr('src', data[i].picture);
        planetTemplate.find('.planet-age').text((data[i].age).toString().replace(/(?=(\d{3})+$)/g, ',')+' years');
        planetTemplate.find('.planet-location').text(data[i].location);
        planetTemplate.find('.planet-presence-of-life-on-the-planet').text( data[i].presenceOfLifeOnThePlanet ? "On this planet found signs of life" : "There're no signs of life on this planet" );
        planetTemplate.find('.planet-color').text(data[i].color);
        planetTemplate.find('.planet-owner').text('No one yet');
        planetTemplate.find('.btn-buy').attr('data-id', data[i].id);
        planetTemplate.find('.btn-sale').attr('data-id', data[i].id);
        planetsRow.append(planetTemplate.html());
      }
    });
  }

  initWeb3(link) {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      this.web3Provider = new Web3.providers.HttpProvider(link);
    }
    web3 = new Web3(this.web3Provider);
  }

  initContract(web3Provider = this.web3Provider, instance = this) {
    $.getJSON('Buy.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BuyArtifact = data;
      instance.contracts.Buy = TruffleContract(BuyArtifact);

      // Set the provider for our contract
      instance.contracts.Buy.setProvider(web3Provider);
    }).then(function() {
      // Use our contract to retrieve and mark the adopted pets
      instance.markBuyed();
    })
  }

  setInstanceToGlobalVar(instance = this) {
    linkToApp = instance;
  }

  bindEvents() {
    $(document).on('click', '.btn-buy', this.handleBuy);
    $(document).on('click', '.btn-sale', this.handleSale);
  }

  markBuyed( customers, account ) {
    let buyInstance;

    this.contracts.Buy.deployed()
    .then(function(instance) {
      buyInstance = instance;

      return buyInstance.getCustomers.call();
    })
    .then(function(customers) {

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.error(error);
        }

        // get first (base) account
        let currentAccount = accounts[0];

        for (let i = 0; i < customers.length; i++) {
          if (customers[i] !== '0x0000000000000000000000000000000000000000') {
            $('.planet-card').eq(i).find('.btn-buy').text('Buyed').attr('disabled', false).removeClass('btn-info').addClass('btn-success');
            $('.planet-card').eq(i).find('.planet-owner').text('This planet was bought by ' + customers[i]);
            if (currentAccount == customers[i]){
              $('.planet-card').eq(i).find('.btn-sale').show();
            }
          }
        }
      })



    }).catch(function(err) {
      console.error(err.message);
    });
  }

  handleBuy(event) {
    event.preventDefault();

    var planetId = parseInt($(event.target).data('id'));

    // disable button during process
    let btn = this;
    $(btn).text('Processing..').attr('disabled', true);

    // get all accounts of current user
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
      }

      // get first (base) account
      var account = accounts[0];

      linkToApp.contracts.Buy.deployed().then(function(buyInstance) {
        return buyInstance.buy(planetId, {from: account});
      })
      .then(function(result) {
        console.log('buy success!');
        // although it succeed, it still takes time until getCustomers() return updated list of customers
      })
      .then(function(){
        linkToApp.markBuyed();
        // window.location.reload()
      })
      .catch(function(err) {
        // enable button again on error
        $(btn).text('Buy this planet').removeAttr('disabled').addClass('btn-info').removeClass('btn-success');
        console.error(err.message);
      });
    });
  }

  handleSale(event) {
    event.preventDefault();

    var planetId = parseInt($(event.target).data('id'));

    // disable button during process
    let btn = this;
    $(btn).text('Processing..').attr('disabled', true);

    // get all accounts of current user
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
      }

      // get first (base) account
      var account = accounts[0];

      linkToApp.contracts.Buy.deployed().then(function(buyInstance) {
        return buyInstance.sale(planetId, {from: account});
      })
      .then(function(result) {
        console.log('sale success!');
        // although it succeed, it still takes time until getCustomers() return updated list of customers
        linkToApp.markBuyed();
      })
      .then(function(){
        linkToApp.markBuyed();
      })
      .catch(function(err) {
        // enable button again on error
        $(btn).text('Sale this planet').removeAttr('disabled');
        console.error(err.message);
      });
    });
  }

};

$(function() {
  $(window).ready(function() {
    new App();
  });
});
