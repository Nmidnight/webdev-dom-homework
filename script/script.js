'use strict'
import { addComment, likeComment, quoteComment } from './eventListener.js'
import { fetchCommentsToServer } from './comments.js'

fetchCommentsToServer()

addComment()
likeComment()
quoteComment()
