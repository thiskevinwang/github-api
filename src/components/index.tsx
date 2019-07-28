import React, { useState, useEffect } from "react"

/**
 * @usage
 * ```typescript
 * <FunctionAsChildrenProps>
 *   {(value: string) => {
 *     return <div>{value}</div>
 *   }}
 * </FunctionAsChildrenProps>
 * ```
 */
const FunctionAsChildrenProps = ({ children }: { children: Function }) => {
  const [name, setName] = useState("FunctionAs...")
  useEffect(() => {
    setTimeout(() => {
      setName("FunctionAsChildrenProps")
    }, 1000)
  }, [])
  return children(name)
}

/**
 * @usage
 * ```typescript
 * <RenderProps
 *   render={(value: string) => {
 *     return <div>{value}</div>
 *   }}
 * />
 * ```
 */
const RenderProps = ({ render }: { render: Function }) => {
  const [name, setName] = useState("FunctionAs...")
  useEffect(() => {
    setTimeout(() => {
      setName("FunctionAsRenderProps")
    }, 1500)
  }, [])
  return render(name)
}
