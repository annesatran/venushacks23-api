import fs from 'fs';

var i = 0;
var newProducts = [];

const productsJSON = fs.readFileSync('products1.json', 'utf-8');
const products = JSON.parse(productsJSON);
const ingredientsJSON = fs.readFileSync('products2.json', 'utf-8');
const ingredients = JSON.parse(ingredientsJSON);

for (const product of products) {
    const ingredient = ingredients[i.toString()];

    var objToWrite = {
        ...product,
        ...ingredient
    };

    newProducts.push(objToWrite);
    i++;
}

const jsonContent = JSON.stringify(newProducts, null, 2);
fs.writeFileSync('products.json', jsonContent);
