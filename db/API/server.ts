    const express = require('express')
    const app = express();

    app.get('/api/health', (req: any, res: any) => {
        res.send('OK')
    })

    const port = process.env.PORT || 5000


    app.listen(port, () => {
        console.log(`DB API running on port ${port}`)
    })