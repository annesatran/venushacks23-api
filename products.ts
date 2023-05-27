import puppeteer from "puppeteer";
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const types: string[] = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'];

    for (const type of types) {
        await page.goto(`https://incidecoder.com/search?query=${type}`);
        await page.waitForSelector('a.klavika');

        const productNames = await page.$$eval('a.klavika', (elements) =>
            elements.map((el) => el.textContent?.trim())
        );

        const productLinks = await page.$$eval('a.klavika', (elements) =>
            elements.map((el) => el.getAttribute('href'))
        );

        const products = [];

        // scrape for each product
        for (let i = 0; i < productLinks.length; i++) {
            // Click on the product link
            await Promise.all([page.waitForNavigation(), page.click('a.klavika')]);
            await page.waitForSelector('a.ingred-link.black');

            // product name
            const productName = productNames[i];
            const productname = productName.toLowerCase();

            const productLink = productLinks[i];
            const productPage = await browser.newPage();


            if (productLink.includes("products")) {
                await productPage.goto(`https://incidecoder.com${productLink}`);

                // product ingredients
                const productIngredients = await productPage.$$eval('a.ingred-link.black', (elements) =>
                    elements.map((el) => el.textContent?.trim())
                );

                const tempSet: Set<string> = new Set();
                for (let i = 0; i < productIngredients.length; i++) {
                    tempSet.add(productIngredients[i]);
                }
                let ingredients: string = '';
                tempSet.forEach((element) => {
                    const ingredient = element.toLowerCase();
                    ingredients += ingredient;
                    ingredients += ';';     // semicolon delimiter
                });

                // product brand
                const brand = await productPage.$eval('a.underline', (element) =>
                    element.textContent?.trim()
                );

                // product imageURL
                const imageURL = await productPage.$eval('#product-main-image img', (element) =>
                    element.getAttribute('src')
                );

                //store in product dict
                const product = {
                    name: productname,
                    brand: brand,
                    type: type,
                    image: imageURL,
                    ingredients: ingredients,
                };

                console.log(product);

                products.push(product);
                await productPage.close();

                // Go back to the search results page
                await Promise.all([page.waitForNavigation(), page.goBack()]);
            } else {
                break;
            }
        }
        // write to file
        const jsonContent = JSON.stringify(products, null, 2);
        fs.writeFileSync('products.json', jsonContent, { flag: 'a' });
    };
    await browser.close();

})();