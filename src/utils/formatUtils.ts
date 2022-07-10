import Cryptr from "cryptr";

export function formatDate(data:Date){
    const month = data.getUTCMonth()+1;
    const year = data.getUTCFullYear();
    
    const formatedDate = month + "/" + year;
    return formatedDate;
};

export function expireDate(data:Date){
    const month = data.getUTCMonth()+1;
    const year = data.getUTCFullYear();
    const validity = 5;

    const expirationDate = month + "/" + (year + validity);
    return expirationDate;
};

export function dateExpired(date:Date,expiration:string){
    const formatedDate = formatDate(date);
    const expirationYear = +expiration.split('/')[1];
    const expirationMonth = +expiration.split('/')[0];
    const dateYear = +formatedDate.split('/')[1];
    const dateMonth = +formatedDate.split('/')[0];

    console.log(formatedDate,expiration);

    if(dateYear > expirationYear){
        return true;

    } else  if(dateYear == expirationYear){
        if(dateMonth > expirationMonth){ return true };
        return false;

    }else{ return false; } 
};

export function formatName(name: string) {
    const minLength = 3;
    const nameArray = name.split(" ");
    const nameShortened:string[] = [];
    
    nameArray.forEach((name,index) =>{ 
        if (name.length>minLength && index != 0 && index != nameArray.length-1) {
            nameShortened.push(name[0]);
        } else {
            nameShortened.push(name);
        }
    })
    return nameShortened.join(" ");
};

export function encrypt(decryptedPassword){
    const cryptrKey = process.env.CRYPTR_KEY || 'cryptr';
    const cryptr = new Cryptr(cryptrKey);

    const encryptedPassword = cryptr.encrypt(decryptedPassword);

    return encryptedPassword;
};

export function decrypt(encryptedPassword){
    const cryptrKey = process.env.CRYPTR_KEY || 'cryptr';
    const cryptr = new Cryptr(cryptrKey);

    const decryptedPassword = cryptr.decrypt(encryptedPassword);

    return decryptedPassword;
};