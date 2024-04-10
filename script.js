'use strict';

// Data
  const currencies= new Map([
    ['USD','&#36;'],
    ['EUR','&euro;'],
    ['GBP','&pound;'],
  ])
  const accounts=new Map([
    ["js",{
      owner: 'Jonas Schmedtmann',
      currencyBalance:'USD',
      movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
      movementDates:['10/03/2024','30/03/2020','17/02/2022','09/02/2024','05/01/2024','08/03/2024','10/02/2020','01/03/2000'],
      interestRate: 1.2, // %
      pin: 1111
    }],
    ["jd",{
      owner: 'Jessica Davis',
      currencyBalance:'USD',
      movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
      movementDates:['10/03/2024','30/03/2020','17/02/2020','09/02/2024','05/11/2024','08/03/2024','12/02/2020','01/03/2000'],
      interestRate: 1.5,
      pin: 2222,
    }],
    ["stw",{
      owner: 'Steven Thomas Williams',
      currencyBalance:'USD',
      movements: [200, -200, 340, -300, -20, 50, 400, -460],
      movementDates:['10/03/2024','30/03/2020','17/02/2022','09/02/2024','05/01/2024','08/03/2024','10/02/2020','01/03/2000'],
      interestRate: 0.7,
      pin: 3333,
    }]
    ,["ss",{
      owner: 'Sarah Smith',
      currencyBalance:'USD',
      movements: [430, 1000, 700, 50, 90],
      movementDates:['10/03/2024','30/03/2020','09/02/2024','05/01/2024','01/03/2000'],
      interestRate: 1,
      pin: 4444,
    }]
  ])

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.balance__date .date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const dateNow=(splitChar='/')=>{
  const date=new Date();
  return date.getDate().toString().padStart(2,'0')+splitChar+date.getMonth().toString().padStart(2,'0')+splitChar+date.getFullYear();
};

// App Functions
const getData=function (account){
  const currency=account.currencyBalance;
  return{
    firstName:`${account.owner.split(' ')[0]}👋`,
    balance(){
      let balance=account.movements.reduce((acc,value)=>acc+value,0);
      switch (currency) {
        case 'GBP':
          balance*=0.79;
          break;
        case 'EUR':
          balance*=0.92;
          break;
      }
      return balance.toFixed(2)+currencies.get(currency);
    },
  }
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Event Scripts ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const currentUser=getData(accounts.get('js'));
labelBalance.innerHTML=currentUser.balance();
labelDate.innerHTML= dateNow();
labelWelcome.innerHTML=`Welcome back, ${currentUser.firstName}`;