const puppeteerCore = require("puppeteer-core");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());

app.get("/pdfgn/download/:filename", async (req, res) => {
    try {
        let filename = req.params.filename;
        // Execute the function
        // Launch Puppeteer Core with the specified executable path and headless mode set to false
        const browser = await puppeteerCore.connect({
            browserWSEndpoint:
                "wss://cranky-stonebraker-yf01bsczof.liara.run?token=f8SQ43ERLf6f8KuNRcuw",
        });

        // Open a new page
        const page = await browser.newPage();

        // Set viewport size to 1920px width and specify a height (e.g., 1080px)
        await page.setViewport({ width: 1540, height: 1080 });

        // Emulate media type to 'screen'
        await page.emulateMediaType("screen");

        // Navigate to the specified URL
        await page.goto(
            `https://typesanj.ir/rfheflxuriqpwpdf/?key=${filename}`,
            { waitUntil: "networkidle0", timeout: 0 } // 200 seconds timeout
        );

        // Optionally, add custom styles or perform other manipulations to fit content within A4
        // await page.addStyleTag({ content: 'body { transform: scale(0.75); transform-origin: top left; }' });

        // Generate PDF from the page content in landscape mode with adjusted margins
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "10mm", bottom: "10mm" },
            landscape: false, // Consider using landscape mode if content is wider than it is tall
            timeout: 0
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
