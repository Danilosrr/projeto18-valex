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