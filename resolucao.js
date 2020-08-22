// Recuperação dos dados originais do banco de dados
const fs = require('fs');
 
function read(nameFile){
    const data = fs.readFileSync(__dirname + `${nameFile}`, 'utf8');
    const products = JSON.parse(data);
    return products;
}


function correctName(products){
    for(const i in products){
        const aux = products[i].name.replace(/ø/g, 'o').replace(/ß/g, 'b').replace(/¢/g, 'c').replace(/æ/g, 'a'); 
        products[i].name = aux;
    }
}

function correctPrice(products){
    for(const i in products){
        const aux = parseFloat(products[i].price);
        products[i].price = aux;
    }
}

function correctQuantity(products){
    for(const i in products){
        if(products[i].hasOwnProperty('quantity') == 0){
            Object.defineProperty(products[i], 'quantity', {
                enumerable: true, 
                writable: true, 
                value: 0
            })
        }
    }  
}

function createWriteFile(products){
    fs.writeFile(__dirname + '/saida.json', JSON.stringify(products), err => {
        console.log(err || 'Conteúdo corrigido e arquivo saida.json salvo');
    })
}

const products = read('/broken-database.json');
correctName(products);
correctPrice(products);
correctQuantity(products);
createWriteFile(products);

// Validação do banco de dados corrigido
function sorting(products){
    // function copiada da internet
    products.sort(function (a, b) {
        return (a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0);
    });
    
    products.sort(function (a, b) {
        if(a.category == b.category)
            return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
        else return;
    });

    const nomesProdutos = products.map(e => e.name);

    return nomesProdutos;
}

function valorTotalDeEstoque(products) {
    const estoquePorCategoria = products.reduce((estoquePorCategoria, e) => {
        switch (e.category) {
            case 'Acessórios':
                estoquePorCategoria.acessorios += e.price;
                break;
            case 'Eletrodomésticos':
                estoquePorCategoria.eletrodomesticos += e.price;
                break;
            case 'Eletrônicos':
                estoquePorCategoria.eletronicos += e.price;
                break;
            case 'Panelas':
                estoquePorCategoria.panelas += e.price;
                break;
        }
        return estoquePorCategoria;
    }, { acessorios: 0, eletrodomesticos: 0, eletronicos: 0, panelas: 0 })

    return estoquePorCategoria;
}

// ordenando primeiramente por ordem alfabética, e em seguida por id
console.log('Nomes dos produtos organizados por ordem alfabética e de id:\n', sorting(products));
// retornando um objeto com o valor total em estoque de cada categoria
const estoquePorCategoria = valorTotalDeEstoque(products);
console.log('Valor total de cada categoria em estoque:\n', estoquePorCategoria);
