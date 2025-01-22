import { useCallback } from 'react'
import { createShapeId, getSvgAsImage, sortByIndex, useDialogs, useEditor, useToasts } from 'tldraw'
import { MakeRealShape } from '../PreviewShape/preview-shape'
import { getTextFromSelectedShapes } from '../lib/get-text-from-selected-shapes'
import { htmlify } from '../lib/htmlify'
import { blobToBase64 } from '../lib/blob-to-base64'
import { USER_PROMPT, USER_PROMPT_WITH_PREVIOUS_DESIGN } from '../lib/settings'
import { MakeRealFunc } from '../interfaces'

/**
 * @param makeRealFunction A function that returns a promise that resolves to an html string.
 */
export function useMakeReal({ makeRealFunc }: { makeRealFunc: MakeRealFunc }
) {
    const editor = useEditor()
    const { addToast } = useToasts()
    const { addDialog } = useDialogs()

    return useCallback(async () => {
        try {
            const selectedShapes = editor.getSelectedShapes()
            if (selectedShapes.length === 0) throw Error('First select something to make real.')
            const { maxX, midY } = editor.getSelectionPageBounds()
            let previewHeight = (540 * 2) / 3
            let previewWidth = (960 * 2) / 3

            const highestPreview = selectedShapes
                .filter((s) => s.type === 'preview')
                .sort(sortByIndex)
                .reverse()[0] as MakeRealShape

            if (highestPreview) {
                previewHeight = highestPreview.props.h
                previewWidth = highestPreview.props.w
            }

            const totalHeight = previewHeight
            let y = midY - totalHeight / 2

            if (highestPreview && Math.abs(y - highestPreview.y) < totalHeight) {
                y = highestPreview.y
            }

            const newShapeId = createShapeId()
            const svgResult = await editor.getSvgString(selectedShapes, {
                scale: 1,
                background: true,
            })
            if (!svgResult) throw Error(`Could not get the SVG.`)
            const blob = await getSvgAsImage(editor, svgResult.svg, {
                height: svgResult.height,
                width: svgResult.width,
                type: 'png',
                quality: 0.8,
                pixelRatio: 1,
            })
            const dataUrl = await blobToBase64(blob!)

            editor.createShape<MakeRealShape>({
                id: newShapeId,
                type: 'preview',
                x: maxX + 60, // to the right of the selection
                y: y + (previewHeight + 40), // half the height of the preview's initial shape
                props: { html: '', w: previewWidth, h: previewHeight, source: dataUrl },
                meta: {
                    loading: true,
                },
            })

            // Get any previous previews among the selected shapes
            const previousPreviews = selectedShapes.filter((shape) => {
                return shape.type === 'preview'
            }) as MakeRealShape[]

            try {
                let result: string
                const theme = editor.user.getUserPreferences().isDarkMode ? 'dark' : 'light'
                const developerPrompt = `${previousPreviews.length > 0 ? USER_PROMPT_WITH_PREVIOUS_DESIGN : USER_PROMPT} Please make your result use the ${theme} theme.`
                const image = dataUrl
                const text = getTextFromSelectedShapes(editor)

                const messages: {
                    type: 'text' | 'image'
                    text?: string
                    image?: string
                }[] = []
                if (text) {
                    messages.push({
                        type: 'text',
                        text: `Here's a list of all the text that we found in the design. Use it as a reference if anything is hard to read in the screenshot(s):\n${text}`,
                    })
                }
                for (let i = 0; i < (previousPreviews?.length ?? 0); i++) {
                    const preview = previousPreviews[i]
                    messages.push(
                        {
                            type: 'text',
                            text: `The designs also included one of your previous result. Here's the image that you used as its source:`,
                        },
                        {
                            type: 'image',
                            image: preview.props.source,
                        },
                        {
                            type: 'text',
                            text: `And here's the HTML you came up with for it: ${preview.props.html}`,
                        }
                    )
                }

                if (makeRealFunc) {
                    result = await makeRealFunc(
                        developerPrompt,
                        image,
                        messages,
                    )
                } else {
                    throw Error('Could not contact provider.')
                }

                const html = htmlify(result)
                if (html.length < 100) {
                    throw Error('Could not generate a design from those wireframes.')
                }
                editor.updateShape<MakeRealShape>({
                    id: newShapeId,
                    type: 'preview',
                    props: {
                        parts: [],
                        html: htmlify(result),
                        linkUploadVersion: 1,
                        uploadedShapeId: newShapeId,
                    },
                })
            } catch (e) {
                editor.deleteShape(newShapeId)
                throw e
            }
        } catch (e: any) {
            // console.error(e)
            if (e.message.includes('you do not have access to it')) {
                addToast({
                    title: 'OpenAI says no access',
                    description: `Sorry, you don't have access to this model on OpenAI.`,
                    actions: [
                        {
                            type: 'primary',
                            label: 'OpenAI docs',
                            onClick: () => {
                                // open a new tab with the url...
                                window.open(
                                    'https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4-gpt-4-turbo-gpt-4o-and-gpt-4o-mini',
                                    '_blank'
                                )
                            },
                        },
                        {
                            type: 'primary',
                            label: 'Learn more',
                            onClick: () => {
                                // open a new tab with the url...
                                window.open(
                                    'https://tldraw.notion.site/Make-Real-FAQs-93be8b5273d14f7386e14eb142575e6e',
                                    '_blank'
                                )
                            },
                        },
                    ],
                })
            }

            addToast({
                title: 'Something went wrong',
                description: `${e.message.slice(0, 200)}`,
                actions: [
                    {
                        type: 'primary',
                        label: 'Read the guide',
                        onClick: () => {
                            // open a new tab with the url...
                            window.open(
                                'https://tldraw.notion.site/Make-Real-FAQs-93be8b5273d14f7386e14eb142575e6e',
                                '_blank'
                            )
                        },
                    },
                ],
            })
        }
    }, [editor, addDialog, addToast])
}