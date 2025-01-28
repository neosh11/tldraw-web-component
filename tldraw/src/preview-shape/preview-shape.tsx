/* eslint-disable react-hooks/rules-of-hooks */
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import {
	DefaultSpinner,
	Geometry2d,
	HTMLContainer,
	Rectangle2d,
	ShapeUtil,
	SvgExportContext,
	TLBaseShape,
	TLResizeInfo,
	TldrawUiIcon,
	Vec,
	resizeBox,
	stopEventPropagation,
	toDomPrecision,
	useIsEditing,
	useValue,
} from 'tldraw'
import React from 'react'
import { Dropdown } from '../components/dropdown'
import { useMakeRealFunc } from '../providers/make-real-func-provider'
import { IMPROVEMENT_PROMPT } from '../lib/settings'
import html2canvas from "html2canvas";
import { htmlify } from '../lib/htmlify'


export type MakeRealShape = TLBaseShape<
	'preview',
	{
		html: string
		parts: string[]
		source: string
		w: number
		h: number
		linkUploadVersion?: number
		uploadedShapeId?: string
		dateCreated?: number
	}
>

export class PreviewShapeUtil extends ShapeUtil<MakeRealShape> {
	getGeometry(shape: MakeRealShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	static override type = 'preview' as const
	getDefaultProps(): MakeRealShape['props'] {
		return {
			html: '',
			source: '',
			parts: [],
			w: (960 * 2) / 3,
			h: (540 * 2) / 3,
			dateCreated: Date.now(),
		}
	}

	// Only allow editing once the shape's content is finished
	override canEdit = (shape: MakeRealShape) =>
		shape.props.parts.length > 0 || shape.props.html.length > 0

	override isAspectRatioLocked = (_shape: MakeRealShape) => false

	override canResize = (_shape: MakeRealShape) => true
	override onResize(shape: MakeRealShape, info: TLResizeInfo<MakeRealShape>) {
		const resized = resizeBox(shape, info)
		const next = structuredClone(info.initialShape)
		next.x = resized.x
		next.y = resized.y
		next.props.w = resized.props.w
		next.props.h = resized.props.h
		return next
	}

	override component(shape: MakeRealShape) {
		const isEditing = useIsEditing(shape.id)
		const boxShadow = useValue(
			'box shadow',
			() => {
				const rotation = this.editor.getShapePageTransform(shape)!.rotation()
				return getRotatedBoxShadow(rotation)
			},
			[this.editor]
		)

		const { linkUploadVersion, uploadedShapeId } = shape.props

		const isOnlySelected = useValue(
			'is only selected',
			() => this.editor.getOnlySelectedShapeId() === shape.id,
			[shape.id, this.editor]
		)

		const rIframe = useRef<HTMLIFrameElement>(null)
		const htmlIframe = useRef<HTMLIFrameElement>(null)

		const isLoading = linkUploadVersion === undefined || uploadedShapeId !== shape.id

		const rCursor = useRef(0)
		const { makeRealFunc } = useMakeRealFunc()

		useEffect(() => {
			if (!isLoading) {
				if (htmlIframe.current && shape.props.html) {
					const unescapedHtml = shape.props.html
						.replace(/\\n/g, '\n') // Replace \n with actual newlines
						.replace(/\\"/g, '"'); // Replace \" with actual double quotes
					htmlIframe.current.srcdoc = unescapedHtml
				}
				return
			}
			const iframe = rIframe.current
			if (!iframe) return

			if (!shape.props.parts) return

			for (let i = rCursor.current; i < shape.props.parts.length; i++) {
				const part = shape.props.parts[i]
				iframe.contentDocument?.write(part)
			}

			rCursor.current = shape.props.parts.length
		}, [isLoading, shape.props.parts])

		const textAreaRef = useRef<HTMLTextAreaElement>(null);
		// Tracks whether we're currently sending the request
		const [isUpdating, setIsUpdating] = useState(false);

		const handleSendMessage = useCallback(
			async (
				text: string,
				htmlStr: string,
				setIsUpdating: (value: boolean) => void
			): Promise<string | undefined> => {
				if (!text) return;
				try {
					setIsUpdating(true);
					// const canvas = await html2canvas(htmlIframe.current!)
					// const image = canvas.toDataURL("image/png", 1.0);
					const response = await makeRealFunc?.(
						IMPROVEMENT_PROMPT,
						"",
						[
							{ type: 'text', text: `Your old code: ${htmlify(htmlStr)}` },
							{
								type: 'text',
								text: `Client message: ${text}`,
							}]
					);
					if (!response) {
						throw new Error('No response from the AI');
					}
					setIsUpdating(false);
					return htmlify(response)
				}
				catch (e) {
					console.error(e)
				}
				finally {
					setIsUpdating(false);
				}
			}, []);

		return (
			<HTMLContainer className="tl-embed-container" id={shape.id}>
				{isLoading ? (
					<div
						style={{
							position: 'relative',
							width: '100%',
							height: '100%',
							backgroundColor: 'var(--color-culled)',
							boxShadow,
							border: '1px solid var(--color-panel-contrast)',
							borderRadius: 'var(--radius-2)',
						}}
					>
						<iframe
							ref={rIframe}
							id={`iframe-1-${shape.id}`}
							width={toDomPrecision(shape.props.w)}
							height={toDomPrecision(shape.props.h)}
							allow="geolocation;midi;usb;magnetometer;fullscreen;animations;picture-in-picture;accelerometer;vr;camera;microphone"
							draggable={false}
							style={{
								opacity: 0.62,
								backgroundColor: 'var(--color-panel)',
								pointerEvents: 'none', // isEditing ? 'auto' : 'none',
								boxShadow,
								border: '1px solid var(--color-panel-contrast)',
								borderRadius: 'var(--radius-2)',
							}}
						/>
						<div
							style={{
								all: 'unset',
								position: 'absolute',
								top: -3,
								right: -45,
								height: 40,
								width: 40,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								pointerEvents: 'all',
							}}
						>
							<DefaultSpinner />
						</div>
					</div>
				) : (
					<>
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '100%',
								backgroundColor: 'var(--color-culled)',
								boxShadow,
								border: '1px solid var(--color-panel-contrast)',
								borderRadius: 'var(--radius-2)',
							}}
						>

							<iframe
								id={`iframe-1-${shape.id}`}
								ref={htmlIframe}
								// src={`${uploadUrl}?preview=1&v=${linkUploadVersion}`}
								width={toDomPrecision(shape.props.w)}
								height={toDomPrecision(shape.props.h)}
								draggable={false}
								allow="geolocation;midi;usb;magnetometer;fullscreen;animations;picture-in-picture;accelerometer;vr;camera;microphone"
								style={{
									backgroundColor: 'var(--color-panel)',
									pointerEvents: isEditing ? 'auto' : 'none',
									boxShadow,
									border: '1px solid var(--color-panel-contrast)',
									borderRadius: 'var(--radius-2)',
								}}
							/>
							{isOnlySelected && (<>
								<div
									style={{
										all: 'unset',
										position: 'absolute',
										top: -3,
										right: -45,
										height: 40,
										width: 40,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: 'pointer',
										pointerEvents: 'all',
									}}
								>
									<Dropdown boxShadow={boxShadow} html={shape.props.html} >
										<button
											className="makereal_dropdown"
											onPointerDown={stopEventPropagation}
										>
											<TldrawUiIcon icon="dots-vertical" />
										</button>
									</Dropdown>
								</div>

								{/* Add a chatbox at the bottom of the component */}
								<div
									style={{
										position: 'absolute',
										top: '100%',
										left: 0,
										width: '100%',
										backgroundColor: 'var(--color-panel)',
										borderTop: '1px solid var(--color-panel-contrast)',
										padding: 4,
										boxShadow: '0px 0px 4px 0px var(--color-muted-1)',
									}}
								>
									<textarea
										className='base_font'
										disabled={isUpdating}
										ref={textAreaRef}
										onPointerDown={stopEventPropagation}
										style={{
											width: '100%',
											height: 100,
											border: '1px solid var(--color-panel-contrast)',
											borderRadius: 'var(--radius-2)',
											padding: 4,
										}}
										placeholder="Suggest an improvement..."
									/>

									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
											marginTop: 4,
										}}
									>

										<button
											disabled={isUpdating}
											onPointerDown={stopEventPropagation}
											onClick={
												!isUpdating ? async () => {
													const text = textAreaRef.current?.value
													if (!text) return
													const html = await handleSendMessage(
														text,
														shape.props.html,
														setIsUpdating
													)
													if (!html) return
													const next = structuredClone(shape)
													next.props.html = html
													this.editor.updateShape(next)
												} : undefined}
											className='makereal_button base_font'
										>
											{isUpdating ? <DefaultSpinner /> : 'Send'}
										</button>

									</div>
								</div>
							</>

							)}
							<div
								style={{
									textAlign: 'center',
									position: 'absolute',
									bottom: isEditing ? -40 : 0,
									padding: 4,
									fontFamily: 'inherit',
									fontSize: 12,
									left: 0,
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									pointerEvents: 'none',
								}}
							>
								<span
									style={{
										background: 'var(--color-panel)',
										padding: '4px 12px',
										borderRadius: 99,
										border: '1px solid var(--color-muted-1)',
									}}
								>
									{isEditing ? 'Click the canvas to exit' : 'Double click to interact'}
								</span>
							</div>
						</div>
					</>
				)}
			</HTMLContainer>
		)
	}

	override toSvg(shape: MakeRealShape, _ctx: SvgExportContext) {
		// while screenshot is the same as the old one, keep waiting for a new one
		return new Promise<ReactElement>((resolve, reject) => {
			if (window === undefined) {
				reject()
				return
			}

			const windowListener = (event: MessageEvent) => {
				if (event.data.screenshot && event.data?.shapeid === shape.id) {
					window.removeEventListener('message', windowListener)
					clearTimeout(timeOut)

					resolve(<PreviewImage href={event.data.screenshot} shape={shape} />)
				}
			}
			const timeOut = setTimeout(() => {
				reject()
				window.removeEventListener('message', windowListener)
			}, 2000)
			window.addEventListener('message', windowListener)
			//request new screenshot
			const firstLevelIframe = document.getElementById(`iframe-1-${shape.id}`) as HTMLIFrameElement
			if (firstLevelIframe) {
				firstLevelIframe.contentWindow?.postMessage(
					{ action: 'take-screenshot', shapeid: shape.id },
					'*'
				)
			} else {
				console.error('first level iframe not found or not accessible')
			}
		})
	}

	indicator(shape: MakeRealShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

const ROTATING_BOX_SHADOWS = [
	{
		offsetX: 0,
		offsetY: 2,
		blur: 4,
		spread: -1,
		color: '#0000003a',
	},
	{
		offsetX: 0,
		offsetY: 3,
		blur: 12,
		spread: -2,
		color: '#0000001f',
	},
]

function getRotatedBoxShadow(rotation: number) {
	const cssStrings = ROTATING_BOX_SHADOWS.map((shadow) => {
		const { offsetX, offsetY, blur, spread, color } = shadow
		const vec = new Vec(offsetX, offsetY)
		const { x, y } = vec.rot(-rotation)
		return `${x}px ${y}px ${blur}px ${spread}px ${color}`
	})
	return cssStrings.join(', ')
}

function PreviewImage({ shape, href }: { shape: MakeRealShape; href: string }) {
	return <image href={href} width={shape.props.w.toString()} height={shape.props.h.toString()} />
}
