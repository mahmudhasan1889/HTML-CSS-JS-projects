const menuToggler = document.querySelectorAll("#menu_toggle");
const header = document.querySelector("header");

menuToggler.forEach(toggler => {
    toggler.addEventListener("click", ()=>{
        header.classList.toggle("showMenu");
    })
})