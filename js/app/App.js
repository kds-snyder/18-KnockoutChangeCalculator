function AppViewModel() {
  var self = this;

  self.amountDueForSale = ko.observable();
  self.amountReceived = ko.observable();

  // Array to hold dollar/coin values, highest to lowest
  var coinValue = [1.0, .25, .1, .05, .01];
  // Array to hold the change amounts, corresponding to coinValues array
  var coinAmount = [0, 0, 0, 0, 0];
  // Index values
  var indexDollars = 0;
  var indexQuarters = 1;
  var indexDimes = 2;
  var indexNickels = 3;
  var indexPennies = 4;

  // Compute the change amounts and store them in coinAmount
  function computeChange(change) {

    var changeLeft = change;

    // For each coin type, calculate the number of coins needed:
    //  it is the change left divided by coin value, rounded down to nearest integer
    for (var i = 0; i < coinValue.length; i++) {
      coinAmount[i] = Math.floor(changeLeft / coinValue[i]);
      changeLeft = changeLeft % coinValue[i];
    }
    return true;
  }

  // Validate that input is a positive number with no more than two decimal places
  function validateMoney(input) {

    if (isNaN(input)) {
      return false;
    }

    if (input <= 0) {
      return false;
    }

    return true;
  };


  // Return the amount of change to give, and compute the amounts of each change type
  // Return 0 if the amount received or the amount due is not a valid money amount,
  //  or if the amount received is less than the amount due
  self.changeAmount = ko.computed(function() {

    if (validateMoney(self.amountReceived()) &&
        validateMoney(self.amountDueForSale())) {
      if (self.amountReceived() >= self.amountDueForSale()) {
        var change =  self.amountReceived() - self.amountDueForSale();
        //computeChange(change);
        return change;
      }
      else {
        return 0;
      }
    }
    else {
      return 0;
    }

  });

  // Return the change, formatted with $ and two decimal places
  self.formattedChange = ko.computed(function() {
    return '$' + self.changeAmount().toFixed(2);
  });


    self.dollars = ko.computed(function() {
        //return coinAmount[indexDollars];
        return Math.floor(self.changeAmount());
    });

    self.quarters = ko.computed(function() {
        //return coinAmount[indexQuarters];
        return Math.floor((self.changeAmount() - self.dollars())/0.25);
    });

    self.dimes = ko.computed(function() {
        //return coinAmount[indexDimes];
        //var changeLeft = self.changeAmount() - self.dollars();
        //return Math.floor((changeLeft % 0.25)/0.10);
        var changeLeft = self.changeAmount() -
                          self.dollars() - (self.quarters()*0.25);
        //return changeLeft;
        return Math.floor(changeLeft/0.10);
    });

    self.nickels = ko.computed(function() {
        //return coinAmount[indexNickels];
        var changeLeft = self.changeAmount() -
                          self.dollars() - (self.quarters()*0.25) -
                            (self.dimes()*.10);
        //return changeLeft;
        return Math.floor(changeLeft/0.05);
    });

    self.pennies = ko.computed(function() {
        //return coinAmount[indexPennies];
        var changeLeft = self.changeAmount() -
                          self.dollars() - (self.quarters()*0.25) -
                            (self.dimes()*.10) - (self.nickels()*.05);
        //return changeLeft;
        return Math.floor(changeLeft/0.01);
    });

};

ko.applyBindings(new AppViewModel());
