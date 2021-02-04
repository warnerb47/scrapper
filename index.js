// documentation officiel: https://cheerio.js.org/Cheerio.html
// npm: https://www.npmjs.com/package/cheerio
const cheerio = require('cheerio');

// npm : https://www.npmjs.com/package/request
const request = require('request');

const fs = require('fs');

const structures = [];
const titles = [];
const vignettes = [];

// function getstructure(html) {
//     const document = cheerio.load(html);    
//     const sutureList = document('.structure');
//     sutureList.map((index, element)=>{
//         const elementNode = cheerio(element);
//         let htmlString = elementNode.html();
//         htmlString = htmlString.replace(/\n|\t/g, "");
//         structures.push(htmlString);
//     })
// }

// function getTitle(html) {
//     const document = cheerio.load(html);    
//     const titreVignetteList = document('.titre_vignette');
//     titreVignetteList.map((index, element)=>{
//         const elementNode = cheerio(element);
//         let htmlString = elementNode.html();
//         htmlString = htmlString.replace(/\n|\t/g, "");
//         titles.push(htmlString);
//     })
// }

// cette fonction permet de récupérer les éléments html de la classe `className` passée en paramétre
function getElement(html, className) {
    // création d'une instance de cheerio avec le html de la page
    const document = cheerio.load(html);

     // permet de rechercher les éléments de la class `className` dans elementList
    const elementList = document(className);

    // On parcours les tableaux `elementList`
    elementList.map((index, element)=>{

        // Pour chaque element du tableau on instancie cheerio avec la variable `element`
        // ceci va nous permettre d'avoir accès aux fonctionnalités que cheerio met à notre disposition sur cet element
        const elementNode = cheerio(element);

        // `htmlString` est une variable qui va contenir le html de cette element
        let htmlString = elementNode.html();

        // avec la fonction replace on enléve les tabulations (\t) et les retours à la ligne (\n)
        htmlString = htmlString.replace(/\n|\t/g, "");
        
        // suivant la class on le met dans le tableau concerné
        if (className === '.structure') {
            structures.push(htmlString);
        }else {
            titles.push(htmlString);
        }

    })
}

// Cette fonction permet de créer un tableau qui va contenir pour chaque annonce sa structure et son titre
function setVignette() {

    // On parcours les structures
    structures.forEach((element, index) => {

        // pour chaque structure on lui associe son titre et on met le tout dans une vairable `vignette`
        const vignette = {
            "structure": element,
            "titre": titles[index]
        }

        // cette variable `vignette` est ajouté à la liste des vignettes `vignettes`
        vignettes.push(vignette);
    });
}


// Cette fonction va sauvegarder la liste des vignettes dans un fichier `./data.json`
function saveInfile() {
    fs.writeFile('data.json', JSON.stringify(vignettes), ()=>{
        console.log('saved');
    });
}


// `request` sera éxécuté quand on lance le program avec `node index.js` ou `npm start`
// `request` va faire une requête http vers le lien `url`
// et dans le callback on fait appelle à la fonction getElement pour récupérer les structres et les titres
// avant de sauvegarder le tout dans un fichier avec la fonction `saveInfile()`
const url = 'https://avisjournaux.com/';
request(url, (error, response, html) => {
    if (response.statusCode === 200) {
        getElement(html, '.structure');
        getElement(html, '.titre_vignette');
        setVignette();
        saveInfile();
    }
});
