const puppeteer = require("puppeteer-core");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 9000;
app.use(cors());

app.get("/pdfgnjob/download/:filename/:query", async (req, res) => {
    try {
        let filename = req.params.filename;
        let query = req.params.query;


        const browser = await puppeteer.launch({
            headless: "new",
                executablePath: "/usr/bin/chromium-browser",

            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-software-rasterizer"
            ]
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        page.setDefaultTimeout(0);

        await page.goto("https://jobonet.ir/my/job-analysis?" + query, {
            waitUntil: "networkidle0",
            timeout: 0
        });

        const pdfBuffer = await page.pdf({
            printBackground: true,
            landscape: false,
            width: "990px",
            height: "1404px",
            timeout: 0,

        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${filename}.pdf`
        );
        res.send(pdfBuffer);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
