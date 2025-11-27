import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'; 
import { Rates } from './routes/rates';
import { Conversions } from './routes/conversions';


class App {
    public constructor() {
        this.config();
        this.routes()
        this.run();
      }

    public app: Express = express();
    public port = process.env.PORT || 4444;
    public routes(): void {
        this.app.use('/rates', new Rates().router)
        this.app.use('/convert', new Conversions().router)
    }
    public config(): void {
        this.app.use(express.json())
        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(bodyParser.json())
    }
    public run(): void {
        this.app.get('/', async (req: Request, res: Response) => {
          res.send('GovRates API');
        });
        this.app.listen(this.port, () => {
            console.log(`[server]: Server is running at http://localhost:${this.port}`);
        });
    }
}

const app = new App().app
export default app