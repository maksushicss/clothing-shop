let sizeSelection = document.querySelectorAll(".size-selection")
let sizeBar = document.querySelectorAll(".size-bar")
let sizeSelectCt = document.querySelectorAll(".size-select-content")

// Özel renk sözlüğünü genişletin
const customColors = {
    // Temel renkler
    cream: "#FFFDD0",
    nude: "#E3BC9A",
    mustard: "#FFDB58",
    camel: "#C19A6B",
    olivegreen: "#6B8E23",
    denim: "#1560BD",
    charcoal: "#36454F",
    natural: "#F5F5E6",

    // Desenler için varsayılan renkler
    floral: "#FF69B4", // Pembe tonu
    striped: "#000000", // Siyah çizgili
    checkered: "#FFFFFF", // Beyaz kareli
    printed: "#A0522D", // Kahverengi baskı
    patterned: "#708090", // Gri desenli

    // Diğer özel renkler
    burgundy: "#800020",
    taupe: "#483C32",
    mintgreen: "#98FF98",
    bej: "#F5F5DC",
    krem: "#FFFDD0",
}

let tiklandiMi = true
let tiklandiMi2 = true

let allProductsData = []
let currentDisplayedProducts = []
let colors = []
let uniqueColors

let sizes = []
let uniqueSizes

let sizeInputSection = document.querySelector(".sizes-section")
let itemsSection = document.querySelector(".items-section")

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("./products.json")
        if (!response.ok) throw new Error("Dosya bulunamadı")

        allProductsData = await response.json()
        console.log(allProductsData)

        currentDisplayedProducts = [...allProductsData]
        renderProducts(currentDisplayedProducts)

        //beden ve renk filtreleme için
        // updateColorFilters()
        // updateSizeFilters()
    } catch (error) {
        console.error("Veri yükleme hatası", error)
        itemsSection.innerHTML = `<div class="error-message">Ürünler yüklenirken hata oluştu</div>`
    }
})

// function getHexColor(data) {
//     return customColors[data.toLowerCase()] || data
// }

function renderProducts(productsToRender) {
    itemsSection.innerHTML = ""

    if (productsToRender.length === 0) {
        itemsSection.innerHTML = `    <div class="no-products-message">
                <p>⚠️ Hiç ürün bulunamadı. Filtreleri temizlemeyi deneyin.</p>
            </div> `
    }
    productsToRender.forEach((data) => {
        let colorsHTML = data.colors
            .map(function (color) {
                try {
                    // 1. önce özel renklere bak!
                    const cleanColor = color.toLowerCase().trim().replace(/\s+/g, "")
                    const hexColor = customColors[cleanColor] || cleanColor

                    //HEX format kontrolü
                    if (
                        !/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hexColor) &&
                        !chroma.valid(hexColor)
                    ) {
                        throw new Error("Geçersiz renk formatı")
                    }

                    //2. chroma.js ile renk kontrolü
                    const colorObj = chroma(hexColor)
                    return `<div class="color" style="background-color: ${colorObj.css()}" title="${color}"></div>`
                } catch (e) {
                    console.warn(`Renk hatası ${color}):`, e.message)
                    return `<div class="color" style="background-color: #CCCCCC" border: 1px dashed red" title="Geçersiz renk: ${color}"></div>`
                }
            })
            .join("")

        //! buradan devam et!!
        const sizesHTML = data.sizes
            .map(function (size) {
                console.log(size)

                const isOutOfStock = data.stock === 0
                const sizeClass = isOutOfStock ? "size-select-box out-of-stock" : "size-select-box"
                const tooltip = isOutOfStock ? 'title="Stokta yok"' : ""

                return `<div class="${sizeClass}" ${tooltip}>${size}</div>`
            })
            .join("")

        itemsSection.insertAdjacentHTML(
            "beforeend",
            ` 
                <div class="item">
                    <div class="item-pp">${data.name}</div>
                    <div class="item-infos">
                        <p class="category">${data.category} (${data.gender})</p>
                        <h4>Kadın Yazlık Elbise</h4>
                        <p class="material">${data.material}</p>
                        <p class="price">${data.price}$</p>
                        <div class="colors " ${data.stock === 0 ? "disabled" : ""}>
                           ${colorsHTML}
                        </div>
                        <div class="size-box-div" ${data.stock === 0 ? "disabled" : ""}>
                        ${sizesHTML}
                        </div>
                         ${
                             data.stock === 0
                                 ? '<p class="stock-warning">Stokta yok</p>'
                                 : '<p class="stock-warning">Stok Adedi: ' + data.stock + "</p>"
                         }
                    </div>
                </div>`,
        )

        //! bedenler ve renklerin tutulduğu genel array
        // colors.push(data.colors)
        // const allColors = colors.flat()
        // uniqueColors = [...new Set(allColors)]

        // sizes.push(data.sizes)
        // const allSizes = sizes.flat()
        // uniqueSizes = [...new Set(allSizes)]
        // console.log(item)
    })
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
