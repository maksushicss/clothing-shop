let sizeSelection = document.querySelectorAll(".size-selection")
let sizeBar = document.querySelectorAll(".size-bar")
let sizeSelectCt = document.querySelectorAll(".size-select-content")

let sizesSection = document.querySelector(".sizes-section") // bedenler burada sıralansın
let orderSection = document.querySelectorAll(".placement-input")

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

let filteredItems = []

let allProductsData = []
let currentDisplayedProducts = []
let colors = []
let uniqueColors

let searchQuery = ""
let genderSelectValue = "all"
let orderLists = "default"
let selectedSize = [] // dropdown size select section

let sizes = []
let uniqueSizes = []

let sizeInputSection = document.querySelector(".sizes-section")
let itemsSection = document.querySelector(".items-section")

let colorSection = document.querySelector(".colors-section")

let searchInput = document.querySelector(".search-input")
let genderSelectRadio = document.querySelectorAll(".gender-input")

let sizeDropdownSec = document.querySelectorAll(".size-checkbox")
let selectedSizes = []

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("./products.json")
        if (!response.ok) throw new Error("Dosya bulunamadı")

        allProductsData = await response.json()
        console.log(allProductsData)

        currentDisplayedProducts = [...allProductsData]
        renderProducts(currentDisplayedProducts)
        let showSizes = showSizesTotal(allProductsData)
        let showColors = showColorTotal(allProductsData)
        addSizesToHtml(showSizes)

        //beden ve renk filtreleme için
        // updateColorFilters()
        // updateSizeFilters()
    } catch (error) {
        console.error("Veri yükleme hatası", error)
        itemsSection.innerHTML = `<div class="error-message">Ürünler yüklenirken hata oluştu</div>`
    }
})

function inputFilterToItems() {
    filteredItems = [...allProductsData]

    // sizesSection.innerHTML = "" // böyle yaparsan veriyi siler beden sekmesi hata verir
    if (searchQuery != "") {
        filteredItems = filteredItems.filter((product) => {
            return product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        })
        sizesSection.innerHTML += filteredItems
    }
    if (genderSelectValue != "all") {
        filteredItems = filteredItems.filter((product) => {
            return product.gender.toLowerCase() == genderSelectValue.toLowerCase()
        })
        sizesSection.innerHTML += filteredItems
    }

    if (orderLists != "ascending") {
        filteredItems = filteredItems.sort((a, b) => a.price - b.price)
    }

    if (orderLists != "descending") {
        filteredItems = filteredItems.sort((a, b) => b.price - a.price)
    }
    if (selectedSize != "") {
        filteredItems = filteredItems.filter((product) => {
            return product.size.some((size) => size.toLowerCase() == selectedSize.toLowerCase())
        })
    }
    if (selectedSizes.length > 0) {
        filteredItems = filteredItems.filter((product) => {
            // Ürünün bedenleriyle seçilen bedenlerin kesişimini kontrol et
            return product.sizes.some((size) =>
                selectedSizes.some(
                    (selectedSize) => size.toLowerCase() === selectedSize.toLowerCase(),
                ),
            )
        })
    }

    renderProducts(filteredItems)
}

function addSizesToHtml(datas) {
    sizesSection.innerHTML = ""

    const sizeStockMap = {}
    allProductsData.forEach((product) => {
        Object.entries(product.stock).forEach(([size, qty]) => {
            if (size !== "total") {
                sizeStockMap[size] = (sizeStockMap[size] || 0) + qty
            }
        })
    })

    Object.entries(datas).forEach(([size, count]) => {
        const totalStockForSize = sizeStockMap[size] || 0

        const isDisabled = totalStockForSize === 0

        sizesSection.innerHTML += `
            <label class="size-label ${isDisabled ? "disabled" : ""}">
                <input 
                    class="size-checkbox" 
                    type="checkbox" 
                    value="${size}" 
                    ${isDisabled ? "disabled" : ""}
                />
                ${size} (${count})
                ${isDisabled ? '<span class="out-of-stock-badge">Stok Yok</span>' : ""}
            </label>`
    })

    document.querySelectorAll(".size-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
            const size = e.target.value
            if (e.target.checked) {
                selectedSizes.push(size)
            } else {
                selectedSizes = selectedSizes.filter((s) => s !== size)
            }
            console.log(selectedSizes)
            inputFilterToItems() // Filtreleme fonksiyonunu tetikle
        })
    })
}

function showColorTotal(datas) {
    const result = {}
    let colorArray = []

    datas.forEach((data) => {
        data.colors.forEach((color) => {
            colorArray.push(color)
        })
    })

    let filteredColors = [...new Set(colorArray)]

    for (let i = 0; i < filteredColors.length; i++) {
        colorSection.innerHTML += `   <label class="color-label">
        <input class="color-checkbox" type="checkbox" value="36" />
        ${filteredColors[i]}
    </label>`
    }
}

function showSizesTotal(datas) {
    const result = {}

    datas.forEach((item) => {
        for (const [size, quantity] of Object.entries(item.stock)) {
            if (size !== "total") {
                if (result[size]) {
                    result[size] += quantity
                } else {
                    result[size] = quantity
                }
            }
        }
    })

    return result
}

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
                const isOutOfStock = data.stock.total == 0
                const sizeClass = isOutOfStock ? "size-select-box out-of-stock" : "size-select-box"
                const tooltip = isOutOfStock ? 'title="Stokta yok"' : ""
                return `<button class="${sizeClass}" ${tooltip}>${size}</button>`
            })
            .join("")

        const isItemForMale = data.gender == "male"
        const isItemForFemale = data.gender == "female"
        let categoryHTML = ""

        if (isItemForMale) {
            categoryHTML = ` <p class="category male">${data.category} (${data.gender})</p>`
        } else if (isItemForFemale) {
            categoryHTML = ` <p class="category female">${data.category} (${data.gender})</p>`
        } else {
            categoryHTML = ` <p class="category unisex">${data.category} (${data.gender})</p>`
        }

        itemsSection.insertAdjacentHTML(
            "beforeend",
            ` 
                <div class="item">
                    <div class="item-pp">PHOTO</div>
                    <div class="item-infos">
                        ${categoryHTML}
                        <h4 class="item-name">${data.name}</h4>
                        <p class="material">${data.material}</p>
                        <p class="price">${data.price} TL</p>
                        <div class="colors " ${data.stock.total == 0 ? "disabled" : ""}>
                          Renkler: ${colorsHTML}
                        </div>
                        <div class="size-box-div" ${data.stock.total == 0 ? "disabled" : ""}>
                        ${sizesHTML}
                        </div>
                        ${
                            data.stock === 0 || data.stock.total === 0
                                ? '<p class="stock-warning out-of-stock">Stok: 0</p>'
                                : `<p class="stock-warning in-stock">${getStockText(
                                      data.stock,
                                  )}</p>`
                        }
                    </div>
                </div>`,
        )

        // if(searchQuery != "" )
    })
}

// stock kontrol eden fonksiyon itemlerin üzerine yazdırır!
function getStockText(stock) {
    if (stock === 0 || stock.total === 0) return "Stok: 0" // eğer stok sıfırsa yukardaki element içine stok:0 göndericek. değilse aşağı geç.
    return `Stok: ${Object.entries(stock) // eğer stok sıfır değilse element içine gelecek text `ile yazıyoruz`
        .filter(([key]) => key !== "total") // key ile total sözcüğünü filtrele. o hariç diğer keyler...
        .map(([size, qty]) => `${size}: ${qty}`) // [S: 5, M:7] => ["S:5", "M:7"] formatına çevirdin
        .join(", ")}` // join diziyi alır yanyana yazdırır aralarına virgül ve boşluk koyarak.
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

searchInput.addEventListener("input", (e) => {
    let girilenDeger = e.target.value
    searchQuery = girilenDeger
    inputFilterToItems()
})

genderSelectRadio.forEach((radio) => {
    radio.addEventListener("click", (e) => {
        let secilenGender = e.target.value
        genderSelectValue = secilenGender
        inputFilterToItems()
    })
})

orderSection.forEach((order) => {
    order.addEventListener("click", (e) => {
        let selectedOrder = e.target.value
        orderLists = selectedOrder
        inputFilterToItems()
    })
})
