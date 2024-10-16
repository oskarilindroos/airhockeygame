import express from 'express';
import { router } from "./router.js";

const app = (express as any)();

app.get('/health', (req: any, res: any) => {
    res.send('OK!')
})

const port = process.env.PORT || 5000;

app.use("/rooms", router);


app.listen(port, () => {
    console.log(`DB API running on port ${port}`)
})