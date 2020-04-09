import axios from 'axios';

export default class ChangeDate {
    constructor() {
        this.costsContainer = document.querySelector('.costs-container');
        this.loadingCoin = document.querySelector('.lds-circle');
        this.section = document.getElementsByTagName('section')[0];
        this.prevWeekBtn = document.getElementsByClassName('change-week')[0];
        this.nextWeekBtn = document.getElementsByClassName('change-week')[1];
        this.remaining = document.getElementById('remaining');
        this.totalSpent = document.getElementById('total-spent');
        this.startDate = document.getElementById('startDate');
        this.endDate = document.getElementById('endDate');
        this.isLoading = true;
        this.addEvents();
        this.handleLoadingIcon();
        this.renderCosts(new Date());
        this.returnClosestMonday(new Date(2020, 3, 12));
    }

    // Events
    addEvents() {
        this.prevWeekBtn.addEventListener("click", () => this.renderPrevWeek(), { once: true });
        this.nextWeekBtn.addEventListener("click", () => this.renderNextWeek(), { once: true });
    }

    // Methods
    renderCosts(date) {
        let expenses = [];
        setTimeout(() => {
            axios.post(`/fetchExpenses`, { date: date }).then((response) => {
                this.costsContainer.innerHTML = "";
                expenses = response.data[0];
                if (expenses.length) {
                    expenses.forEach((expense) => {
                        this.costsContainer.insertAdjacentHTML('beforeend', `
                        <li class="flex-display-center cost-item">
                            <div class="cost-title">${expense.title}</div>
                            <div class="cost">${expense.ammount}</div>
                            <div class="cost-currency">${expense.currency}</div>
                        </li>
                `)
                    });
                } else {
                    this.costsContainer.insertAdjacentHTML('beforeend', '<li class="padding-15"> No expenses this week. </li>');
                }

                this.totalSpent.innerText = response.data[1];
                this.remaining.innerText = response.data[2];

                this.isLoading = false;
                this.changeDateToggleBtnState();
                this.handleLoadingIcon();
            }).catch((e) => console.log('[changeDate.js]: Post request failed'));
        }, 500);
    }

    changeDateToggleBtnState() {
        if (!this.isLoading) {
            this.prevWeekBtn.classList.remove('disabled');
            this.nextWeekBtn.classList.remove('disabled');
        } else {
            this.prevWeekBtn.classList.add('disabled');
            this.nextWeekBtn.classList.add('disabled');
        }
    }

    handleLoadingIcon() {
        if (this.isLoading) {
            this.section.classList.add("display-none");
            this.loadingCoin.classList.remove('display-none');
        } else {
            this.section.classList.remove("display-none");
            this.loadingCoin.classList.add('display-none');
        }
    }

    renderNextWeek() {
        this.isLoading = true;
        this.changeDateToggleBtnState();
        this.handleLoadingIcon();

        const startDate = this.returnWeekElapsedDate(this.startDate.innerText.trim().split('.'));
        const endDate = this.returnWeekElapsedDate(this.endDate.innerText.trim().split('.'));

        this.renderCosts(startDate);
        this.nextWeekBtn.addEventListener("click", () => this.renderNextWeek(), { once: true });

        this.startDate.innerText = this.returnFormattedDate(startDate);
        this.endDate.innerText = this.returnFormattedDate(endDate);
    }

    renderPrevWeek() {
        this.isLoading = true;
        this.changeDateToggleBtnState();
        this.handleLoadingIcon();

        const startDate = this.returnPrevWeekDate(this.startDate.innerText.trim().split('.'));
        const endDate = this.returnPrevWeekDate(this.endDate.innerText.trim().split('.'));

        this.renderCosts(startDate);
        this.prevWeekBtn.addEventListener("click", () => this.renderPrevWeek(), { once: true });

        this.startDate.innerText = this.returnFormattedDate(startDate);
        this.endDate.innerText = this.returnFormattedDate(endDate);
    }

    returnWeekElapsedDate(dateArray) {
        const weekInteger = 7 * 24 * 60 * 60 * 1000;
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        const weekPassedDate = new Date(date.valueOf() + weekInteger);

        return weekPassedDate;
    }

    returnPrevWeekDate(dateArray) {
        const weekInteger = 7 * 24 * 60 * 60 * 1000;
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        const prevWeekDate = new Date(date.valueOf() - weekInteger);

        return prevWeekDate;
    }

    returnFormattedDate(date) {
        const startYear = `${date.getFullYear()}`;
        const startMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const startDay = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;

        return `${startYear}.${startMonth}.${startDay}`;
    }

    returnClosestMonday(date) {
        const oneDay = 24 * 60 * 60 * 1000;
        let newDate = new Date(date);

        if (newDate.getDay() === 0) {
            newDate = new Date(newDate.valueOf() - (6 * oneDay));
        }

        while (newDate.getDay() !== 1) {
            newDate = new Date(newDate.valueOf() - oneDay);
        }

        this.startDate.innerText = this.returnFormattedDate(newDate);
        this.endDate.innerText = this.returnFormattedDate(new Date(newDate.valueOf() + (7 * oneDay)));

        return newDate;
    }
}