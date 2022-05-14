
function nestedFunctionSource () {
  return `
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

function keep () {
  function remove () {
  }
  const a = 1
}
`
}

function arrowFunctionSource () {
  return `
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

export const remove = () => {
  if (something) {
  }
}

function keep () {
}
`
}

function namedFunctionSource () {
  return `
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

export function remove = () => {
  if (something) {
  }
}

function keep () {
}
`
}
