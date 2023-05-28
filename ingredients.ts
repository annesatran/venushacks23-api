import puppeteer from "puppeteer";
import fs from 'fs';

interface Product {
    term: string;
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // load products.json file
    const productsJSON = fs.readFileSync('products.json', 'utf-8');
    const products = JSON.parse(productsJSON);

    const features = [];

    let inputString: string = '';
    for (const product of products) {
        // manipulate page url
        inputString = product.ingredients.replace(/;/gi, "%2C+");
        inputString = inputString.replace(/ /gi, '+');
        inputString = inputString.replace(/\(/gi, "28");
        inputString = inputString.replace(/\)/gi, "28");
        console.log(inputString);
        console.log('');

        await page.goto(`https://www.skincarisma.com/products/analyze?utf8=%E2%9C%93&product%5Bingredient%5D=${inputString}`);

        // effects: acne-fighting, anti-aging, brightening booleans
        const effects = await page.$$eval('.effect-wrapper', (elements) =>
            elements.map((el) => el.textContent?.trim())
        );

        let effectString: string = '';
        for (const effect of effects) {
            effectString += effect.replace(/[\n\s]/g, '');
        }

        let [acne_fighting, anti_aging, brightening, uv] = [false, false, false, false];
        if (effectString.includes("Acne-Fighting")) {
            acne_fighting = true;
        }
        if (effectString.includes("Anti-Aging")) {
            anti_aging = true;
        }
        if (effectString.includes("Brightening")) {
            brightening = true;
        }
        if (effectString.includes("UV Protection")) {
            uv = true;
        }

        // safety: low risk integer 1-100
        const safetyString = await page.$$eval('.progress', (elements) =>
            elements.map((el) => el.textContent?.trim())
        );
        let safety = safetyString[0].replace(/[\n\s]/g, '').split("%")[0];

        // scrape table
        const tableContainer = await page.$('.ingredients-table');

        let [oily, dry, sensitive, goodOilyCount, badOilyCount, goodDryCount, badDryCount, goodSensitiveCount, badSensitiveCount, comedogenic] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (tableContainer !== null) {
            const table = await tableContainer.$('table');
            const rows = await tableContainer.$$('tr');

            let tableString: string = '';
            for (const row of rows) {
                const columns = await row.$$('td');

                for (const column of columns) {
                    const cellText = await page.evaluate((element) => element.textContent, column);
                    tableString += cellText;
                }
            }
            tableString = tableString.replace(/[\n\s]/g, '');

            // oily, dry, & sensitive bools
            goodOilyCount = tableString.split("GoodforOilySkin").length - 1;
            badOilyCount = tableString.split("BadforOilySkin").length - 1;
            goodDryCount = tableString.split("GoodforDrySkin").length - 1;
            badDryCount = tableString.split("BadforDrySkin").length - 1;
            goodSensitiveCount = tableString.split("GoodforSensitiveSkin").length - 1;
            badSensitiveCount = tableString.split("BadforSensitiveSkin").length - 1;

            if (goodOilyCount > badOilyCount) { oily = 1; }
            if (goodDryCount > badDryCount) { dry = 1; }
            if (goodSensitiveCount > badSensitiveCount) { sensitive = 1; }

            // comedogenic: int 1-5
            const rating: number[] = [];
            let startIndex = 0;

            while (startIndex !== -1) {
                const index = tableString.indexOf("ComedogenicRating(", startIndex);
                if (index !== -1) {
                    rating.push(parseInt(tableString[index + 18]));
                    startIndex = index + "ComedogenicRating(".length;
                } else {
                    break;
                }
            }

            const sum = rating.reduce((total, num) => total + num, 0);
            const average = sum / rating.length;

            if (average <= 2) { comedogenic = 1 }

            const feature = {
                safety: safety,
                oily: oily,
                dry: dry,
                sensitive: sensitive,
                comedogenic: comedogenic,
                acne_fighting: acne_fighting,
                anti_aging: anti_aging,
                brightening: brightening,
                uv: uv
            };

            features.push(feature);
            //console.log(feature);
        }
    }

    // write to file
    for (const product of products) {
        Object.assign(product, features);
    }

    const updatedJsonData = JSON.stringify(products, null, 2);
    fs.writeFileSync('products.json', updatedJsonData);

    await browser.close();
})();