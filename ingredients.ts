import puppeteer from "puppeteer";
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.skincarisma.com/ingredient-analyzer");

    // input ingredients and run
    await page.type('input[type="#ingredient"]', 'Your search string');
    await page.click('button[type=".btn btn-primary"]');
    await page.waitForNavigation();
    const nextPageURL = page.url();
    const nextPage = await browser.newPage();
    await nextPage.goto(nextPageURL);

    // scrape table
    const tableContainer = await nextPage.$('.ingredients-table');

    const data: (string | null)[][] = [];
    if (tableContainer !== null) {
        const table = await tableContainer.$('table');
        const rows = await tableContainer.$$('tr');

        for (const row of rows) {
            const columns = await row.$$('td');
            const rowData: (string | null)[] = [];

            for (const column of columns) {
                const cellText = await page.evaluate((element) => element.textContent, column);
                console.log(cellText)
                rowData.push(cellText);
            }
            data.push(rowData)
        }
    }
    await browser.close();
    // write to file
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
})();