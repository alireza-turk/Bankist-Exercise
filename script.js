'use strict';

// Data
const currencies = {
    USD: '&#36;',
    EUR: '&euro;',
    GBP: '&pound;'
}
const accounts = {
    js: {
        owner: 'Jonas Schmedtmann',
        currencyBalance: 'EUR',
        movements: [
            [200, '01/03/2000'],
            [-400, '08/03/2024'],
            [3000, '05/01/2024'],
            [-650, '09/02/2024'],
            [-130, '17/02/2022'],
            [70, '30/03/2020'],
        ],
        interestRate: 1.2, // %
        pin: '1111'
    },
    jd: {
        owner: 'Jessica Davis',
        currencyBalance: 'USD',
        movements: [
            [5000, '01/03/2000'],
            [3400, '12/02/2020'],
            [-3210, '09/02/2024'],
            [-1000, '17/02/2020'],
            [8500, '30/03/2020'],
            [-30, '10/03/2024']
        ],
        interestRate: 1.5,
        pin: '2222',
    },
    stw: {
        owner: 'Steven Thomas Williams',
        currencyBalance: 'USD',
        movements: [
            [200, '01/03/2000'],
            [-200, '10/02/2020'],
            [-20, '09/02/2024'],
            [50, '17/02/2022'],
            [400, '30/03/2020'],
            [-460, '10/03/2024']
        ],
        interestRate: 0.7,
        pin: '3333',
    },
    ss: {
        owner: 'Sarah Smith',
        currencyBalance: 'USD',
        movements: [
            [430, '01/03/2000'],
            [1000, '05/01/2024'],
            [700, '09/02/2024'],
            [50, '30/03/2020'],
            [90, '10/03/2024']
        ],
        interestRate: 1,
        pin: '4444',
    }
}
let currentUser;

// Elements
const $ = document;
const labelWelcome = $.querySelector('.welcome');
const labelDate = $.querySelector('.balance__date .date');
const labelBalance = $.querySelector('.balance__value');
const labelSumIn = $.querySelector('.summary__value--in');
const labelSumOut = $.querySelector('.summary__value--out');
const labelSumInterest = $.querySelector('.summary__value--interest');
const labelTimer = $.querySelector('.timer');
const containerMovements = $.querySelector('.movements');

const dateNow = (splitChar = '/') => {
    const date = new Date();
    return date.getDate().toString().padStart(2, '0') + splitChar + date.getMonth().toString().padStart(2, '0') + splitChar + date.getFullYear();
};

// App Functions
const getData = function (account) {
    const currency = account.currencyBalance;
    let movementsArr = [...account.movements.values()].map(([amount, amountDate]) => amount);
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
            return balance.toFixed(2) + currencies[currency];
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
        showMovements(sort = 'none') {
            containerMovements.innerHTML = '';
            let movementsArrSorted = [...account.movements.map(a => a[0])];
            if (sort === 'desc') movementsArrSorted.sort((a, b) => a - b);
            else if (sort === 'asc') movementsArrSorted.sort((a, b) => b - a);
            movementsArrSorted.forEach((value, i) => {
                const movementType = (value > 0) ? 'deposit' : 'withdrawal';
                const movementContent = `
                <div class="movements__row">
                    <div class="movements__type movements__type--${movementType}">${i + 1} ${movementType.toLocaleUpperCase()}</div>
                    <div class="movements__date">${account.movements[i][1]}</div>
                    <div class="movements__value">${this.changeCurrency(value)}</div>
                </div>
                `;
                containerMovements.insertAdjacentHTML('afterbegin', movementContent);
            })
        },
        addBalance(amount) {
            account.movements.push([parseFloat(amount), dateNow()]);
            movementsArr = [...account.movements.values()].map(([amount, amountDate]) => amount);
        },
        changeProfile(currency = 'USD', pass = '1111') {
            account.currencyBalance = currency.toUpperCase();
            account.pin = pass.toUpperCase();
            currentUser = getData(account);
            showData(currentUser);
        }
    }
}

const showData = function (currentUser) {
    currentUser.showMovements();
    labelSumIn.innerHTML = currentUser.sumIn();
    labelSumOut.innerHTML = currentUser.sumOut();
    labelSumInterest.innerHTML = currentUser.sumInterest();
    labelBalance.innerHTML = currentUser.balance();
    labelDate.innerHTML = dateNow();
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Event Scripts ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const btnsSort = $.querySelectorAll('.btn--sort');
const btnSortAsc = $.querySelector('.btn--sort.btn--sort__ascending');
const btnSortDesc = $.querySelector('.btn--sort.btn--sort__descending');
btnsSort.forEach(btnSort => {
    btnSort.addEventListener('click', () => {
        if (btnSort.classList.contains('active')) {
            btnSort.classList.remove('active');
            currentUser.showMovements();
        } else {
            if (btnSort.classList.contains('btn--sort__ascending')) {
                btnSortDesc.classList.remove('active');
                btnSort.classList.add('active');
                currentUser.showMovements('asc');
            } else if (btnSort.classList.contains('btn--sort__descending')) {
                btnSortAsc.classList.remove('active');
                btnSort.classList.add('active');
                currentUser.showMovements('desc');
            } else {
                currentUser.showMovements();
            }
        }
    })
})
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const btnFormLoan = $.querySelector('.form--loan .form__btn--loan');
const inputFormLoan = $.querySelector('.form--loan .form__input--loan-amount');
btnFormLoan.addEventListener('click', (e) => {
    e.preventDefault();
    const loanAmount = inputFormLoan.value;
    parseFloat(loanAmount) > 0 && currentUser.addBalance(loanAmount);
    showData(currentUser);
    inputFormLoan.value = "";
})

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const btnProfile = $.querySelector('.profile-btn');
const containerProfile = $.querySelector('.profile-container');
const formLogin = containerProfile.querySelector('.profile-login');
const inputLoginUserName = formLogin.querySelector('#inputL-username');
const inputLoginPass = formLogin.querySelector('#inputL-pass');
const btnLoginSubmit = formLogin.querySelector('.btn-submit');

const profile = containerProfile.querySelector('.profile');
const inputProfileCurrency = profile.querySelector('#input-currency');
const inputProfilePass = profile.querySelector('#input-pass');
const btnProfileSubmit = profile.querySelector('.profile-submit');
btnProfile.addEventListener('click', () => containerProfile.classList.toggle('active'));

const showNote = function (message = 'this is Notification', state = 'info') {
    const noteDiv = $.querySelector(".notification");
    const noteTitle = noteDiv.querySelector('.note-title');
    const noteDes = noteDiv.querySelector('.note-des');

    switch (state) {
        case "info":
            noteDiv.style.backgroundColor = "#d3e6f2";
            noteTitle.innerHTML = "<img src=\"info-icon.png\" alt=\"notification icon\"><span>Info</span>";
            break;
        case "warn":
            noteDiv.style.backgroundColor = "#ffe3a7";
            noteTitle.innerHTML = "<img src=\"warning-icon.png\" alt=\"notification icon\"><span>Warning</span>";
            break;
        case "error":
            noteDiv.style.backgroundColor = "#f8ced8";
            noteTitle.innerHTML = "<img src=\"error-icon.webp\" alt=\"notification icon\"><span>Error</span>";
            break;
    }
    noteDes.innerHTML = message;
    noteDiv.classList.add('active');
    setTimeout(() => noteDiv.classList.remove('active'), 5000)
}
btnLoginSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const userTarget = accounts[inputLoginUserName.value]
    if (userTarget) {
        if (inputLoginPass.value === userTarget.pin) {
            showNote('Welcome to your account.', 'info');
            containerProfile.classList.remove('active');
            formLogin.style.display = "none";
            profile.style.display = "flex";

            currentUser = getData(userTarget);
            showData(currentUser);
            inputProfileCurrency.querySelector(`option[value='${userTarget.currencyBalance}']`).selected = true;
            inputProfilePass.value = userTarget.pin;
            $.querySelector('.app').style.opacity = '1';
            labelWelcome.innerHTML = `Welcome back, ${currentUser.firstName}`;
        } else {
            showNote('The password entered is not correct', 'error');
        }
    } else {
        showNote('The username entered was not found', 'warn');
    }
})
btnProfileSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    if (inputProfilePass.value) {
        currentUser.changeProfile(inputProfileCurrency.value, inputProfilePass.value);
        containerProfile.classList.remove('active');
        showNote('Your account settings have been successfully completed', 'info')
    } else {
        showNote('Please choose a suitable password for your account', 'warn');
    }
})