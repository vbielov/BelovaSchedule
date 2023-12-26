import axios from 'axios';
import { ref } from 'vue';
export const BACKEND_ADRESS = "localhost:3000";

export const Service = {
    None: {
        name: 'None',
        duration: 0,
        price: 0
    },
    Manikure: {
        name: "Manikure",
        duration: "(60 min.)",
        price: "40,00€"
    },
    Pedikure: {
        name: "Pedikure",
        duration: "(60 min.)",
        price: "50,00€"
    },
    Manikure_Shellac: {
        name: "Manikure Shellac",
        duration: "(90-120 min.)",
        price: "80,00€"
    },
    Pedikure_Shellac: {
        name: "Pedikure Shellac",
        duration: "(90-120 min.)",
        price: "80,00€"
    }

};

export const Pages = {
    Service: 0,
    Date: 1,
    UserForm: 2,
    Failure: 3,
    Success: 4
}

export class Form {
    constructor(phoneNumber, forename, surname, comment) {
        this.phoneNumber = phoneNumber;
        this.forename = forename;
        this.surname = surname;
        this.comment = comment;
    }
}

class BookBody {
    constructor(service, date, form) {
      this.service = service;
      this.date = date;
      this.form = form;
    }
}

export const pageIndex = ref(Pages.Service);

export function previousPage() {
    pageIndex.value--;
}

function toPage(page) {
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

export var userSelectedService = ref(Service.None);
export var userSelectedDate = ref(undefined);
export var userForm = ref(undefined);

export function selectService(service) {
    userSelectedService.value = service;
    console.log(userSelectedService.value.name);
    toPage(Pages.Date);
}

export function selectDate(date) {
    userSelectedDate.value = formatDateToLocalISO(date);
    console.log(userSelectedDate.value);
    toPage(Pages.UserForm);
}

export function bookAppointment(form) {
    userForm.value = form;

    // TODO: Vertify all inputs are valid locally to, to reduce load on server and delay
    const bookRequest = new BookBody(userSelectedService.value.name, userSelectedDate.value, userForm.value);
    console.log(bookRequest);

    axios.post('http://' + BACKEND_ADRESS + '/api/book', bookRequest)
        .then(response => {
            toPage(Pages.Success);
        })
        .catch(error => {
            console.error('POST error:', error);
            toPage(Pages.Failure);
        }
    );
}

