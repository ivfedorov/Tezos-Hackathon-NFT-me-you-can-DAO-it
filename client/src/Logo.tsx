import * as React from "react"
import {
  keyframes,
  ImageProps,
  forwardRef,
  usePrefersReducedMotion,
} from "@chakra-ui/react"
import logo from "./tezos.svg"

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const imgStyle = {
    width: '50%',
    margin: 'auto'
  }
  return <img style={imgStyle} src={`./img/logo.png`} alt={'ocao'}/>
})
