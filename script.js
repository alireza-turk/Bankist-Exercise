'use strict';

// Data
const currencies = new Map([
    ['USD', '&#36;'],
    ['EUR', '&euro;'],
    ['GBP', '&pound;'],
])
const accounts = new Map([
    ["js", {
        owner: 'Jonas Schmedtmann',
        currencyBalance: 'USD',
        movements: new Map([[200, '01/03/2000'], [450, '10/02/2020'], [-400, '08/03/2024'], [3000, '05/01/2024'], [-650, '09/02/2024'], [-130, '17/02/2022'], [70, '30/03/2020']]),
        interestRate: 1.2, // %
        pin: 1111
    }],
    ["jd", {
        owner: 'Jessica Davis',
        currencyBalance: 'USD',
        movements: new Map([[5000, '01/03/2000'], [3400, '12/02/2020'], [-150, '08/03/2024'], [-790, '05/11/2024'], [-3210, '09/02/2024'], [-1000, '17/02/2020'], [8500, '30/03/2020'], [-30, '10/03/2024']]),
        interestRate: 1.5,
        pin: 2222,
    }],
    ["stw", {
        owner: 'Steven Thomas Williams',
        currencyBalance: 'USD',
        movements: new Map([[200, '01/03/2000'], [-200, '10/02/2020'], [340, '08/03/2024'], [-300, '05/01/2024'], [-20, '09/02/2024'], [50, '17/02/2022'], [400, '30/03/2020'], [-460, '10/03/2024']]),
        interestRate: 0.7,
        pin: 3333,
    }]
    , ["ss", {
        owner: 'Sarah Smith',
        currencyBalance: 'USD',
        movements: new Map([[430, '01/03/2000'], [1000, '05/01/2024'], [700, '09/02/2024'], [50, '30/03/2020'], [90, '10/03/2024']]),
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

const btnsSort = document.querySelectorAll('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const dateNow = (splitChar = '/') => {
    const date = new Date();
    return date.getDate().toString().padStart(2, '0') + splitChar + date.getMonth().toString().padStart(2, '0') + splitChar + date.getFullYear();
};

// App Functions
const getData = function (account) {
    const currency = account.currencyBalance;
    const movementsArr = [...account.movements.keys()];
    const movementDatesArr = [...account.movements.values()];
    return {
        firstName: `${account.owner.split(' ')[0]}👋`,
        balance(arr = movementsArr) {
            return this.changeCurrency(arr.reduce((acc, value) => acc + value, 0));
        },
        changeCurrency(balance) {
            switch (currency) {
                case 'GBP':
                    balance *= 0.79;
                    break;
                case 'EUR':
                    balance *= 0.92;
                    break;
            }
            return balance.toFixed(2) + currencies.get(currency);
        },
        sumIn() {
            return this.balance(movementsArr.filter(value => value > 0));
        },
        sumOut() {
            return this.balance(movementsArr.filter(value => value < 0)).slice(1);
        },
        sumInterest() {
            return this.changeCurrency(movementsArr
                .filter(mov => mov > 0)
                .map(deposit => (deposit * account.interestRate) / 100)
                .filter((int) => {
                    return int >= 1;
                })
                .reduce((acc, int) => acc + int, 0));
        },
        showMovements(sort) {
            let movementsArrSorted;
            if (sort === 'desc') movementsArrSorted = movementsArr.sort((a, b) => a - b);
            else if (sort === 'asc') movementsArrSorted = movementsArr.sort((a, b) => b - a);
            else movementsArrSorted = movementsArr;
            movementsArrSorted.forEach((value, i) => {
                const movementType = (value > 0) ? 'deposit' : 'withdrawal';
                const movementContent = `
                <div class="movements__row">
                    <div class="movements__type movements__type--${movementType}">${i + 1} ${movementType.toLocaleUpperCase()}</div>
                    <div class="movements__date">${account.movements.get(value)}</div>
                    <div class="movements__value">${this.changeCurrency(value)}</div>
                </div>
                `;
                containerMovements.insertAdjacentHTML('afterbegin', movementContent);
            })
        }
    }
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Event Scripts ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const currentUser = getData(accounts.get('js'));
labelBalance.innerHTML = currentUser.balance();
labelDate.innerHTML = dateNow();
labelWelcome.innerHTML = `Welcome back, ${currentUser.firstName}`;
labelSumIn.innerHTML = currentUser.sumIn();
labelSumOut.innerHTML = currentUser.sumOut();
labelSumInterest.innerHTML = currentUser.sumInterest();
currentUser.showMovements();