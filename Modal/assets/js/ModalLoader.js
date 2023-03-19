function loadHTML() {
    let body = document.getElementsByTagName('body')[0];
    fetch('/Modal/modal.html')
    .then(response=> body.insertAdjacentHTML("beforeend", response.text()))
}
loadHTML();