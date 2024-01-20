import axios from 'axios';
import { ref } from 'vue';
export const BACKEND_ADRESS = "localhost:3000";

export const Pages = {
    Service: 0,
    Calendar: 1,
    Date: 2,
    UserForm: 3,
    Failure: 4,
    Success: 5
}

export class Form {
    constructor(phoneNumber, email, forename, surname, comment) {
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.forename = forename;
        this.surname = surname;
        this.comment = comment;
    }
}

class BookBody {
    constructor(serviceID, date, form) {
      this.serviceID = serviceID;
      this.date = date;
      this.form = form;
    }
}

export const pageIndex = ref(Pages.Service);

export function previousPage() {
    pageIndex.value--;
}

export function toPage(page) {
    pageIndex.value = page;
}

function formatDateToLocalISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ":00.000+01:00";
}

export const userSelectedService = ref(-1);
export const userSelectedDay = ref(undefined);
export const userSelectedDate = ref(undefined);
export const userForm = ref(undefined);

export const eventOnSelectDay = new Event("onSelectDay");
export function selectDay(date) {
    console.log(date);
    userSelectedDay.value = date;
    userSelectedDay.value.setHours(0, 0, 0, 0);
    document.dispatchEvent(eventOnSelectDay);

    if(pageIndex.value === Pages.Calendar) {
        toPage(Pages.Date);
    }
}
selectDay(new Date(Date.now()));

export function selectService(service) {
    userSelectedService.value = service;
    console.log(userSelectedService.value.name);
    toPage(Pages.Calendar);
}

export function selectDate() {
    console.log(userSelectedDate.value);
    toPage(Pages.UserForm);
}

export function openCalendar() {
    toPage(Pages.Calendar);
}

export function bookAppointment(form) {
    userForm.value = form;

    // TODO: Vertify all inputs are valid locally to, to reduce load on server and delay
    const bookRequest = new BookBody(userSelectedService.value.id, formatDateToLocalISO(userSelectedDate.value), userForm.value);
    console.log(bookRequest);

    axios.post('https://' + BACKEND_ADRESS + '/api/book', bookRequest)
        .then(response => {
            toPage(Pages.Success);
        })
        .catch(error => {
            console.error('POST error:', error);
            toPage(Pages.Failure);
        }
    );
}

