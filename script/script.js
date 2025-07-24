'use strict'
import { addComment, likeComment, quoteComment } from './eventListener.js'
import { fetchCommentsToServer } from './comments.js'

const loader = document.createElement('li')
loader.classList.add('loader')
loader.innerHTML = 'Подождите немного, комментарии загружаются...'

document.querySelector('.comments').appendChild(loader)

fetchCommentsToServer()

addComment()
likeComment()
quoteComment()
