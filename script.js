'use strict';
const $ = document;
const labelWelcome = $.querySelector('.welcome');
const labelDate = $.querySelector('.balance__date .date');
const labelBalance = $.querySelector('.balance__value');
const labelSumIn = $.querySelector('.summary__value--in');
const labelSumOut = $.querySelector('.summary__value--out');
const labelSumInterest = $.querySelector('.summary__value--interest');
const containerMovements = $.querySelector('.movements');

const btnsSort = $.querySelectorAll('.btn--sort');
const btnSortAsc = $.querySelector('.btn--sort.btn--sort__ascending');
const btnSortDesc = $.querySelector('.btn--sort.btn--sort__descending');

const btnFormLoan = $.querySelector('.form--loan .form__btn--loan');
const inputFormLoan = $.querySelector('.form--loan .form__input--loan-amount');

const btnProfile = $.querySelector('.profile-btn');
const containerProfile = $.querySelector('.profile-container');
const formLogin = containerProfile.querySelector('.profile-login');
const inputLoginUserName = formLogin.querySelector('#inputL-username');
const inputLoginPass = formLogin.querySelector('#inputL-pass');
const btnLoginSubmit = formLogin.querySelector('.btn-submit');
const btnLogOut = $.querySelector('.btn--close');

const profile = containerProfile.querySelector('.profile');
const inputProfileCurrency = profile.querySelector('#input-currency');
const inputProfilePass = profile.querySelector('#input-pass');
const btnProfileSubmit = profile.querySelector('.profile-submit');

const formTransfer = $.querySelector('.form--transfer');
const inputTransferTo = formTransfer.querySelector('.form__input--to');
const inputTransferAmount = formTransfer.querySelector('.form__input--amount');
const btnTransferSubmit = formTransfer.querySelector('.form__btn--transfer');

const timerElm = $.querySelector('.logout-timer .timer');
// Data
let accounts = {
    js: {
        owner: 'Jonas Schmedtmann',
        currencyBalance: 'USD',
        locale: 'en-US',
        movements: [
            [200, '01/03/2000'],
            [-400, '08/04/2024'],
            [3000, '07/04/2024'],
            [-650, '09/02/2024'],
            [-130, '17/02/2022'],
            [70, '30/03/2020'],
        ],
        interestRate: 1.2, // %
        pin: '1111'
    },
    jd: {
        owner: 'Jessica Davis',
        currencyBalance: 'GBP',
        locale: 'en-UK',
        movements: [
            [5000, '01/03/2000'],
            [3400, '12/02/2020'],
            [-3210, '07/04/2024'],
            [-1000, '17/02/2020'],
            [8500, '30/03/2020'],
            [-30, '05/04/2024']
        ],
        interestRate: 1.5,
        pin: '2222',
    },
    stw: {
        owner: 'Steven Thomas Williams',
        currencyBalance: 'GBP',
        locale: 'en-UK',
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
        locale: 'en-US',
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
let timerSecond = 300;

// App Functions
const get = function (account) {
    const currency = account.currencyBalance;
    let movementsArr = [...account.movements.values()].map(movement => movement[0]);
    return {
        firstName: `${account.owner.split(' ')[0]}👋`,
        balance(arr = movementsArr) {
            return this.changeCurrency(Math.abs(arr.reduce((acc, value) => acc + value, 0)));
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
            return new Intl.NumberFormat(account.locale, {
                style: 'currency',
                currency: currency
            }).format(balance);
        },
        sumIn() {
            return this.balance(movementsArr.filter(value => value > 0));
        },
        sumOut() {
            return this.balance(movementsArr.filter(value => value < 0));
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
                    <div class="movements__date">${this.calcDaysPassed(account.movements[i][1])}</div>
                    <div class="movements__value">${this.changeCurrency(value)}</div>
                </div>
                `;
                containerMovements.insertAdjacentHTML('afterbegin', movementContent);
            })
        },
        calcDaysPassed(dateMov) {
            const dateArr = dateMov.split('/').map(value => +value);
            const daysPassed = Math.trunc((new Date() - new Date(dateArr[2], dateArr[1], dateArr[0])) / (1000 * 60 * 60 * 24));
            switch (daysPassed) {
                case 0:
                    return "Today"
                case 1:
                    return "Yesterday"
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    return `${daysPassed} days ago`
                default:
                    return dateMov
            }
        },
        addBalance(amount) {
            account.movements.push([parseFloat(amount), this.dateNow()]);
            movementsArr = [...account.movements.values()].map(movement => movement[0]);
            setData('userTarget', account);
        },
        changeProfile(currency = 'USD', pass = '1111') {
            account.currencyBalance = currency.toUpperCase();
            account.pin = pass.toUpperCase();
            currentUser = get(account);
            setData('userTarget', account);
            showData(currentUser);
        },
        dateNow() {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            return new Intl.DateTimeFormat(account.locale, options).format(new Date());
        }
    }
}
const showData = function (currentUser) {
    currentUser.showMovements();
    labelSumIn.innerHTML = currentUser.sumIn();
    labelSumOut.innerHTML = currentUser.sumOut();
    labelSumInterest.innerHTML = currentUser.sumInterest();
    labelBalance.innerHTML = currentUser.balance();
    labelDate.innerHTML = currentUser.dateNow();
}
const showNote = function (message = 'this is Notification', state = 'info') {
    const noteDiv = $.querySelector(".notification");
    const noteTitle = noteDiv.querySelector('.note-title');
    const noteDes = noteDiv.querySelector('.note-des');
    if (!noteDiv.classList.contains('active')) {
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
        setTimeout(() => noteDiv.classList.remove('active'), 3000)

    }
}
const setData = function (key, item) {
    localStorage.setItem(key, JSON.stringify(item));
    localStorage.setItem('accounts', JSON.stringify(accounts));
}
const getData = function () {
    try {
        let user = JSON.parse(localStorage.getItem('userTarget'));
        let data = JSON.parse(localStorage.getItem('accounts'));
        let time = JSON.parse(localStorage.getItem('timerSecond'));
        if (user && data) {
            containerProfile.classList.remove('active');
            formLogin.style.display = "none";
            profile.style.display = "flex";

            timerSecond = time;
            currentUser = get(user);
            accounts = data;
            showData(currentUser);
            inputProfilePass.value = user.pin;
            inputProfileCurrency.querySelector(`option[value='${user.currencyBalance}']`).selected = true;
            $.querySelector('.app').style.display = 'grid';
            labelWelcome.innerHTML = `Welcome back, ${currentUser.firstName}`;
            showNote('Welcome to your account.', 'info');
        }
    } catch (e) {
        formLogin.style.display = "flex";
        profile.style.display = "none";
    }

}
getData();

timerElm.innerHTML = `${parseInt(`${timerSecond / 60}`).toString().padStart(2, '0')}:${(timerSecond % 60).toString().padStart(2, '0')}`;
const timerFn = function () {
    if (timerSecond <= 0) {
        closeAccount();
        showNote('Your account\'s active timer has expired, please try again to log in again', 'info');
    } else {
        timerSecond--;
        timerElm.innerHTML = `${parseInt(`${timerSecond / 60}`).toString().padStart(2, '0')}:${(timerSecond % 60).toString().padStart(2, '0')}`;
        localStorage.setItem('timerSecond', JSON.stringify(timerSecond));
    }
}

let timer;
if (currentUser) {
    timer = setInterval(timerFn, 1000);
}

const closeAccount = function () {
    setData('userTarget');
    containerProfile.classList.remove('active');
    formLogin.style.display = "flex";
    profile.style.display = "none";
    $.querySelector('.app').style.display = 'none';
    labelWelcome.innerHTML = `Log in to get started`;
    clearInterval(timer);
    localStorage.setItem('timerSecond', JSON.stringify(300));
}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Event Scripts ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
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
btnFormLoan.addEventListener('click', (e) => {
    e.preventDefault();
    const loanAmount = inputFormLoan.value;
    parseFloat(loanAmount) > 0 && currentUser.addBalance(loanAmount);
    showData(currentUser);
    inputFormLoan.value = "";
})

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
btnProfile.addEventListener('click', () => containerProfile.classList.toggle('active'));

btnLoginSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const userTarget = accounts[inputLoginUserName.value]
    if (userTarget) {
        if (inputLoginPass.value === userTarget.pin) {
            showNote('Welcome to your account.', 'info');
            containerProfile.classList.remove('active');
            formLogin.style.display = "none";
            profile.style.display = "flex";

            currentUser = get(userTarget);
            timerSecond = 300;
            timer = setInterval(timerFn, 1000);
            setData('userTarget', userTarget);
            showData(currentUser);
            inputProfileCurrency.querySelector(`option[value='${userTarget.currencyBalance}']`).selected = true;
            inputProfilePass.value = userTarget.pin;
            $.querySelector('.app').style.display = 'grid';
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
btnLogOut.addEventListener('click', () => closeAccount())
btnTransferSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    if (inputTransferTo.value !== '') {
        if (inputTransferAmount.value !== '') {
            if (accounts[inputTransferTo.value]) {
                if (+inputTransferAmount.value <= 0) {
                    showNote('Please enter a suitable and calculable amount', 'warn');
                } else {
                    const currentBalance = (currentUser.balance().slice(0, currentUser.balance().indexOf('&')));
                    if (+inputTransferAmount.value <= currentBalance) {
                        accounts[inputTransferTo.value].movements.push([+inputTransferAmount.value, currentUser.dateNow()])
                        currentUser.addBalance((+inputTransferAmount.value) - (+inputTransferAmount.value * 2));
                        inputTransferAmount.value = '';
                        inputTransferTo.value = '';
                        showData(currentUser);
                    } else {
                        showNote('Your account balance is insufficient', 'error');
                    }
                }
            } else {
                showNote('Your desired user was not found', 'error');
            }
        } else {
            showNote('Please enter your desired amount', 'warn');
        }
    } else {
        showNote('Please enter your desired username', 'warn');
    }
})