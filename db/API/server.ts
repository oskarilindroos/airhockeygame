import express, {Express} from 'express';
import cors from 'cors'
import { router } from "./router.js";

const acceptedOrigins = [
 `${process.env.SERVER_ADDRESS}`
]


const app: Express = express();
app.use(express.json());
app.use(cors({origin: acceptedOrigins}));

app.get('/rooms/health', (req: any, res: any) => {
    res.send('OK!')
})

const port = process.env.PORT || 5000;

app.use("/rooms", router);


app.listen(port, () => {
    console.log(`DB API running on port ${port}`)
})