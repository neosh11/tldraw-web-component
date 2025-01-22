import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useCallback } from 'react'
import { stopEventPropagation, useToasts } from 'tldraw'
import {
	getCodeSandboxUrl,
} from '../lib/third-parties'
import React from 'react'

export function Dropdown({
	boxShadow,
	children,
	html,
}: {
	boxShadow: string
	children: React.ReactNode
	html: string
}) {
	const toast = useToasts()

	const copyHtml = useCallback(() => {
		if (navigator && navigator.clipboard) {
			navigator.clipboard.writeText(html)
			toast.addToast({
				// icon: 'code',
				title: 'Copied html to clipboard',
			})
		}
	}, [html, toast])

	const openInCodeSandbox = useCallback(() => {
		try {
			const sandboxUrl = getCodeSandboxUrl(html)
			window.open(sandboxUrl)
		} catch {
			toast.addToast({ title: 'There was a problem opening in CodeSandbox.' })
		}
	}, [html, toast])

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content side="right" sideOffset={10} align="start">
					<div
						// className="flex items-start flex-col text-xs bg-white rounded-[9px] w-full p-1"
						style={{
							boxShadow,
							pointerEvents: 'all',
							background: '#fdfdfd',
							border: '1px solid #e8e8e8',
							borderRadius: '4px',
							padding: '4px',
							width: '160px',
						}}
					>
						<Item action={copyHtml}>Copy HTML</Item>
						<div
							style={{
								height: '1px',
								margin: '4px -4px',
								width: 'calc(100% + 8px)',
								background: '#e8e8e8',

							}}
						></div>
						<Item action={openInCodeSandbox}>Open in CodeSandbox</Item>
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

function Item({ action, children }: { action: () => void; children: React.ReactNode }) {
	return (
		<DropdownMenu.Item asChild>
			<button
				onPointerDown={stopEventPropagation}
				onClick={action}
				onTouchEnd={action}
				style={{
					textShadow: '1px 1px #fff',
					background: 'none',
					border: 'none',
					cursor: 'pointer',
					display: 'block',
					fontSize: '14px',
					lineHeight: '1.5',
					padding: '6px 12px',
					textAlign: 'left',
					width: '100%',
					whiteSpace: 'nowrap',
				}}
			>
				{children}
			</button>
		</DropdownMenu.Item>
	)
}
