let sizeSelection = document.querySelectorAll(".size-selection")
let sizeBar = document.querySelectorAll(".size-bar")
let sizeSelectCt = document.querySelectorAll(".size-select-content")

let tiklandiMi = true
let tiklandiMi2 = true

let allProductsData = []
let currentDisplayedProducts = []
let colors = []

window.addEventListener("DOMContentLoaded", () => {
    try {
        fetch("./products.json")
            .then((res) => res.json())
            .then((data) => {
                allProductsData = data
                console.log(allProductsData)
                renderProducts(data)
            })
    } catch (error) {
        console.error(error)
    }
})

function renderProducts(productsToRender) {
    allProductsData.forEach((data) => {})
}

sizeBar[0].addEventListener("click", () => {
    if (tiklandiMi == true) {
        sizeSelectCt[0].style.display = "flex"
        sizeSelection[0].style.height = "fit-content"
        tiklandiMi = false
    } else {
        sizeSelectCt[0].style.display = "none"
        sizeSelection[0].style.height = "fit-content"
        tiklandiMi = true
    }
})

sizeBar[1].addEventListener("click", () => {
    if (tiklandiMi2 == true) {
        sizeSelectCt[1].style.display = "flex"
        sizeSelection[1].style.height = "fit-content"
        tiklandiMi2 = false
    } else {
        sizeSelectCt[1].style.display = "none"
        sizeSelection[1].style.height = "fit-content"
        tiklandiMi2 = true
    }
})
