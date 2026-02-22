"use client"

import * as React from "react"

// Simple toast types without external dependencies
export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export type ToastActionElement = React.ReactElement

// Export simple components for compatibility
export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ToastViewport = () => null
export const Toast = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const ToastAction = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const ToastClose = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const ToastTitle = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const ToastDescription = ({ children }: { children: React.ReactNode }) => <div>{children}</div>