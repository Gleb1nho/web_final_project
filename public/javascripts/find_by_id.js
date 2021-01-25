const search_btn = document.getElementById('searchbutton')
const form = document.getElementById('search_form')

search_btn.addEventListener('click', (e) => {
    let val = document.getElementById('resid').value
    if (val.match("^[A-​Za-z0-9]+$") && val.length > 0) form.action = `guest/${val}`
})