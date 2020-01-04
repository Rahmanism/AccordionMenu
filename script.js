document.addEventListener('DOMContentLoaded', (evt) => {

    var theMenuContainer = document.querySelector('.accordion-menu-container')
    var linkBaseUrl = document.getElementById('baseItemLinkUrl').value ?
        document.getElementById('baseItemLinkUrl').value : ''

    var fixMenus = () => {
        var menuContainer = document.querySelector('.accordion-menu-container')
        var menuItems = menuContainer.querySelectorAll('ul:first-child li')
        menuItems.forEach((li) => {
            if (li.querySelector('ul')) {
                li.classList.add('submenu-parent')
                let arrowImage = document.createElement('img')
                arrowImage.src = 'double-chevron-down.png'
                arrowImage.classList.add('submenu-sign-image')
                let arrowImageSize = li.clientHeight * .8
                arrowImage.style.height = arrowImageSize + 'px'
                arrowImage.style.marginTop = (-arrowImageSize - 10) + 'px'
                arrowImage.addEventListener('click', () => {
                    toggleSubMenu(li)
                })
                li.insertBefore(arrowImage, li.querySelector('ul'))
            }
        })
    }

    var toggleSubMenu = (e) => {
        let subMenu = e.querySelector('ul')
        if (subMenu.classList.contains('show-menu')) {
            subMenu.style.maxHeight = subMenu.scrollHeight + 'px'
            subMenu.classList.remove('show-menu')
            setTimeout(() => { subMenu.style.maxHeight = 0 }, 100)
            subMenu.parentElement.querySelector(
                'img.submenu-sign-image').src = 'double-chevron-down.png'
        } else {
            subMenu.classList.add('show-menu')
            subMenu.style.maxHeight = subMenu.scrollHeight + 'px'
            subMenu.parentElement.querySelector(
                'img.submenu-sign-image').src = 'double-chevron-up.png'
            setTimeout(() => { subMenu.style.maxHeight = 'fit-content' }, 500)
        }
    }

    var getCategories = () => {
        console.log('last')
        let xhr = new XMLHttpRequest()
        let url = document.getElementById('menuTreeUrl').value
        if (!url) {
            fixMenus()
            return;
        }
            
        xhr.open('GET', url)
        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    let receivedData = JSON.parse(xhr.responseText)
                    loadTree(receivedData)
                } catch (er) {
                    console.log('failed to parse json data')
                    return null;
                }
            } else {
                console.log('Request faild! ' + xhr.status)
                return null;
            }
        }
        xhr.send()
    }

    var loadTree = (list) => {
        if (!list) return;

        theMenuContainer.innerHTML = treeTool(list, 0)
        fixMenus()
    }

    var treeTool = (data, parentId) => {
        let result = ''
        let thisSub = data.filter((item) => {
            return item.ParentID == parentId && item.Active && item.ShowInMenu
        })

        if (!thisSub.length)
            return result;

        result += '<ul>'
        for (let i = 0; i < thisSub.length; i++) {
            result += '<li><a href="' + linkBaseUrl + thisSub[i].ID + '">' +
                thisSub[i].Title + '</a>'
            result += treeTool(data, thisSub[i].ID)
            result += '</li>'
        }
        result += '</ul>'

        return result
    }

    // It starts here
    getCategories()
})
