function CreateField() {
    var elem = document.createElement("p"),
        content = document.createTextNode("Это динамично созданный текст"),
        wrapppedP= document.getElementsByClassName("game")
    console.log(elem);
    elem.appendChild(content);
    wrapppedP.parentNode.appendChild(elem)
}