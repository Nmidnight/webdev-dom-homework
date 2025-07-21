'use strict'
import { commentsArr } from './comments.js'
import { renderComments } from './renderFn.js'
import { escapeHtml, nl2br } from './escapeHtml.js'
import { initEventListeners } from './eventListener.js'

const addFormButton = document.querySelector('.add-form-button')
const userName = document.querySelector('.add-form-name')
const userComment = document.querySelector('.add-form-text')
const commentsList = document.querySelector('.comments')

// Инициализация приложения
initEventListeners(
    addFormButton,
    userName,
    userComment,
    commentsList,
    commentsArr,
    escapeHtml,
    renderComments,
)
renderComments(commentsList)
