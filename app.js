const puppeteerCore = require("puppeteer-core");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 9000;
app.use(cors());

app.get("/pdfgn/download/:filename", async (req, res) => {
    try {
        let filename = req.params.filename;
        // Execute the function
        // Launch Puppeteer Core with the specified executable path and headless mode set to false

        const browser = await puppeteerCore.connect({
            browserWSEndpoint:
                "wss://cranky-stonebraker-yf01bsczof.liara.run?token=f8SQ43ERLf6f8KuNRcuw",
            timeout: 0,
        });

        // const browser = await puppeteerCore.launch({
        //     headless: false,
        //     executablePath:
        //         "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        // });

        // Open a new page
        const page = await browser.newPage();

        // Set viewport size to 1920px width and specify a height (e.g., 1080px)
        // await page.setViewport({ width: 500, height: 720 });

        // Emulate media type to 'screen'
        // await page.emulateMediaType("screen");

        // Navigate to the specified URL
        await page.goto(
            `https://jobonet.ir/my/job-analysis?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyNDMzMTQ3NCwiZXhwIjoxNzI0NDE3ODc0fQ.kL8XQV3-XMRbno-rmxkWf3c058hzQoEzqMgp4_AjJoY&id=3&step=finish`,
            { waitUntil: "networkidle0", timeout: 0 } // 200 seconds timeout
        );

        // await page.addStyleTag({ content: 'body { margin-right: -1000px; }' });

        // Optionally, add custom styles or perform other manipulations to fit content within A4
        // await page.addStyleTag({
        //     content:
        //         "body { transform: scale(0.8); transform-origin: top right; }",
        // });

        // Generate PDF from the page content in landscape mode with adjusted margins
        const pdfBuffer = await page.pdf({
            // format: "A4",
            printBackground: true,
            // margin: { bottom: "0mm", left: "0mm", right: "0mm", top: "0mm" },
            landscape: false, // Consider using landscape mode if content is wider than it is tall
            height: 1404,
            width: 990,
            displayHeaderFooter: false,
            // scale: 0.80,
            timeout: 0,
        });

        // Close the browser
        await browser.close();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${filename}.pdf`
        );
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
