const cards = document.querySelector("#cards")
const items = document.querySelector("#items")
const footer = document.querySelector("#footer")
const templateCard = document.querySelector("#template-card").content
const templateFooter = document.querySelector("#template-footer").content
const templateCarro = document.querySelector("#template-carro").content
const fragment = document.createDocumentFragment()
let carro = {}

document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if(localStorage.getItem("carro"))
    carro = JSON.parse(localStorage.getItem("carro"))
    pintarCarro()
});

cards.addEventListener("click", e => {
    addCarro(e)
})

items.addEventListener("click", e => {
    btnAddOrClear(e)
})

const fetchData = async () => {
    try {
       const res = await fetch("api.json")
       const data = await res.json()
       pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.image)
        templateCard.querySelector(".btn-dark").dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarro = e => {
    if(e.target.classList.contains("btn-dark")) {
        setCarro(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarro = objecto => {
    const producto = {
        id: objecto.querySelector(".btn-dark").dataset.id,
        title: objecto.querySelector("h5").textContent,
        precio: objecto.querySelector("p").textContent,
        cantidad: 1
    }
    if(carro.hasOwnProperty(producto.id)) {
        producto.cantidad = carro[producto.id].cantidad + 1
    }
    carro[producto.id] = {...producto}
    pintarCarro()
}

const pintarCarro = () => {
    items.innerHTML = ""
    Object.values(carro).forEach(producto => {
        templateCarro.querySelector("th").textContent = producto.id
        templateCarro.querySelectorAll("td")[0].textContent = producto.title
        templateCarro.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarro.querySelector('span').textContent = producto.precio * producto.cantidad
        templateCarro.querySelector(".btn-primary").dataset.id = producto.id
        templateCarro.querySelector(".btn-secondary").dataset.id = producto.id
        const clone = templateCarro.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
    scrollUp()

    localStorage.setItem("carro", JSON.stringify(carro))
}

const pintarFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(carro).length === 0) {
        footer.innerHTML = `
            <th scope="row" colspan="5">Seleccione un producto!</th>
        `
        return
    }
    const nCantidad = Object.values(carro).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carro).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    const btnVaciar = document.querySelector("#vaciar-carro")
    btnVaciar.addEventListener("click", () => {
        carro = {}
        pintarCarro()
    })
}

const btnAddOrClear = e => {
    if(e.target.classList.contains("btn-primary")) {
        const producto = carro[e.target.dataset.id]
        producto.cantidad++
        carro[e.target.dataset.id] = {...producto}
        pintarCarro()
    }
    if(e.target.classList.contains("btn-secondary")) {
        const producto = carro[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carro[e.target.dataset.id]
        }
        pintarCarro()
    }
    e.stopPropagation()
}

function scrollUp(){
    let currentScroll = document.documentElement.scrollTop;
    if(currentScroll > 0){
        window.scrollTo(0, 0);
    }
}