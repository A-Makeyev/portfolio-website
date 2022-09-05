/*

ADD PROJECT WEB COMPONENT

*/

console.log(
    '%c perhaps you want to shoot some aliens? check out the ninja icon', 
    [
        'padding: 10px',
        'color: aliceblue',
        'font-size: xx-large',
        'text-shadow: 2px 2px 2px black',
        'background: linear-gradient(0deg, aliceblue, darkblue)',
    ].join(';')
)

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
var bgIconsWereActivated = false
var saltBaeWasActivated = false

function scrollInto(selector) {
    document.querySelector(selector).scrollIntoView({ 
        behavior: 'smooth', block: 'center', inline: 'center' 
    })
}

function disableScrolling() {
    document.querySelector('body').classList.toggle('disable-scrolling')
}

function hideSection() {
    document.querySelector('section.active').classList.toggle('fade-out')
}

function toggleNavbar() {
    document.querySelector('.header').classList.toggle('active')
}

function togglePopup() {
    document.querySelector('.main').classList.add('fade-out')
    document.querySelector('.image-popup').classList.add('open')
    document.querySelector('body').classList.add('disable-scrolling')

    const close = () => {
        document.querySelector('.main').classList.remove('fade-out')
        document.querySelector('.image-popup').classList.remove('open')
        document.querySelector('body').classList.remove('disable-scrolling')
        document.querySelector('.image-body').innerHTML = '<img src="assets/icons/loading.gif" alt="loading.." class="loading-gif">'
    }

    document.querySelector('.image-popup-close').addEventListener('click', close)
    document.querySelector('.image-inner').addEventListener('click', close)
}

async function loadImage(url) {
    let response = await fetch(url, { method: 'GET' })
    if (response.status === 200) {
        const imageBlob = await response.blob()
        const imageObjectURL = URL.createObjectURL(imageBlob);
        const image = document.createElement('img')
        image.src = imageObjectURL

        document.querySelector('.loading-gif').style.display = 'none'
        document.querySelector('.image-body').append(image)
    } else {
        console.log(response.status)
    }
}

async function loadInvaders(url) {
    let response = await fetch(url, { method: 'GET' })
    if (response.status === 200) {
        document.querySelector('.image-body').innerHTML = 
        `
            <div style="padding:50px;">
                <p>press <b>🡰 🡲</b> to move</p> 
                <p>and <b>space</b> to shoot</p>
            </div>
        `
        
        setTimeout(() => {
            document.querySelector('.image-body').innerHTML = `<iframe src="${url}" class="invaders"></iframe>`
            document.querySelector('.invaders').contentWindow.focus() 
        }, 2000)
    } else {
        console.log(response.status)
    }
}

function displayImage(id) {
    const folder = window.location.href.split('#')[1]
    id = id.replace('img-to-display-', '')
    
    if (id.includes('facepalm')) document.querySelector('.project-popup').classList.toggle('open')
    loadImage(`assets/images/${folder}/${id}.jpg`)
    togglePopup()
}

/* LOADER */

if (window.matchMedia('(max-width: 574px)').matches) {
    document.querySelector('.loader div:nth-child(1)').style.display = 'none'
}

window.addEventListener('load', () => {
    const today = new Date()
    const currentHour = today.getHours()
    const greeting = document.getElementById('greeting')
    greeting.innerText = currentHour < 18 ? 'bonjour' : 'bonsoir'

    document.querySelector('.loader').classList.add('fade-out')
    setTimeout(() => {
        document.querySelector('.loader').remove()
        document.querySelector('.main').classList.remove('hidden')
        document.querySelector('.home-section').classList.add('active')
        document.querySelector('.bg-icons-box').classList.remove('fade-out')
        scrollInto('#home')
    }, 500)
})

/* MAIN NAV */

const navToggler = document.querySelector('.nav-toggler')
navToggler.addEventListener('click', () => {
    scrollInto('.nav-inner')
    disableScrolling()
    toggleNavbar()
    hideSection()
})

/* SECTIONS */

document.addEventListener('click', (event) => {
    const hash = event.target.hash
    if (event.target.classList.contains('link-item') && hash !== '') {
        // activate overlay to prevent multiple clicks
        document.querySelector('.overlay').classList.add('active')
        navToggler.classList.add('hide')
        
        if (event.target.classList.contains('nav-item')) {
            toggleNavbar()
        } else {
            hideSection()
            document.body.classList.add('disable-scrolling')
        }
        
        setTimeout(() => {
            document.querySelector('section.active').classList.remove('active', 'fade-out')
            document.querySelector('.overlay').classList.remove('active')
            document.querySelector(hash).classList.add('active')
            document.body.classList.remove('disable-scrolling')
            navToggler.classList.remove('hide')
            window.scrollTo(0, 0)
        }, 500)
    }

    if (event.target.hasAttribute('href') && event.target.href.includes('#')) {
        let title = hash.replace(/[^\w\s]/gi, '')
        title = title.charAt(0).toUpperCase() + title.slice(1)
        if (title.includes('Home')) {
            document.title = `Anatoly Makeyev`
        } else {
            document.title = `AM | ${title}`
        }
    }
})

/* ABOUT TABS */

const tabContainer = document.querySelector('.about-tabs')
const aboutSection = document.querySelector('.about-section')

tabContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('tab-item') && !event.target.classList.contains('active')) {
        tabContainer.querySelector('.active').classList.remove('active')
        event.target.classList.add('active')

        let target = event.target.getAttribute('data-target')
        aboutSection.querySelector('.tab-content.active').classList.remove('active')
        aboutSection.querySelector(target).classList.add('active')
    }
})

/* POPUPS */

function toggleProjectPopup() {
    document.querySelector('.main').classList.toggle('fade-out')
    document.querySelector('.project-popup').classList.toggle('open')
}

function displayProjectDetails(projectItem) {
    const projectImage = projectItem.querySelector('.project-item-thumbnail img').src
    const projectDetails = projectItem.querySelector('.project-item-details').innerHTML
    
    document.querySelector('.popup-thumbnail img').src = projectImage.includes('portfolio') ? projectImage.replace('portfolio', 'portfolio-secret') : projectImage
    document.querySelector('.popup-body').innerHTML = projectDetails
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('view-project-btn')) {
        displayProjectDetails(event.target.parentNode.parentNode)
        document.querySelector('.project-popup').scrollTo(0, 0)
        toggleProjectPopup()
    }

    if (event.target.classList.contains('popup-close') || event.target.classList.contains('popup-inner')) {
        document.querySelector('.popup-thumbnail img').src = ''
        toggleProjectPopup()
    }
    
    if (event.target.id != 'undefined' && event.target.id.includes('img-to-display')) {
        displayImage(event.target.id)
    }

    if (event.target.classList.contains('activate-salt-bae')) {
        if (!saltBaeWasActivated) {
            setTimeout(() => {
                document.querySelector('.midget-salt-bae').click()
                saltBaeWasActivated = true

                if (!bgIconsWereActivated) {
                    document.querySelector('.m-logo').click()
                    bgIconsWereActivated = true
                }
            }, 2000)
        }
    }

    if (event.target.classList.contains('m-logo')) {
        document.querySelector('.bg-icons-box').classList.toggle('active')
        bgIconsWereActivated = document.querySelector('.bg-icons-box').classList.contains('active') ? true : false
    }

    if (event.target.classList.contains('github-ninja')) {
        if (isMobileDevice) { 
            document.querySelector('.image-body').innerHTML = `<h4>This requires a PC</h4> <h2>🛸 ⚡ 👾 💥</h2>` 
        } else {
            loadInvaders(`${window.location.href.split('#')[0]}assets/invaders.html`)
        }
        togglePopup()
    }
})

/* SECRET SURPRISE */

function displaySocials(links, action) {
    setTimeout(() => {
        for (let i = 0; i < links.length; i++) {
            setTimeout(() => {
                if (action == 'fadeOut') links[i].classList.add('fade-out')
                if (action == 'fadeIn') links[i].classList.remove('fade-out')
            }, 250 * i)
        } 
    }, 1000)
}

document.querySelector('.midget-salt-bae').addEventListener('click', () => {
    const links = document.querySelectorAll('.secret-links a')

    document.querySelector('.giant-salt-bae').classList.remove('fade-out')
    document.querySelector('.midget-salt-bae').classList.add('fade-out') 
    displaySocials(links, 'fadeIn')

    document.querySelector('.giant-salt-bae').addEventListener('click', () => {
        document.querySelector('.giant-salt-bae').classList.add('fade-out')
        displaySocials(links, 'fadeOut')
        setTimeout(() => {
            document.querySelector('.midget-salt-bae').classList.remove('fade-out')
        }, 500 * links.length)
    })
})
