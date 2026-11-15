
// musica

const music = document.getElementById('bg-music');
if (music) music.volume = 0.2;

  function loadPage(page) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', page, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        document.getElementById('content').innerHTML = xhr.responseText;
        history.pushState(null, null, page);
      }
    };
    xhr.send();
  }

  window.onpopstate = function () {
    const path = location.pathname.split('/').pop();
    loadPage(path || 'home.html');
  };




//Entrar no site

function entrarSite() {
    const secao = document.querySelector('.header_opening');
    secao.classList.add('fade-out');

    // Aguarda 1s (tempo da animação) antes de trocar a página
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 4000);
}


//navbar

window.addEventListener("scroll", function() {
    var header = document.querySelector("header");
    if (header) header.classList.toggle('sticky', window.scrollY > 0);
});

var menu = document.querySelector('.menu');
var menuBtn = document.querySelector('.menu-btn');
var closeBtn = document.querySelector('.close-btn');
var menuLinks = document.querySelectorAll('.menu a'); // Correção aqui! Agora os links são selecionados corretamente

// (a página de abertura, index.html, não tem menu)
if (menu && menuBtn && closeBtn) {
    menuBtn.addEventListener("click", () => {
        menu.classList.add('active');
    });

    closeBtn.addEventListener("click", () => {
        menu.classList.remove('active');
    });

    // Fecha o menu ao clicar em qualquer link
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
        });
    });

    // Se a tela for ampliada (ex.: girar o celular), garante que o menu não fique "preso" aberto
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) menu.classList.remove("active");
    });
}





//nav-link

document.addEventListener("scroll", () => {
    let sections = document.querySelectorAll("section");
    let navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});







//carrossel

document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".galeria-item");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    if (!items.length || !prevBtn || !nextBtn) return;
    let currentIndex = 1; // Começa com Tommy no centro

    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove("active", "left", "right");

            if (index === currentIndex) {
                item.classList.add("active");
            } else if (index === (currentIndex - 1 + items.length) % items.length) {
                item.classList.add("left");
            } else if (index === (currentIndex + 1) % items.length) {
                item.classList.add("right");
            }
        });
    }

    prevBtn.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextBtn.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    updateCarousel(); // Atualiza o carrossel no início
});




//galeria slider


let slider = document.querySelector('.slider .lista');
let items = document.querySelectorAll('.slider .lista .itens');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let dots = document.querySelectorAll('.slider .pontos li')

let lengthItens = items.length - 1;
let active = 0;
let refreshInterval;

// (a página de abertura, index.html, não tem a galeria)
if (slider && next && prev) {
    next.onclick = function(){
        active = active + 1 <= lengthItens ? active + 1 : 0;
        reloadSlider();
    }
    prev.onclick = function(){
        active = active - 1 >= 0 ? active - 1 : lengthItens;
        reloadSlider();
    }

    refreshInterval = setInterval (()=> {next.click()}, 3000);

    dots.forEach((li, key) => {
        li.addEventListener('click', ()=>{
            active = key;
            reloadSlider();
        })
    })

    window.addEventListener('resize', reloadSlider);
}

function reloadSlider(){
    slider.style.left = -items[active].offsetLeft + 'px';

    dots.forEach(dot => dot.classList.remove('active'));
    dots[active].classList.add('active');

    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=>{next.click()}, 3000);

}




// modal email e local

const modal = document.querySelector('.modal_container')

function openBox() {
    modal.classList.add('active')
}

function closeBox() {
    modal.classList.remove('active')
}