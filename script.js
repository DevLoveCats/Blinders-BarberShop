
// musica

const music = document.getElementById('bg-music');

if (music) {
    music.volume = 0.2;

    const botaoSom = document.getElementById('som-toggle');
    const naAbertura = !!document.querySelector('.header_opening');   // true só na index.html

    // A troca index -> home recarrega a página, o que cortaria o áudio. Então guardamos (só nesta aba)
    // se a música estava ligada e em que ponto ela estava, e a outra página continua dali.
    const CHAVE = 'blinders-musica';
    function lerEstado() {
        try { return JSON.parse(sessionStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; }
    }
    function salvarEstado(parcial) {
        try { sessionStorage.setItem(CHAVE, JSON.stringify(Object.assign(lerEstado(), parcial))); } catch (e) { /* sem armazenamento: segue sem continuidade */ }
    }

    const estado = lerEstado();

    // index: toca sozinha (a não ser que a pessoa tenha silenciado).
    // home: só toca se veio da index com a música ligada; se abriu direto, fica quieta até apertar o botão.
    let pausadoPelaPessoa = naAbertura ? estado.on === false : estado.on !== true;

    // retoma do ponto onde a outra página parou
    if (estado.t > 0) {
        const irParaPonto = () => { try { music.currentTime = estado.t; } catch (e) { /* ignora */ } };
        if (music.readyState >= 1) irParaPonto();
        else music.addEventListener('loadedmetadata', irParaPonto, { once: true });
    }

    function atualizarBotaoSom() {
        if (!botaoSom) return;
        const tocando = !music.paused;
        botaoSom.classList.toggle('tocando', tocando);
        botaoSom.classList.toggle('mudo', !tocando && pausadoPelaPessoa);
        botaoSom.classList.toggle('esperando', !tocando && !pausadoPelaPessoa);
        botaoSom.setAttribute('aria-pressed', String(tocando));
        botaoSom.setAttribute('aria-label', tocando ? 'Desligar o som' : 'Ativar o som');
    }

    // Os navegadores só liberam som automático depois que a pessoa interage com o site
    // (clicar, tocar ou usar o teclado). Então: tenta tocar assim que a página abre e,
    // se o navegador bloquear, começa no primeiro clique/toque/tecla (ou no botão de som).
    const gestos = ['click', 'touchend', 'keydown'];

    function pararDeEsperarGesto() {
        gestos.forEach(g => document.removeEventListener(g, iniciarMusica));
    }

    function iniciarMusica() {
        if (pausadoPelaPessoa) return;
        const tocando = music.play();
        if (tocando && typeof tocando.then === 'function') {
            tocando.then(pararDeEsperarGesto).catch(() => { /* continua esperando um gesto */ });
        } else {
            pararDeEsperarGesto();
        }
    }

    music.addEventListener('play', () => { salvarEstado({ on: true }); atualizarBotaoSom(); });
    music.addEventListener('pause', atualizarBotaoSom);
    music.addEventListener('timeupdate', () => { if (!music.paused) salvarEstado({ t: music.currentTime }); });
    window.addEventListener('pagehide', () => { if (!music.paused) salvarEstado({ t: music.currentTime }); });

    if (botaoSom) {
        botaoSom.addEventListener('click', (e) => {
            e.stopPropagation();           // não deixa o "qualquer toque" religar a música logo em seguida
            if (music.paused) {
                pausadoPelaPessoa = false;
                salvarEstado({ on: true });
                music.play().catch(() => {});
            } else {
                pausadoPelaPessoa = true;
                salvarEstado({ on: false });
                music.pause();
            }
            atualizarBotaoSom();
        });
        // o toque no botão não deve disparar também o "qualquer toque"
        botaoSom.addEventListener('touchend', (e) => e.stopPropagation());
    }

    if (!pausadoPelaPessoa) {
        gestos.forEach(g => document.addEventListener(g, iniciarMusica));
        iniciarMusica();
    }
    atualizarBotaoSom();
}

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
    // Com o menu aberto a página de trás não rola (assim a barra de rolagem dela não aparece por cima do menu)
    function abrirMenu() {
        menu.classList.add('active');
        document.documentElement.classList.add('menu-open');
    }

    function fecharMenu() {
        menu.classList.remove('active');
        document.documentElement.classList.remove('menu-open');
    }

    menuBtn.addEventListener("click", abrirMenu);
    closeBtn.addEventListener("click", fecharMenu);

    // Fecha o menu ao clicar em qualquer link
    menuLinks.forEach(link => {
        link.addEventListener("click", fecharMenu);
    });

    // Se a tela for ampliada (ex.: girar o celular), garante que o menu não fique "preso" aberto
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) fecharMenu();
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