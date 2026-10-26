# GovRates

A simple API to quickly fetch exchange rates published by the Bank of Canada and Canada Border Services Agency

The objective is to allow a simple way to get a single pair, and also dynamically converting to get a double conversion.


## To Use 

### `GET` /convert
#### Headers
- `Content-Type`: `application/json`
#### Parameters
- `omitSymbol`: `true`: no currency symbol will be prefixed. `false`: currency symbol will be prefixed.
#### Body
- `fromCurrency`: Alphabetic 3 letter code derived from ISO 4217
- `toCurrency`: Alphabetic 3 letter code derived from ISO 4217
- `fromAmount`: Value to be converted

### Response

Will contain amount in plaintext


### `GET` /get
#### Headers
- `Content-Type`: `application/json`
#### Body
- `fromCurrency`: Alphabetic 3 letter code derived from ISO 4217
- `toCurrency`: Alphabetic 3 letter code derived from ISO 4217

### Response
#### Headers
- `Content-Type`: `application/json`

#### Response
```
    [
        {
            "ExchangeRateId":<Number>,
            "Rate":<String> ,
            "ExchangeRateEffectiveTimestamp":ISO 8601 format timestamp <String>,
            "ExchangeRateExpiryTimestamp":"ISO 8601 format timestamp <String>",
            "ExchangeRateSource":<String>,
            "FromCurrency":{
                "Value":"<String|ISO 4217 Code>"
            },
            "FromCurrencyCSN":<Number>,
            "ToCurrency":{
                "Value":"<String|ISO 4217 Code>"
            },
            "ToCurrencyCSN":<Number>
        }
    ]
```
