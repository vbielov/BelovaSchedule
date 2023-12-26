export const BACKEND_ADRESS = "localhost:3000";

export const Service = {
    None: "None",
    Manikure: "Manikure",
    Pedikure: "Pedikure",
    Combi: "Combi",
};

export class Form {
    constructor(phoneNumber, forename, surname, comment) {
        this.phoneNumber = phoneNumber;
        this.forename = forename;
        this.surname = surname;
        this.comment = comment;
    }
}