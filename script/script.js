'use strict'
import {
    addComment,
    handlePopupClose,
    handlePopupOpen,
    autorization,
    logOut,
    deleteComment,
} from './eventListener.js'
import { fetchCommentsToServer } from './api.js'

fetchCommentsToServer()

addComment()
handlePopupClose()
handlePopupOpen()
autorization()

export function loggetIn() {
    const popupOpenBtn = document.querySelector('.popup-open')
    const helloUser = document.createElement('span')
    const token = localStorage.getItem('token')
    helloUser.classList.add('hello-user')
    document.querySelector('.container-button').appendChild(helloUser)

    if (token !== null) {
        const userName = localStorage.getItem('userName')
        helloUser.textContent = `Привет, ${userName || 'Пользователь'}!`
        helloUser.style.display = 'block'
        popupOpenBtn.textContent = 'Выйти'
    } else {
        popupOpenBtn.textContent = 'Войти'
        helloUser.style.display = 'none'
    }
    if (popupOpenBtn.textContent === 'Выйти') {
        popupOpenBtn.onclick = logOut
    }
}

loggetIn()
deleteComment()
