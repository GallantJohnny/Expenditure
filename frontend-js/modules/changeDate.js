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
        this.isLoading = true;
        this.handleLoadingIcon();
        this.renderCosts();
    }

    // Events
    addEvents(){
        this.prevWeekBtn.addEventListener("onclick", this.renderPrevWeek());
        this.nextWeekBtn.addEventListener("onclick", this.renderNextWeek());
    }

    // Methods
    renderCosts() {
        let expenses = [];
        setTimeout(() => {
            axios.post(`/fetchExpenses`, { date: new Date() }).then((response) => {
            expenses = response.data[0];
            console.log(expenses);
            if (expenses) {
                expenses.forEach((expense) => {
                    this.costsContainer.insertAdjacentHTML('beforeend', `
                        <li class="flex-display-center cost-item">
                            <div class="cost-title">${expense.title}</div>
                            <div class="cost">${expense.ammount}</div>
                            <div class="cost-currency">${expense.currency}</div>
                        </li>
                `)
                });
                this.totalSpent.innerText = response.data[1];
                this.remaining.innerText = response.data[2];
                this.isLoading = false;
                this.handleLoadingIcon();
            } else {
                this.costsContainer.insertAdjacentHTML("beforeend", "<li> Looks like your expenditure is empty. </li>");
                this.isLoading = false;
                this.handleLoadingIcon();
            }
        }).catch((e) => console.log('[changeDate.js]: Post request failed'));
        }, 2000);
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

    renderNextWeek(){

    }

    renderPrevWeek(){

    }
}