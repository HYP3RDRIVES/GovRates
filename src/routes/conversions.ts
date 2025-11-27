import express, { Express, Request, Response } from 'express';   
import { Router } from 'express';  
import currency  from 'currency.js';
export class Conversions {
    router!: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {
    

    this.router.get('/', async (req, res) => {
        const fromCurrency = req.body?.fromCurrency;
        if (!fromCurrency) return res.status(400).json({message:'Missing fromCurrency'})
        const toCurrency = req.body?.toCurrency;
        if (!toCurrency) return res.status(400).json({message:'Missing toCurrency'})
        const fromAmount = currency(req.body?.fromAmount);
        
        let doubleConversion = false;
        let currency1 = "";
        let currency2 = "";
        if (toCurrency != "CAD" && fromCurrency != "CAD") doubleConversion = true;
        else{
            if(fromCurrency === "CAD") {
                currency2 = fromCurrency; 
                currency1 = toCurrency;
            }
            else {
                currency1 = fromCurrency;
                currency2 = toCurrency;
            }
        }
        const govData = await fetch(`${process.env.GOVAPI}`);
        if (!govData.ok){
            return res.status(500).json({message:govData.statusText});
        }
        let currencyData = await govData.json();
        if (!currencyData) return res.status(500).json({message:"An Error Occured"});
        if (doubleConversion){
            return res.status(400).json({message:"Not Yet Implemented"});
        }
        else{
            currencyData = currencyData['ForeignExchangeRates'];
            let item = currencyData.filter(arr=>{
                const matchFrom = arr.FromCurrency.Value == currency1;
                const matchTo = arr.ToCurrency.Value == currency2;
                return matchFrom && matchTo;
            }
            )
            let rate = currency(item[0]['Rate'])
            let finAmt;
            if (fromCurrency === "CAD") finAmt = fromAmount.divide(rate);
            else finAmt = fromAmount.multiply(rate);
            return res.status(200).send(finAmt.format());
        }
    })
}
}