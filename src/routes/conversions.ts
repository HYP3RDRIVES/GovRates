import express, { Express, Request, Response } from 'express';   
import { Router } from 'express';  
import currency  from 'currency.js';

const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    CAD: '$',
    AUD: '$',
    NZD: '$',
    KRW: '₩',
    PKR: 'Rs',
    RON: 'L',
    RUB: '₽',
    PHP: '₱',
    INR: '₹',
    HKD: '$',
    TWD: 'NT$',
    NOK: 'kr ',
    DKK: 'kr ',
};


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
        if (fromCurrency === "JPY" || from)  &&  fromAmount.value  %1 !== 0 ) return res.status(400).json({message:"AN ERROR HAS OCCURED", error:"ILLEGAL AMOUNT"});

        if (toCurrency.toUpperCase() != "CAD" && fromCurrency.toUpperCase() != "CAD") doubleConversion = true;
        else{
            if(fromCurrency === "CAD") {
                currency2 = fromCurrency.toUpperCase(); 
                currency1 = toCurrency.toUpperCase();
            }
            else {
                currency1 = fromCurrency.toUpperCase();
                currency2 = toCurrency.toUpperCase();

            }
        }
        const govData = await fetch(`${process.env.GOVAPI}`);
        if (!govData.ok){
            return res.status(500).json({message:govData.statusText});
        }
        let currencyDataFull = await govData.json();
        if (!currencyDataFull) return res.status(500).json({message:"An Error Occured"});
                
        const currencyData: any[] = currencyDataFull['ForeignExchangeRates'];
        if (doubleConversion){
            let item1 = currencyData.filter((arr: any)=>{

                const matchFrom = arr.FromCurrency.Value == fromCurrency;
                const matchTo = arr.ToCurrency.Value == "CAD";
                return matchFrom && matchTo;
            });
            let item2 = currencyData.filter((arr: any)=>{
                const matchFrom = arr.FromCurrency.Value == toCurrency;
                const matchTo = arr.ToCurrency.Value == "CAD";
                return matchFrom && matchTo;
            })
            const rateConfig = { precision: 6, increment: 0.000001 };
            let rate1 = currency(item1[0]['Rate'], rateConfig);
            let finAmt1 = fromAmount.multiply(rate1);
            let rate2 = currency(item2[0]['Rate'], rateConfig);
            let finAmt2 = finAmt1.divide(rate2);
            console.log(req.query.omitSymbol);
            if (req.query.omitSymbol === 'true') return res.status(200).send(finAmt2.format({symbol: ""}));
            const targetSymbol = currencySymbols[toCurrency] || '$';
            return res.status(200).send(finAmt2.format({ symbol: targetSymbol }));
        }
        else{
            let item = currencyData.filter((arr: any)=>{
                const matchFrom = arr.FromCurrency.Value == currency1;
                const matchTo = arr.ToCurrency.Value == currency2;
                return matchFrom && matchTo;
            }
            )
            let rate = currency(item[0]['Rate'])
            let finAmt;
            if (fromCurrency === "CAD") finAmt = fromAmount.divide(rate);
            else finAmt = fromAmount.multiply(rate);
            if (req.query.omitSymbol === 'true') return res.status(200).send(finAmt.format({symbol: ""}));
            const targetSymbol = currencySymbols[toCurrency] || '$';
            return res.status(200).send(finAmt.format({ symbol: targetSymbol }));
        }
    })
}
}
