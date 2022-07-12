<p align="center">
  <h3 align="center">
    Valex  
  </h3>
</p>

## Usage

```bash
$ git clone https://github.com/Danilosrr/projeto18-valex

$ cd projeto18-valex

$ npm install

$ npm run dev
```

## API:

```
- POST /cards/create
    - Route to create new card
    - headers: {  "x-api-key": "company api key"  }
    - body: {
        "employeeId": 1,
        "type": "groceries" | "restaurant" | "transport" | "education" | "health"
    }
 ```
 ```
- POST /cards/activate/:id
    - Route where employees can activate cards
    - id param: card identifier 
    - body: {
        "password": "1234",
        "CVC": "123"
    }
 ```
 ```
- POST /recharge/:id
    - Route where companies can recharge employee cards
    - id param: card identifier 
    - headers: {  "x-api-key": "company api key"  }
    - body: {
        "amount": 9999
    }
```
```
- POST /buy
    - Route where buys can be done by employees
    - headers: {}
    - body: {
        "cardId": 1,
        "password": "1234",
        "businessId": 1,
        "amount": 9999
    }
```
```
- GET /cards/view/balance/:id
    - Route where employees can see their balance
    - id param: card identifier 
    - headers: {}
    - body: {}
```
```
- POST /cards/block/:id
    - Route where employees can block their cards
    - id param: card identifier 
    - headers: {}
    - body: {
        "password": "1234",
        "CVC": "123"
    }
```
```
- POST /cards/unblock/:id
    - Route where employees can unblock their cards
    - id param: card identifier 
    - headers: {}
    - body: {
        "password": "1234",
        "CVC": "123"
    }
```

## Deploy
The API is deployed at the link: https://projeto18-valex-danilo.herokuapp.com/
