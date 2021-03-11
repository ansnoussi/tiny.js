let root = document.querySelector('[x-data]')

let rawData = getInitialData()

let data = observe(rawData)

registerListeners()
refreshDom()

function registerListeners() {
    walkDom(root, el => {

        if(el.hasAttribute('@click')){
            let expression = el.getAttribute('@click')
            
            el.addEventListener('click', () => {
                eval(`with (data) { (${expression}) }`)
            })
        }

    })
}

function observe(data){

    return new Proxy(data, {
        set(target, key, value) {
            target[key] = value

            refreshDom()
        }
    })

}

function refreshDom() {
    walkDom(root, el => {

        // console.log(el.outerHTML)

        if(el.hasAttribute('x-text')){
            let expression = el.getAttribute('x-text')
            el.innerText = eval(`with (data) { (${expression}) }`)
        }
    })
}

function walkDom(el, callback) {
    callback(el)

    el = el.firstElementChild

    while(el){

        walkDom(el, callback)
         
        el = el.nextElementSibling

    }
}

function getInitialData() {

    let dataString = root.getAttribute('x-data')

    return  eval(`(${dataString})`)
}